<#
============================================================
 RangeClarity PC - READ-ONLY Security and Privacy Audit
============================================================
 SAFE BY DESIGN:
   - Read-only. Makes NO changes to your system.
   - Never prints secret VALUES (only file paths + a flag).
   - Uploads nothing. Deletes nothing. Disables nothing.
 HOW TO RUN:
   1. Open PowerShell (right-click, "Run as administrator"
      for full coverage; it also works without admin).
   2. If blocked by execution policy, run this once for the
      current window only:
         Set-ExecutionPolicy -Scope Process -Bypass
   3. Run:
         .\windows-security-audit.ps1
   4. Copy ALL output and paste it back.
 NOTE: ASCII-only on purpose to avoid encoding errors.
============================================================
#>

$ErrorActionPreference = "SilentlyContinue"
function Section($t){ Write-Host "`n==================== $t ====================" -ForegroundColor Cyan }
function Item($t){ Write-Host ("-- " + $t) -ForegroundColor Yellow }
function Note($t){ Write-Host ("   " + $t) }

$IsAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
Write-Host "RangeClarity READ-ONLY Security Audit" -ForegroundColor Green
Write-Host ("Run time: " + (Get-Date))
Write-Host ("Admin elevation: " + $(if($IsAdmin){"YES"}else{"NO (some checks limited)"}))

# 1. OS / version
Section "1. WINDOWS VERSION"
try {
  $os = Get-CimInstance Win32_OperatingSystem
  Note ("Product : " + $os.Caption)
  Note ("Version : " + $os.Version + "  Build: " + $os.BuildNumber)
  Note ("Installed: " + $os.InstallDate)
  Note ("Last boot: " + $os.LastBootUpTime)
} catch { Note "Could not read OS info." }

# 2. Updates via winget
Section "2. APP UPDATES (winget upgrade list)"
try { winget upgrade --accept-source-agreements 2>$null | Select-Object -First 25 } catch { Note "winget not available." }

# 3. Defender
Section "3. MICROSOFT DEFENDER STATUS"
try {
  $mp = Get-MpComputerStatus
  Note ("RealTimeProtection : " + $mp.RealTimeProtectionEnabled)
  Note ("AntivirusEnabled   : " + $mp.AntivirusEnabled)
  Note ("AntispywareEnabled : " + $mp.AntispywareEnabled)
  Note ("TamperProtection   : " + $mp.IsTamperProtected)
  Note ("Signature age (days): " + $mp.AntivirusSignatureAge)
  Note ("Last quick scan    : " + $mp.QuickScanEndTime)
  $pref = Get-MpPreference
  Note ("Controlled Folder Access (ransomware): " + $pref.EnableControlledFolderAccess + "  (0=Off,1=On,2=Audit)")
} catch { Note "Defender status unavailable (3rd-party AV or insufficient rights)." }

# 4. Firewall
Section "4. FIREWALL PROFILES"
try { Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction | Format-Table -Auto } catch { Note "Firewall info unavailable." }

# 5. RDP
Section "5. REMOTE DESKTOP (RDP)"
try {
  $rdp = (Get-ItemProperty 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name fDenyTSConnections).fDenyTSConnections
  Note ("RDP enabled: " + $(if($rdp -eq 0){"YES (listening)"}else{"No (denied)"}))
} catch { Note "RDP registry read failed (may need admin)." }

# 6. Remote Assistance
Section "6. REMOTE ASSISTANCE"
try {
  $ra = (Get-ItemProperty 'HKLM:\System\CurrentControlSet\Control\Remote Assistance' -Name fAllowToGetHelp).fAllowToGetHelp
  Note ("Remote Assistance allowed: " + $(if($ra -eq 1){"YES"}else{"No"}))
} catch { Note "Remote Assistance read failed (may need admin)." }

# 7. Listening ports
Section "7. LISTENING TCP PORTS (with owning process)"
try {
  Get-NetTCPConnection -State Listen |
    Select-Object LocalAddress,LocalPort,@{n='Process';e={(Get-Process -Id $_.OwningProcess).ProcessName}} |
    Sort-Object LocalPort -Unique | Format-Table -Auto
} catch { Note "Port enumeration failed." }

# 8/9/10 users
Section "8. LOCAL USERS"
try { Get-LocalUser | Select-Object Name,Enabled,LastLogon,PasswordRequired | Format-Table -Auto } catch { Note "Get-LocalUser unavailable." }
Section "9. LOCAL ADMINISTRATORS"
try { Get-LocalGroupMember -Group "Administrators" | Select-Object Name,ObjectClass,PrincipalSource | Format-Table -Auto } catch { Note "Admin group read failed." }
Section "10. GUEST ACCOUNT"
try { Get-LocalUser -Name "Guest" | Select-Object Name,Enabled | Format-Table -Auto } catch { Note "No Guest account or read failed." }

# 11/12 sharing
Section "11. NETWORK PROFILE / CATEGORY"
try { Get-NetConnectionProfile | Select-Object Name,NetworkCategory,IPv4Connectivity | Format-Table -Auto } catch { Note "Connection profile read failed." }
Section "12. SMB SHARES (non-default = review)"
try { Get-SmbShare | Select-Object Name,Path,Description | Format-Table -Auto } catch { Note "SMB share read failed." }

# 13 startup
Section "13. STARTUP APPS"
try { Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location | Format-Table -Auto -Wrap } catch { Note "Startup read failed." }

