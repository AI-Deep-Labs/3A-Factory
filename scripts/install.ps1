# 3A-Factory Windows PowerShell Installer
# Thin wrapper around scripts/install.js — forwards all arguments.

[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$RemainingArgs
)

$ErrorActionPreference = "Stop"
$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$InstallJs = Join-Path $ScriptDir "install.js"

if (-not (Test-Path -LiteralPath $InstallJs)) {
    Write-Host "[ERROR] install.js not found: $InstallJs" -ForegroundColor Red
    exit 1
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[ERROR] Node.js is required. Install Node then retry." -ForegroundColor Red
    exit 1
}

# Preserve INIT_CWD if caller set Target via legacy style; otherwise cwd
if (-not $env:INIT_CWD) {
    $env:INIT_CWD = (Get-Location).Path
}

& node $InstallJs @RemainingArgs
exit $LASTEXITCODE
