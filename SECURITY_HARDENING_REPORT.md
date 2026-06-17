# Security Hardening Report — Windows PC

**Date:** 2026-06-16
**Mode:** Read-only audit (no changes made to the system)
**Machine:** DESKTOP-5PNQ8AN · Windows 10 Home 22H2 (build 19045)
**Overall security score: 5 / 10** — solid baseline (firewall on, RDP off, VPN present, secrets not committed), but several real gaps drag it down (unsupported OS, no disk encryption, possible passwordless login, active remote tool).

---

## Top risks at a glance

| Sev | Finding |
|-----|---------|
| 🔴 Critical | Windows 10 22H2 is **past end of support** (consumer EOL was Oct 14, 2025). No security patches unless on ESU. |
| 🔴 Critical | **Disk encryption is OFF** (`C:` FullyDecrypted, BitLocker protection Off). Data is readable if the device is lost/stolen. |
| 🟠 High | Main account **`USER` shows `PasswordRequired = False`** — likely no logon password / auto-login. |
| 🟠 High | **TeamViewer is installed and running** (service + localhost:5939). Remote-access surface. |
| 🟠 High | **Microsoft Defender real-time protection is OFF.** Avira appears installed as the active AV — must confirm it is on + updated, or you currently have weak AV cover. |
| 🟠 High | **Remote Assistance is allowed** (`fAllowToGetHelp = 1`). |
| 🟡 Medium | **PostgreSQL listening on `0.0.0.0:5432`** (all interfaces, not just localhost). |
| 🟡 Medium | **SMB file sharing active** (ports 139/445, default `ADMIN$`/`C$`/`IPC$` shares). |
| 🟡 Medium | Real secret files on disk: `dev\proofdraft\.env.local`, `dev\TradingAgents\.env` (the git-tracked repo safely ignores it). |
| 🟢 Low | App updates not enumerated cleanly; Avira "System Speedup" bloat tasks; many vendor auto-updaters. |

---

## What's already good (keep it)

- ✅ **Windows Firewall ENABLED on all three profiles** (Domain / Private / Public).
- ✅ **Remote Desktop (RDP) is DISABLED.**
- ✅ Active network "Dean 3" is categorized **Public** (most restrictive sharing).
- ✅ **ExpressVPN** installed and running (privacy plus).
- ✅ **Guest, built-in Administrator, DefaultAccount, WDAGUtility** accounts all **disabled**.
- ✅ **Dev/project folders are NOT inside OneDrive** (`C:\Users\USER\dev` and `...\Claude\Projects`) — so `.env` secrets are **not** syncing to the cloud.
- ✅ **No `.env` file is tracked by git** in any detected repo, and each repo's `.gitignore` already ignores `.env`.

---

## Detailed findings

### Critical

**C1 — Unsupported operating system.**
Windows 10 22H2 reached end of consumer support on 2025-10-14. Running it in June 2026 means no routine security updates unless you are enrolled in the Extended Security Updates (ESU) program.
- **Fix (manual):** Check Windows Update; if eligible, **upgrade to Windows 11**. If the hardware doesn't qualify, **enroll in Windows 10 ESU** to keep receiving security patches. (Requires your decision + possibly a restart.)

**C2 — No disk encryption.**
`manage-bde`/Get-BitLockerVolume shows `C:` FullyDecrypted, ProtectionStatus Off. Anyone with physical access can read the drive.
- **Fix (manual, may need hardware support):** Windows 10 **Home** doesn't include full BitLocker management, but **Device Encryption** may be available (Settings → Update & Security → Device encryption / "Privacy & security" → Device encryption) if your device has TPM + modern standby. If available, turn it on and **save the recovery key** somewhere safe (not on the same machine). If unavailable, consider VeraCrypt for sensitive folders, or upgrade to Win11 which broadens encryption options.

### High

**H1 — Main account may have no password.**
`USER` (an administrator) reports `PasswordRequired = False`. If there is no logon password/PIN, physical access = full access.
- **Fix (manual):** Set a strong password or Windows Hello PIN for the `USER` account. Confirm auto-login is off (`netplwiz` → "Users must enter a user name and password").

**H2 — TeamViewer running.**
TeamViewer service is running and listening on 127.0.0.1:5939; it was also flagged among installed apps. If you don't actively use it, it's an unnecessary remote-access surface.
- **Fix (requires your call):** If unused → uninstall (with your approval). If used → set a strong unattended-access password, enable **2FA on your TeamViewer account**, and restrict to known devices. (I will not uninstall anything without your go-ahead.)

**H3 — Defender real-time OFF / AV cover unclear.**
`RealTimeProtectionEnabled = False`, `AntivirusEnabled = False`, signature age 65535 (dormant). This is normal **when a third-party AV is active** — and Avira tasks are present, so Avira is likely your registered AV.
- **Fix (manual, verify):** Open Avira and confirm **real-time protection is ON and signatures are current**. If you'd rather not run Avira (it bundles a "System Speedup" component), uninstall Avira and Windows Defender will automatically re-enable. Don't run with *neither* active.