# 14 scheduled tasks
Section "14. SCHEDULED TASKS (non-Microsoft, Ready/Running)"
try {
  Get-ScheduledTask | Where-Object { $_.TaskPath -notlike '\Microsoft\*' -and $_.State -in 'Ready','Running' } |
    Select-Object TaskName,TaskPath,State | Format-Table -Auto
} catch { Note "Scheduled task read failed." }

# 15 services
Section "15. RUNNING SERVICES matching remote-access names"
try {
  Get-Service | Where-Object Status -eq 'Running' |
    Where-Object { $_.DisplayName -match 'remote|vnc|teamviewer|anydesk|rdp|ssh|telnet|rustdesk|parsec' } |
    Select-Object Name,DisplayName,Status | Format-Table -Auto
  Note "(If nothing is listed above, no obvious remote-access services are running.)"
} catch { Note "Service read failed." }

# 16 bitlocker
Section "16. BITLOCKER / DEVICE ENCRYPTION"
if ($IsAdmin) {
  try { Get-BitLockerVolume | Select-Object MountPoint,VolumeStatus,ProtectionStatus,EncryptionPercentage | Format-Table -Auto } catch { Note "BitLocker cmdlet unavailable; try: manage-bde -status" }
} else { Note "Needs admin. Re-run elevated, or run:  manage-bde -status" }

# 17 installed remote/sync tools
Section "17. INSTALLED REMOTE-ACCESS / SYNC TOOLS (by app name)"
try {
  $apps = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,
                           HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*,
                           HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* |
          Select-Object -ExpandProperty DisplayName -Unique
  $hits = $apps | Where-Object { $_ -match 'TeamViewer|AnyDesk|VNC|Chrome Remote|LogMeIn|RustDesk|Parsec|OneDrive|Dropbox|Google Drive|iCloud|Backup' }
  if($hits){ $hits | ForEach-Object { Note $_ } } else { Note "None of the watched remote/sync app names found." }
} catch { Note "Installed-app enumeration failed." }

# 18 cloud sync roots
Section "18. CLOUD SYNC FOLDERS"
$syncRoots = @("$env:OneDrive","$env:USERPROFILE\OneDrive","$env:USERPROFILE\Dropbox","$env:USERPROFILE\Google Drive","$env:USERPROFILE\iCloudDrive") | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique
if ($syncRoots) { $syncRoots | ForEach-Object { Note ("Sync root: " + $_) } } else { Note "No common cloud-sync roots detected." }

# 19 secret-like files (paths only)
Section "19. SECRET-LIKE FILES (PATHS ONLY, values never shown)"
$searchRoots = @("$env:USERPROFILE\Claude","$env:USERPROFILE\Documents","$env:USERPROFILE\Desktop","$env:USERPROFILE\source","$env:USERPROFILE\projects","$env:USERPROFILE\dev","$env:USERPROFILE\.ssh") | Where-Object { Test-Path $_ } | Select-Object -Unique
$patterns = @('.env','.env.local','.env.production','.env.development','*.pem','*.key','id_rsa','id_ed25519','credentials.json','service-account*.json','*.p12','*.pfx')
$found = @()
foreach($root in $searchRoots){
  foreach($pat in $patterns){
    Get-ChildItem -Path $root -Recurse -Force -File -Filter $pat -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\|\\venv\\|\\\.next\\' } |
      ForEach-Object {
        $full = $_.FullName
        $sync = $false
        foreach($sr in $syncRoots){ if($full.StartsWith($sr)){ $sync = $true } }
        $found += [pscustomobject]@{ Path = $full; InCloudSync = $sync }
      }
  }
}
if($found){
  $found | Sort-Object Path -Unique | ForEach-Object {
    $tag = ""
    if($_.InCloudSync){ $tag = "   [IN CLOUD SYNC - review]" }
    Write-Host ("   secret-like file detected: " + $_.Path + $tag) -ForegroundColor Magenta
  }
} else { Note "No secret-like files found in common dev roots." }

# 20 git safety
Section "20. GIT SAFETY (per repo: is .env ignored / tracked?)"
$repos = @()
foreach($root in $searchRoots){ Get-ChildItem -Path $root -Recurse -Force -Directory -Filter ".git" -ErrorAction SilentlyContinue | ForEach-Object { $repos += $_.Parent.FullName } }
$repos = $repos | Select-Object -Unique
if($repos){
  foreach($r in $repos){
    Item $r
    $gi = Join-Path $r ".gitignore"
    if(Test-Path $gi){
      $hasEnv = (Get-Content $gi -ErrorAction SilentlyContinue | Where-Object { $_ -match '(^|/)\.env' }).Count -gt 0
      Note (".gitignore present. Ignores .env pattern: " + $(if($hasEnv){"YES"}else{"NO - add it"}))
    } else { Note ".gitignore MISSING - add one" }
    try {
      Push-Location $r
      $tracked = git ls-files 2>$null | Where-Object { $_ -match '(^|/)\.env' }
      if($tracked){ Write-Host ("   TRACKED SECRET FILES (stop and fix): " + ($tracked -join ', ')) -ForegroundColor Red }
      else { Note "No .env files tracked by git. Good." }
      Pop-Location
    } catch { Pop-Location; Note "git not available to check tracking." }
  }
} else { Note "No git repos found in common dev roots." }

Write-Host "`n==================== AUDIT COMPLETE (read-only) ====================" -ForegroundColor Green
Write-Host "Copy everything above and paste it back. No changes were made." -ForegroundColor Green
