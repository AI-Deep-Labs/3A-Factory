# 3A-Factory Windows PowerShell Installer
# For Windows PowerShell 5.1+ and PowerShell 7+
# Installs workflow files for Claude, Gemini, and Cursor.

[CmdletBinding()]
param(
    [string]$Target = (Get-Location).Path,
    [string]$TemplateRoot,
    [switch]$Force,
    [switch]$NoBackup,
    [switch]$DryRun,
    [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version 2.0

function Write-Info([string]$Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Ok([string]$Message) { Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-WarnLine([string]$Message) { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Err([string]$Message) { Write-Host "[ERROR] $Message" -ForegroundColor Red }

function Resolve-FullPath([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Force -Path $Path | Out-Null
    }
    return (Resolve-Path -LiteralPath $Path).Path
}

$ScriptDir = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($ScriptDir)) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
if ([string]::IsNullOrWhiteSpace($TemplateRoot)) {
    $TemplateRoot = Split-Path -Parent $ScriptDir
}

$TemplateRoot = (Resolve-Path -LiteralPath $TemplateRoot).Path
$TargetRoot = Resolve-FullPath $Target

# Avoid polluting the template developer's repository root during local package install or run.
if ($TargetRoot -eq $TemplateRoot) {
    Write-Host "[OK] Running in development repository. Skipping template installation to avoid root pollution." -ForegroundColor Green
    exit 0
}

$TemplatesDir = Join-Path $TemplateRoot "templates"

if (-not (Test-Path -LiteralPath $TemplatesDir -PathType Container)) {
    Write-Err "Template directory not found: $TemplatesDir"
    Write-Err "Expected v2 layout: <template-root>\AGENTS.md and <template-root>\templates\..."
    exit 1
}

$TargetDirs = @(
    "docs\requirements",
    "docs\designs",
    "docs\reviews",
    "docs\qa",
    "docs\release-notes",
    ".agents\templates",
    ".agents\compact",
    ".agents\issues",
    ".claude\commands",
    ".gemini\commands",
    ".gemini\prompts",
    ".cursor\rules"
)

$RequiredFiles = @(
    @{ Src = "AGENTS.md"; Dest = "AGENTS.md" },
    @{ Src = "CLAUDE.md"; Dest = "CLAUDE.md" },
    @{ Src = "GEMINI.md"; Dest = "GEMINI.md" },
    @{ Src = "templates\WORKFLOW.md"; Dest = "WORKFLOW.md" },
    @{ Src = "templates\.agents\templates\SPEC-template.md"; Dest = ".agents\templates\SPEC-template.md" },
    @{ Src = "templates\.agents\templates\PLAN-template.md"; Dest = ".agents\templates\PLAN-template.md" },
    @{ Src = "templates\.agents\templates\ADR-template.md"; Dest = ".agents\templates\ADR-template.md" },
    @{ Src = "templates\.agents\templates\RAW-REQ-template.md"; Dest = ".agents\templates\RAW-REQ-template.md" },
    @{ Src = "templates\.agents\templates\DISCOVERY-template.md"; Dest = ".agents\templates\DISCOVERY-template.md" },
    @{ Src = "templates\.agents\templates\ANALYSIS-template.md"; Dest = ".agents\templates\ANALYSIS-template.md" },
    @{ Src = "templates\.agents\templates\DESIGN-template.md"; Dest = ".agents\templates\DESIGN-template.md" },
    @{ Src = "templates\.agents\templates\REVIEW-template.md"; Dest = ".agents\templates\REVIEW-template.md" },
    @{ Src = "templates\.agents\templates\QA-REPORT-template.md"; Dest = ".agents\templates\QA-REPORT-template.md" },
    @{ Src = "templates\.agents\templates\RELEASE-template.md"; Dest = ".agents\templates\RELEASE-template.md" },
    @{ Src = "templates\.cursor\rules\ai-workflow.mdc"; Dest = ".cursor\rules\ai-workflow.mdc" }
)

$OptionalFiles = @(
    @{ Src = ".cursorrules"; Dest = ".cursorrules" }
)

$Stats = [ordered]@{
    CreatedDirs = 0
    NewFiles = 0
    UpdatedFiles = 0
    Backups = 0
    Unchanged = 0
    Skipped = 0
}

function Ensure-Directory([string]$RelativeDir) {
    $FullDir = Join-Path $TargetRoot $RelativeDir
    if (-not (Test-Path -LiteralPath $FullDir -PathType Container)) {
        if ($DryRun) {
            Write-Host "[DRY-RUN][MKDIR] $RelativeDir"
        } else {
            New-Item -ItemType Directory -Force -Path $FullDir | Out-Null
        }
        $Stats.CreatedDirs++
    }
}

function Same-FileContent([string]$Source, [string]$Destination) {
    if (-not (Test-Path -LiteralPath $Destination -PathType Leaf)) { return $false }
    $srcHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $Source).Hash
    $dstHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $Destination).Hash
    return $srcHash -eq $dstHash
}

function Same-StringContent([string]$DestPath, [string]$Content) {
    if (-not (Test-Path -LiteralPath $DestPath -PathType Leaf)) { return $false }
    $DestContent = [System.IO.File]::ReadAllText($DestPath)
    $NormDest = $DestContent -replace "\r\n", "`n"
    $NormContent = $Content -replace "\r\n", "`n"
    return $NormDest -eq $NormContent
}

function Copy-WorkflowFile([hashtable]$Item, [bool]$Required) {
    $SrcFile = Join-Path $TemplateRoot $Item.Src
    $DestFile = Join-Path $TargetRoot $Item.Dest

    if (-not (Test-Path -LiteralPath $SrcFile -PathType Leaf)) {
        if ($Required) {
            throw "Required template file not found: $SrcFile"
        }
        $Stats.Skipped++
        if ($VerboseOutput) { Write-Host "[SKIP][OPTIONAL MISSING] $($Item.Src)" -ForegroundColor DarkGray }
        return
    }

    $DestDir = Split-Path -Parent $DestFile
    if (-not (Test-Path -LiteralPath $DestDir -PathType Container)) {
        if ($DryRun) {
            Write-Host "[DRY-RUN][MKDIR] $($DestDir.Replace($TargetRoot, '').TrimStart('\'))"
        } else {
            New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
        }
        $Stats.CreatedDirs++
    }

    if (Test-Path -LiteralPath $DestFile -PathType Leaf) {
        if (Same-FileContent -Source $SrcFile -Destination $DestFile) {
            $Stats.Unchanged++
            if ($VerboseOutput) { Write-Host "[UNCHANGED] $($Item.Dest)" -ForegroundColor DarkGray }
            return
        }

        if (-not $Force) {
            $Stats.Skipped++
            Write-WarnLine "Exists, skipped: $($Item.Dest) (use -Force to overwrite)"
            return
        }

        if (-not $NoBackup) {
            $Timestamp = Get-Date -Format "yyyyMMddHHmmss"
            $BackupFile = "$DestFile.bak.$Timestamp"
            if ($DryRun) {
                Write-Host "[DRY-RUN][BACKUP] $($Item.Dest) -> $(Split-Path -Leaf $BackupFile)"
            } else {
                Copy-Item -LiteralPath $DestFile -Destination $BackupFile -Force
            }
            $Stats.Backups++
        }

        if ($DryRun) {
            Write-Host "[DRY-RUN][UPDATE] $($Item.Dest)"
        } else {
            Copy-Item -LiteralPath $SrcFile -Destination $DestFile -Force
        }
        $Stats.UpdatedFiles++
    } else {
        if ($DryRun) {
            Write-Host "[DRY-RUN][NEW] $($Item.Dest)"
        } else {
            Copy-Item -LiteralPath $SrcFile -Destination $DestFile -Force
        }
        $Stats.NewFiles++
    }
}

function Write-GeneratedFile([string]$DestRelativePath, [string]$FileContent) {
    $DestFile = Join-Path $TargetRoot $DestRelativePath
    $DestDir = Split-Path -Parent $DestFile

    if (-not (Test-Path -LiteralPath $DestDir -PathType Container)) {
        if ($DryRun) {
            Write-Host "[DRY-RUN][MKDIR] $($DestDir.Replace($TargetRoot, '').TrimStart('\'))"
        } else {
            New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
        }
        $Stats.CreatedDirs++
    }

    if (Test-Path -LiteralPath $DestFile -PathType Leaf) {
        if (Same-StringContent -DestPath $DestFile -Content $FileContent) {
            $Stats.Unchanged++
            if ($VerboseOutput) { Write-Host "[UNCHANGED] $DestRelativePath" -ForegroundColor DarkGray }
            return
        }

        if (-not $Force) {
            $Stats.Skipped++
            Write-WarnLine "Exists, skipped: $DestRelativePath (use -Force to overwrite)"
            return
        }

        if (-not $NoBackup) {
            $Timestamp = Get-Date -Format "yyyyMMddHHmmss"
            $BackupFile = "$DestFile.bak.$Timestamp"
            if ($DryRun) {
                Write-Host "[DRY-RUN][BACKUP] $DestRelativePath -> $(Split-Path -Leaf $BackupFile)"
            } else {
                Copy-Item -LiteralPath $DestFile -Destination $BackupFile -Force
            }
            $Stats.Backups++
        }

        if ($DryRun) {
            Write-Host "[DRY-RUN][UPDATE] $DestRelativePath"
        } else {
            [System.IO.File]::WriteAllText($DestFile, $FileContent)
        }
        $Stats.UpdatedFiles++
    } else {
        if ($DryRun) {
            Write-Host "[DRY-RUN][NEW] $DestRelativePath"
        } else {
            [System.IO.File]::WriteAllText($DestFile, $FileContent)
        }
        $Stats.NewFiles++
    }
}

function Process-Skills {
    $SkillsDir = Join-Path $TemplatesDir "skills"
    if (-not (Test-Path -LiteralPath $SkillsDir -PathType Container)) {
        Write-WarnLine "Source skills directory not found: $SkillsDir"
        return
    }

    $SkillFiles = Get-ChildItem -Path $SkillsDir -Filter "*.md" -Recurse -File
    foreach ($File in $SkillFiles) {
        try {
            $Content = [System.IO.File]::ReadAllText($File.FullName)
            $Normalized = $Content -replace "\r\n", "`n"
            if (-not $Normalized.StartsWith("---`n")) {
                throw "File does not start with frontmatter: $($File.FullName)"
            }
            $EndIdx = $Normalized.IndexOf("`n---`n", 4)
            if ($EndIdx -eq -1) {
                throw "Invalid frontmatter in file: $($File.FullName)"
            }
            $FrontmatterText = $Normalized.Substring(4, $EndIdx - 4)
            $Body = $Normalized.Substring($EndIdx + 5)

            $Metadata = @{}
            $Lines = $FrontmatterText -split "`n"
            foreach ($Line in $Lines) {
                $ColonIdx = $Line.IndexOf(':')
                if ($ColonIdx -eq -1) { continue }
                $Key = $Line.Substring(0, $ColonIdx).Trim()
                $Val = $Line.Substring($ColonIdx + 1).Trim()
                if (($Val.StartsWith('"') -and $Val.EndsWith('"')) -or ($Val.StartsWith("'") -and $Val.EndsWith("'"))) {
                    $Val = $Val.Substring(1, $Val.Length - 2)
                }
                $Metadata[$Key] = $Val
            }

            $Name = $Metadata["name"]
            if ([string]::IsNullOrEmpty($Name)) {
                $Name = $File.BaseName
            }
            $Desc = $Metadata["description"]
            if ($null -eq $Desc) {
                $Desc = ""
            }

            if ($VerboseOutput) {
                Write-Info "Processing skill: $Name"
            }

            # 1. Generic Agent Skill
            $GenericFM = "---`nname: $Name`ndescription: $Desc`n"
            if ($Metadata.ContainsKey("disable-model-invocation")) {
                $GenericFM += "disable-model-invocation: $($Metadata['disable-model-invocation'])`n"
            }
            if ($Metadata.ContainsKey("argument-hint")) {
                $GenericFM += "argument-hint: $($Metadata['argument-hint'])`n"
            }
            $GenericFM += "---`n"
            Write-GeneratedFile -DestRelativePath ".agents\skills\$Name\SKILL.md" -FileContent "$GenericFM$Body"

            # 2. Claude Agent Skill
            Write-GeneratedFile -DestRelativePath ".claude\skills\$Name\SKILL.md" -FileContent "$GenericFM$Body"

            # 3. Cursor Rule
            $CursorFM = "---`ndescription: $Desc`nglobs: *`n"
            if ($Metadata.ContainsKey("alwaysApply")) {
                $CursorFM += "alwaysApply: $($Metadata['alwaysApply'])`n"
            } else {
                $CursorFM += "alwaysApply: false`n"
            }
            $CursorFM += "---`n"
            Write-GeneratedFile -DestRelativePath ".cursor\rules\$Name.mdc" -FileContent "$CursorFM$Body"

            # 4. Claude Command
            $ClaudeCmd = "---`ndescription: $Desc`n---`n`nRead and execute .claude\skills\$Name\SKILL.md. Arguments: `$ARGUMENTS`n"
            Write-GeneratedFile -DestRelativePath ".claude\commands\$Name.md" -FileContent $ClaudeCmd

            # 5. Gemini Command
            $EscapedDesc = $Desc -replace '"', '\"'
            $GeminiCmd = "description = `"$EscapedDesc`"`nprompt = `"`"`"`nRead AGENTS.md first, then read .agents/skills/$Name/SKILL.md and execute that workflow.`nArguments: {{args}}`n`"`"`"`n"
            Write-GeneratedFile -DestRelativePath ".gemini\commands\$Name.toml" -FileContent $GeminiCmd

        } catch {
            Write-WarnLine "Failed to parse or convert skill file $($File.FullName): $($_.Exception.Message)"
        }
    }
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  3A Factory Installer" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Template root: $TemplateRoot"
Write-Host "Target root:   $TargetRoot"
Write-Host "Mode:          $(if ($DryRun) { 'dry-run' } else { 'write' })"
Write-Host "Overwrite:     $(if ($Force) { 'yes' } else { 'no' })"
Write-Host "Backup:        $(if ($NoBackup) { 'no' } else { 'yes' })"
Write-Host "---------------------------------------------" -ForegroundColor Cyan

foreach ($dir in $TargetDirs) {
    Ensure-Directory $dir
}

foreach ($item in $RequiredFiles) {
    Copy-WorkflowFile -Item $item -Required $true
}

foreach ($item in $OptionalFiles) {
    Copy-WorkflowFile -Item $item -Required $false
}

Process-Skills

Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Ok "Installation completed."
Write-Host "Created dirs: $($Stats.CreatedDirs)"
Write-Host "New files:    $($Stats.NewFiles)"
Write-Host "Updated:      $($Stats.UpdatedFiles)"
Write-Host "Backups:      $($Stats.Backups)"
Write-Host "Unchanged:    $($Stats.Unchanged)"
Write-Host "Skipped:      $($Stats.Skipped)"
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Claude Code: use /project-manager, /grill-me, /analyze, /design, /spec, /develop, /review, /qa, /deploy, …"
Write-Host "Gemini CLI:   use custom commands from .gemini/commands/*.toml."
Write-Host "Cursor:       project rules under .cursor/rules/ (incl. ai-workflow.mdc)."
Write-Host "Artifacts:    docs/{requirements,designs,reviews,qa,release-notes}"
Write-Host "Source of truth sync: AGENTS.md + .agents/skills (Claude/Gemini/Cursor)."
Write-Host "=============================================" -ForegroundColor Cyan
