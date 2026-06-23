#Requires -Version 5
<#
  Read-only RangeClarity daily project status snapshot.

  This script only prints local status information. It does not stage, commit,
  push, delete, reset, call Linear, run Hermes, or write project files.
#>

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot

function Write-Section {
  param([Parameter(Mandatory = $true)][string]$Title)

  Write-Host ""
  Write-Host "== $Title =="
}

function Test-ConfiguredValue {
  param([AllowNull()][string]$Value)

  return -not [string]::IsNullOrWhiteSpace($Value)
}

function Read-EnvFileMap {
  param([Parameter(Mandatory = $true)][string]$Path)

  $map = @{}
  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    return $map
  }

  foreach ($line in @(Get-Content -LiteralPath $Path -ErrorAction Stop)) {
    $trimmed = $line.Trim()
    if ($trimmed -eq '' -or $trimmed.StartsWith('#')) {
      continue
    }

    $separator = $trimmed.IndexOf('=')
    if ($separator -le 0) {
      continue
    }

    $key = $trimmed.Substring(0, $separator).Trim()
    $value = $trimmed.Substring($separator + 1).Trim()
    if ($key) {
      $map[$key] = $value
    }
  }

  return $map
}

Write-Host "RangeClarity Daily Status"
Write-Host "Repo: $Root"
Write-Host "Mode: read-only"

Write-Section "Git Status"
& git --no-optional-locks -c core.excludesfile= -C $Root status --short --branch

Write-Section "Last 5 Commits"
& git --no-optional-locks -c core.excludesfile= -C $Root log -5 --oneline --decorate

Write-Section "Key Docs"
$keyDocs = @(
  'AGENTS.md',
  'README.md',
  'PROMPT.md',
  'RANGECLARITY_MASTER_PLAN.md',
  'RANGECLARITY_CORE_INDICATOR_SPEC.md',
  'docs/current-sprint.md',
  'docs/project-state.md',
  'docs/kanban.md',
  'docs/launch-readiness.md',
  'docs/ops/current-loop-status.md',
  'docs/ops/daily-routine.md',
  'docs/linear-integration.md'
)

foreach ($doc in $keyDocs) {
  $path = Join-Path $Root $doc
  if (Test-Path -LiteralPath $path -PathType Leaf) {
    Write-Host "[ok]      $doc"
  } else {
    Write-Host "[missing] $doc"
  }
}

Write-Section "Linear Env Vars"
$envFiles = @(
  (Join-Path $Root '.env'),
  (Join-Path $Root '.env.local')
)

$fileEnv = @{}
foreach ($envFile in $envFiles) {
  $entries = Read-EnvFileMap -Path $envFile
  foreach ($key in $entries.Keys) {
    if (-not $fileEnv.ContainsKey($key) -or -not (Test-ConfiguredValue $fileEnv[$key])) {
      $fileEnv[$key] = $entries[$key]
    }
  }
}

$linearVars = @(
  'LINEAR_API_KEY',
  'LINEAR_TEAM_KEY',
  'LINEAR_TEAM_ID',
  'LINEAR_PROJECT_ID',
  'LINEAR_WRITE_ENABLED'
)

foreach ($name in $linearVars) {
  $processValue = [Environment]::GetEnvironmentVariable($name)
  $fileValue = if ($fileEnv.ContainsKey($name)) { $fileEnv[$name] } else { $null }
  $configured = (Test-ConfiguredValue $processValue) -or (Test-ConfiguredValue $fileValue)

  if ($configured) {
    Write-Host "[set]     $name"
  } else {
    Write-Host "[missing] $name"
  }
}

Write-Host ""
Write-Host "Done. No values printed."
