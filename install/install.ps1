# 3A-Factory Windows PowerShell Installer
# For Windows PowerShell 5.1+ and PowerShell 7+
# Installs portable + native agent workflow files for Claude, Gemini, Cursor, and generic agents.

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
    ".agents\requirements",
    ".agents\specs",
    ".agents\plans",
    ".agents\decisions",
    ".agents\reviews",
    ".agents\runs",
    ".agents\templates",
    ".agents\skills\init-ai-workflow",
    ".agents\skills\grill-me",
    ".agents\skills\spec",
    ".agents\skills\plan",
    ".agents\skills\code",
    ".agents\skills\review",
    ".agents\skills\project-overview",
    ".agents\compact",
    ".agents\issues",
    ".agents\skills\adr",
    ".agents\skills\caveman",
    ".agents\skills\handoff",
    ".agents\skills\qa",
    ".claude\skills\init-ai-workflow",
    ".claude\skills\grill-me",
    ".claude\skills\spec",
    ".claude\skills\plan",
    ".claude\skills\code",
    ".claude\skills\review",
    ".claude\skills\project-overview",
    ".claude\skills\adr",
    ".claude\skills\caveman",
    ".claude\skills\handoff",
    ".claude\skills\qa",
    ".claude\commands",
    ".gemini\commands",
    ".gemini\prompts",
    ".cursor\rules",
    ".cursor\prompts"
)

$RequiredFiles = @(
    @{ Src = "AGENTS.md"; Dest = "AGENTS.md" },
    @{ Src = "CLAUDE.md"; Dest = "CLAUDE.md" },
    @{ Src = "GEMINI.md"; Dest = "GEMINI.md" },
    @{ Src = "templates\WORKFLOW.md"; Dest = "WORKFLOW.md" },
    @{ Src = "templates\.agents\templates\SPEC-template.md"; Dest = ".agents\templates\SPEC-template.md" },
    @{ Src = "templates\.agents\templates\PLAN-template.md"; Dest = ".agents\templates\PLAN-template.md" },
    @{ Src = "templates\.agents\templates\ADR-template.md"; Dest = ".agents\templates\ADR-template.md" },
    @{ Src = "templates\.claude\commands\grill-me.md"; Dest = ".claude\commands\grill-me.md" },
    @{ Src = "templates\.claude\commands\spec.md"; Dest = ".claude\commands\spec.md" },
    @{ Src = "templates\.claude\commands\plan.md"; Dest = ".claude\commands\plan.md" },
    @{ Src = "templates\.claude\commands\code.md"; Dest = ".claude\commands\code.md" },
    @{ Src = "templates\.claude\commands\review.md"; Dest = ".claude\commands\review.md" },
    @{ Src = "templates\.claude\commands\init-ai-workflow.md"; Dest = ".claude\commands\init-ai-workflow.md" },
    @{ Src = "templates\.claude\commands\adr.md"; Dest = ".claude\commands\adr.md" },
    @{ Src = "templates\.claude\commands\caveman.md"; Dest = ".claude\commands\caveman.md" },
    @{ Src = "templates\.claude\commands\handoff.md"; Dest = ".claude\commands\handoff.md" },
    @{ Src = "templates\.claude\commands\qa.md"; Dest = ".claude\commands\qa.md" },
    @{ Src = "templates\.gemini\commands\grill-me.toml"; Dest = ".gemini\commands\grill-me.toml" },
    @{ Src = "templates\.gemini\commands\spec.toml"; Dest = ".gemini\commands\spec.toml" },
    @{ Src = "templates\.gemini\commands\plan.toml"; Dest = ".gemini\commands\plan.toml" },
    @{ Src = "templates\.gemini\commands\code.toml"; Dest = ".gemini\commands\code.toml" },
    @{ Src = "templates\.gemini\commands\review.toml"; Dest = ".gemini\commands\review.toml" },
    @{ Src = "templates\.gemini\commands\init-ai-workflow.toml"; Dest = ".gemini\commands\init-ai-workflow.toml" },
    @{ Src = "templates\.gemini\commands\project-overview.toml"; Dest = ".gemini\commands\project-overview.toml" },
    @{ Src = "templates\.gemini\commands\adr.toml"; Dest = ".gemini\commands\adr.toml" },
    @{ Src = "templates\.gemini\commands\caveman.toml"; Dest = ".gemini\commands\caveman.toml" },
    @{ Src = "templates\.gemini\commands\handoff.toml"; Dest = ".gemini\commands\handoff.toml" },
    @{ Src = "templates\.gemini\commands\qa.toml"; Dest = ".gemini\commands\qa.toml" },
    @{ Src = "templates\.cursor\rules\alex-workflow.mdc"; Dest = ".cursor\rules\alex-workflow.mdc" },
    @{ Src = "templates\.cursor\prompts\grill-me.md"; Dest = ".cursor\prompts\grill-me.md" },
    @{ Src = "templates\.cursor\prompts\spec.md"; Dest = ".cursor\prompts\spec.md" },
    @{ Src = "templates\.cursor\prompts\plan.md"; Dest = ".cursor\prompts\plan.md" },
    @{ Src = "templates\.cursor\prompts\code.md"; Dest = ".cursor\prompts\code.md" },
    @{ Src = "templates\.cursor\prompts\review.md"; Dest = ".cursor\prompts\review.md" },
    @{ Src = "templates\.cursor\prompts\init-ai-workflow.md"; Dest = ".cursor\prompts\init-ai-workflow.md" },
    @{ Src = "templates\.cursor\prompts\project-overview.md"; Dest = ".cursor\prompts\project-overview.md" },
    @{ Src = "templates\.cursor\prompts\adr.md"; Dest = ".cursor\prompts\adr.md" },
    @{ Src = "templates\.cursor\prompts\caveman.md"; Dest = ".cursor\prompts\caveman.md" },
    @{ Src = "templates\.cursor\prompts\handoff.md"; Dest = ".cursor\prompts\handoff.md" },
    @{ Src = "templates\.cursor\prompts\qa.md"; Dest = ".cursor\prompts\qa.md" },
    @{ Src = "templates\.agents\skills\init-ai-workflow\SKILL.md"; Dest = ".agents\skills\init-ai-workflow\SKILL.md" },
    @{ Src = "templates\.agents\skills\grill-me\SKILL.md"; Dest = ".agents\skills\grill-me\SKILL.md" },
    @{ Src = "templates\.agents\skills\spec\SKILL.md"; Dest = ".agents\skills\spec\SKILL.md" },
    @{ Src = "templates\.agents\skills\plan\SKILL.md"; Dest = ".agents\skills\plan\SKILL.md" },
    @{ Src = "templates\.agents\skills\code\SKILL.md"; Dest = ".agents\skills\code\SKILL.md" },
    @{ Src = "templates\.agents\skills\review\SKILL.md"; Dest = ".agents\skills\review\SKILL.md" },
    @{ Src = "templates\.agents\skills\project-overview\SKILL.md"; Dest = ".agents\skills\project-overview\SKILL.md" },
    @{ Src = "templates\.agents\skills\adr\SKILL.md"; Dest = ".agents\skills\adr\SKILL.md" },
    @{ Src = "templates\.agents\skills\caveman\SKILL.md"; Dest = ".agents\skills\caveman\SKILL.md" },
    @{ Src = "templates\.agents\skills\handoff\SKILL.md"; Dest = ".agents\skills\handoff\SKILL.md" },
    @{ Src = "templates\.agents\skills\qa\SKILL.md"; Dest = ".agents\skills\qa\SKILL.md" },
    @{ Src = "templates\.claude\skills\init-ai-workflow\SKILL.md"; Dest = ".claude\skills\init-ai-workflow\SKILL.md" },
    @{ Src = "templates\.claude\skills\grill-me\SKILL.md"; Dest = ".claude\skills\grill-me\SKILL.md" },
    @{ Src = "templates\.claude\skills\spec\SKILL.md"; Dest = ".claude\skills\spec\SKILL.md" },
    @{ Src = "templates\.claude\skills\plan\SKILL.md"; Dest = ".claude\skills\plan\SKILL.md" },
    @{ Src = "templates\.claude\skills\code\SKILL.md"; Dest = ".claude\skills\code\SKILL.md" },
    @{ Src = "templates\.claude\skills\review\SKILL.md"; Dest = ".claude\skills\review\SKILL.md" },
    @{ Src = "templates\.claude\skills\project-overview\SKILL.md"; Dest = ".claude\skills\project-overview\SKILL.md" },
    @{ Src = "templates\.claude\skills\adr\SKILL.md"; Dest = ".claude\skills\adr\SKILL.md" },
    @{ Src = "templates\.claude\skills\caveman\SKILL.md"; Dest = ".claude\skills\caveman\SKILL.md" },
    @{ Src = "templates\.claude\skills\handoff\SKILL.md"; Dest = ".claude\skills\handoff\SKILL.md" },
    @{ Src = "templates\.claude\skills\qa\SKILL.md"; Dest = ".claude\skills\qa\SKILL.md" }
)