**H4 — Remote Assistance allowed.**
`fAllowToGetHelp = 1`. Legacy "let someone remote in to help" feature; rarely needed.
- **Fix (Category 2, after approval):** Disable Remote Assistance (System Properties → Remote → uncheck "Allow Remote Assistance connections"). Read-only-reversible.

### Medium

**M1 — PostgreSQL bound to all interfaces (`0.0.0.0:5432`).**
If the firewall ever allows 5432 inbound (or on a trusted network), the DB is reachable from the LAN.
- **Fix (manual, dev):** In `postgresql.conf` set `listen_addresses = 'localhost'` (or keep firewall blocking 5432 inbound). Low urgency since firewall is on + network is Public.

**M2 — SMB / file sharing active.**
Ports 139 (NetBIOS, bound to LAN IP 10.0.0.19) and 445 listening; default admin shares present. Default shares (`ADMIN$`,`C$`,`IPC$`) are normal, but active SMB on a laptop you carry around is avoidable.
- **Fix (Category 2, after approval):** Ensure "File and Printer Sharing" is **off for Public networks**; optionally disable SMBv1 if present (`Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol`). Firewall on Public should already block inbound SMB.

**M3 — Secret files on disk (not exposed online).**
- `C:\Users\USER\dev\TradingAgents\.env` — repo's `.gitignore` ignores `.env` and it is **not tracked**. ✅ Safe locally.
- `C:\Users\USER\dev\proofdraft\.env.local` — **not** listed as a git repo in the scan; confirm it has a `.gitignore` ignoring `.env*` (see checklist). Not in OneDrive, so not cloud-synced.
- The `.pem` / `.key` files under `...\.venv\Lib\site-packages\...` (botocore, certifi, moto, pip) are **library CA bundles and test fixtures — false positives, not your secrets.**

**M4 — Avira "System Speedup" scheduled tasks + extra local users.**
Many `\Avira\System Speedup\...` tasks (bloat/registry-cleaner behavior). Also two **enabled** local users `CodexSandboxOffline` / `CodexSandboxOnline` (created by the Codex CLI sandbox) — benign if you use Codex, but worth confirming they're intended.

### Low

**L1 — App updates not enumerated cleanly.** The `winget upgrade` output rendered as progress noise. Run `winget upgrade` manually in a fresh window to see/patch out-of-date apps.
**L2 — Vendor auto-updaters** (NVIDIA, ASUS, Razer, Adobe, Google, Zoom, Mozilla) — normal; review only if you've removed those apps.
**L3 — `Hermes_Gateway` scheduled task** — your Telegram agent. Relevant to the separate Telegram-migration task, not a security issue.

---

## What was checked vs. not checked

**Checked (read-only):** OS/build, app-update list, Defender status, firewall profiles, RDP, Remote Assistance, listening TCP ports, local users/admins/Guest, network category, SMB shares, startup apps, non-Microsoft scheduled tasks, remote-access services, BitLocker, installed remote/sync tools, cloud-sync roots, secret-like files (paths only), per-repo git `.env` safety.

**NOT checked:** browser extensions/settings, individual app configs, full file-permission ACLs, account-level online security (2FA on GitHub/Vercel/Namecheap/Google/Telegram/TradingView — see checklist), router/network config, USB device history, full malware scan.

---

## Changes made

**None.** This was an audit. No settings, files, users, services, or tasks were modified.

## Changes NOT made (awaiting your category approvals)

See the approval categories below. Nothing will be changed until you approve a specific category.

| Category | Scope | Restart? |
|----------|-------|----------|
| 1. Defender / AV + Firewall | Confirm AV cover; firewall already on | No |
| 2. Remote access & sharing | Disable Remote Assistance; review SMB/file sharing; TeamViewer decision | No (uninstall TeamViewer would; ask first) |
| 3. Startup apps cleanup | Review Razer/Adobe/Edge autostarts | No |
| 4. Scheduled tasks/services | Review Avira bloat + extra tasks | No |
| 5. Dev secret protection | Verify `proofdraft` `.gitignore`; `.env.example` placeholders | No |
| 6. Git cleanup | Confirm no secrets in history | No |
| 7. Cloud sync / OneDrive | Already safe; optional tightening | No |
| 8. Backup setup | External + restore point plan | No |
| — Encryption (C2) | Device Encryption / BitLocker | **Yes** |
| — OS support (C1) | Win11 upgrade or ESU | **Yes** |

---

## Restart required?
Only for **disk encryption** and an **OS upgrade/ESU**. Everything else (Remote Assistance, sharing, AV confirmation, dev-secret hygiene, backups) needs **no restart**.
