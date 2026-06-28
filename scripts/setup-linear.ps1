#Requires -Version 5
# setup-linear.ps1 — native Windows PowerShell setup for Hermes -> Linear.
# Reads LINEAR_API_KEY with hidden input (Read-Host -AsSecureString); never prints,
# logs, or commits the secret. Run from the repo:  powershell -ExecutionPolicy Bypass -File scripts\setup-linear.ps1
$ErrorActionPreference = 'Stop'
$Root      = Split-Path -Parent $PSScriptRoot
$EnvFile   = Join-Path $Root '.env'
$GitIgnore = Join-Path $Root '.gitignore'

Write-Host "Hermes -> Linear setup (PowerShell)"
Write-Host "Repo: $Root"

# ensure .env is gitignored
if (-not (Test-Path $GitIgnore)) { New-Item -ItemType File -Path $GitIgnore | Out-Null }
$gi = @(Get-Content -LiteralPath $GitIgnore -ErrorAction SilentlyContinue)
if ($gi -notcontains '.env') {
  Add-Content -LiteralPath $GitIgnore -Value "`n# Local secrets (added by setup-linear)`n.env"
  Write-Host "[ok] added .env to .gitignore"
} else { Write-Host "[ok] .env already in .gitignore" }

# create .env if missing
if (-not (Test-Path $EnvFile)) { New-Item -ItemType File -Path $EnvFile | Out-Null; Write-Host "[ok] created .env" }

# lock permissions to current user (Windows equivalent of chmod 600)
try {
  icacls $EnvFile /inheritance:r /grant:r "$($env:USERNAME):F" | Out-Null
  Write-Host "[ok] .env permissions restricted to $($env:USERNAME)"
} catch { Write-Host "[!] could not set ACL (continuing)" }

# load existing .env
$map = [ordered]@{}
foreach ($line in @(Get-Content -LiteralPath $EnvFile -ErrorAction SilentlyContinue)) {
  $t = $line.Trim()
  if ($t -eq '' -or $t.StartsWith('#')) { continue }
  $i = $t.IndexOf('=')
  if ($i -gt 0) { $map[$t.Substring(0, $i)] = $t.Substring($i + 1) }
}

# hidden API key
$secure = Read-Host -Prompt 'Linear API key (input hidden)' -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try { $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
if ($key) { $map['LINEAR_API_KEY'] = $key; Write-Host "[ok] stored LINEAR_API_KEY (hidden)" }
else { Write-Host "[!] no key entered - leaving existing key unchanged" }

$teamKey = Read-Host -Prompt 'Linear team KEY (e.g. DEA) [enter to skip]'
if ($teamKey) { $map['LINEAR_TEAM_KEY'] = $teamKey }
$teamId = Read-Host -Prompt 'Linear team ID (UUID, optional) [enter to skip]'
if ($teamId) { $map['LINEAR_TEAM_ID'] = $teamId }
$projectId = Read-Host -Prompt 'Linear project ID (optional) [enter to skip]'
if ($projectId) { $map['LINEAR_PROJECT_ID'] = $projectId }

if (-not $map.Contains('LINEAR_WRITE_ENABLED'))  { $map['LINEAR_WRITE_ENABLED']  = 'false' }
if (-not $map.Contains('HERMES_SOURCE_OF_TRUTH')) { $map['HERMES_SOURCE_OF_TRUTH'] = 'docs' }

# write .env WITHOUT BOM
$lines = foreach ($k in $map.Keys) { "$k=$($map[$k])" }
[System.IO.File]::WriteAllText($EnvFile, (($lines -join "`n") + "`n"), (New-Object System.Text.UTF8Encoding($false)))
$key = $null
try { icacls $EnvFile /inheritance:r /grant:r "$($env:USERNAME):F" | Out-Null } catch {}

Write-Host ""
Write-Host "Done. Summary (secrets hidden):"
if ($map['LINEAR_API_KEY']) { Write-Host "  LINEAR_API_KEY       : set (hidden)" } else { Write-Host "  LINEAR_API_KEY       : MISSING" }
Write-Host "  LINEAR_TEAM_KEY      : $($map['LINEAR_TEAM_KEY'])"
Write-Host "  LINEAR_TEAM_ID       : $($map['LINEAR_TEAM_ID'])"
Write-Host "  LINEAR_PROJECT_ID    : $($map['LINEAR_PROJECT_ID'])"
Write-Host "  LINEAR_WRITE_ENABLED : $($map['LINEAR_WRITE_ENABLED'])"
Write-Host ""
Write-Host "Next: npm run linear:health"