$OptionalFiles = @(
    @{ Src = ".cursorrules"; Dest = ".cursorrules" },
    @{ Src = "templates\.gemini\prompts\grill-me.md"; Dest = ".gemini\prompts\grill-me.md" },
    @{ Src = "templates\.gemini\prompts\spec.md"; Dest = ".gemini\prompts\spec.md" },
    @{ Src = "templates\.gemini\prompts\plan.md"; Dest = ".gemini\prompts\plan.md" },
    @{ Src = "templates\.gemini\prompts\code.md"; Dest = ".gemini\prompts\code.md" },
    @{ Src = "templates\.gemini\prompts\review.md"; Dest = ".gemini\prompts\review.md" },
    @{ Src = "templates\.gemini\prompts\init-ai-workflow.md"; Dest = ".gemini\prompts\init-ai-workflow.md" },
    @{ Src = "templates\.gemini\prompts\adr.md"; Dest = ".gemini\prompts\adr.md" }
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

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  ALEX AI Workflow v2 Installer" -ForegroundColor Cyan
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

Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Ok "Installation completed."
Write-Host "Created dirs: $($Stats.CreatedDirs)"
Write-Host "New files:    $($Stats.NewFiles)"
Write-Host "Updated:      $($Stats.UpdatedFiles)"
Write-Host "Backups:      $($Stats.Backups)"
Write-Host "Unchanged:    $($Stats.Unchanged)"
Write-Host "Skipped:      $($Stats.Skipped)"
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Claude Code: use /grill-me, /spec, /plan, /code, /review, or native skills under .claude/skills."
Write-Host "Gemini CLI:   use custom commands from .gemini/commands/*.toml."
Write-Host "Cursor:       project rules are installed under .cursor/rules/alex-workflow.mdc."
Write-Host "Generic:      AGENTS.md + .agents/skills are installed as the portable source of truth."
Write-Host "=============================================" -ForegroundColor Cyan
