# Privacy & Developer Security Checklist

Tailored to this machine (Win10 Home, dev workflow: Claude Code/Codex, Telegram agent, GitHub, Vercel, Namecheap, TradingView). Tick these off over time.

## Windows privacy & hardening
- [ ] **OS support:** Upgrade to Windows 11 if eligible, or enroll Windows 10 in **ESU** (Win10 is past end-of-support).
- [ ] **Disk encryption:** Turn on Device Encryption/BitLocker for `C:` and store the **recovery key** off-device (currently OFF).
- [ ] **Account password:** Set a strong password/PIN on `USER`; confirm `netplwiz` requires login (currently `PasswordRequired = False`).
- [ ] **Remote Assistance:** Disable (currently allowed).
- [ ] **Remote Desktop:** Keep disabled (already off ✅).
- [ ] **TeamViewer:** Uninstall if unused; else strong unattended password + account 2FA.
- [ ] **Antivirus:** Confirm Avira real-time is ON + updated, OR remove Avira so Defender re-enables. Never run with neither.
- [ ] **Ransomware:** Consider enabling Controlled Folder Access (Defender) for Documents/Desktop/project folders.
- [ ] **Firewall:** Keep all profiles enabled (already on ✅). Confirm File & Printer Sharing OFF on Public.
- [ ] **SMB:** Disable SMBv1 if present; avoid creating non-default shares.
- [ ] **Postgres:** Bind to `localhost` unless LAN access is required.
- [ ] **Updates:** Run `winget upgrade` monthly; keep browsers + dev tools current.
- [ ] **Local users:** Confirm `CodexSandboxOnline/Offline` are intended; remove if not (with care).

## Browser privacy
- [ ] Use a primary browser with tracking protection set to Strict.
- [ ] Audit installed extensions; remove anything unused or unknown.
- [ ] Never save secrets/tokens in plaintext notes or browser autofill.
- [ ] Use a **password manager** (Bitwarden/1Password) instead of browser-saved passwords for critical accounts.
- [ ] Separate profile for dev/admin vs. personal browsing.

## Telegram security (you run a bot/agent)
- [ ] Enable **Two-Step Verification (password)** on your Telegram account.
- [ ] Settings → Devices → **terminate unknown sessions**.
- [ ] Keep the **bot token out of git** and out of chat; load from `.env` only.
- [ ] If a bot token was ever pasted/leaked, **revoke + reissue via BotFather** (`/revoke`).
- [ ] Restrict who can DM/trigger the agent if it accepts commands.

## GitHub secret safety
- [ ] Enable **2FA** (prefer an authenticator/passkey, not SMS).
- [ ] Turn on **Secret Scanning + Push Protection** for your repos.
- [ ] Keep private repos private; double-check no project is unintentionally public.
- [ ] Confirm `.gitignore` ignores `.env`, `.env.*`, `*.pem`, `*.key`, `credentials.json` in **every** repo (RangeClarity/ml-observability-pipeline/TradingAgents already ignore `.env` ✅).
- [ ] Use fine-grained PATs with minimal scope + expiry; never commit a PAT.

## Vercel environment variables
- [ ] Store secrets as **Environment Variables** in the Vercel dashboard, scoped per environment (Prod/Preview/Dev).
- [ ] Never put secrets in `next.config`, client bundles, or `NEXT_PUBLIC_*` vars.
- [ ] Confirm no `.env` is committed/deployed; `.env*` stays git-ignored.
- [ ] Enable account 2FA.

## Namecheap domain security
- [ ] Enable **2FA** on the account.
- [ ] Turn on **Domain Lock** (registrar lock) for rangeclarity.com.
- [ ] Enable WHOIS privacy.
- [ ] Use a strong unique password from your password manager.

## .env rules
- [ ] One `.env` per project, git-ignored; commit only `.env.example` with placeholder values.
- [ ] Never paste real `.env` contents into chat, issues, or docs.
- [ ] Keep dev projects **outside OneDrive/Dropbox** (already the case ✅).
- [ ] Rotate any secret that was ever exposed (see SECRET_ROTATION_CHECKLIST.md).

## OneDrive / cloud-sync rules
- [ ] Keep `dev\` and `Claude\Projects\` out of OneDrive (currently outside ✅).
- [ ] Don't move secret-bearing folders into OneDrive/Desktop/Documents if those sync.
- [ ] Review OneDrive "Backup" of Desktop/Documents — ensure no project secrets ride along.

## Backup checklist
- [ ] External drive full backup (File History or image) — see report's backup section.
- [ ] Create a **System Restore point** before any hardening change.
- [ ] Keep an offline copy of: password-manager recovery kit, BitLocker/Device-Encryption recovery key, 2FA backup codes.
- [ ] Do NOT back up `.env`/secrets to any public or shared cloud location.

## Monthly 10-minute security routine
1. `winget upgrade` and patch apps; run Windows Update.
2. Quick AV scan; confirm real-time protection on.
3. Review Telegram + GitHub + Vercel active sessions/devices.
4. Re-run `windows-security-audit.ps1`; compare against this baseline.
5. Confirm no new `.env`/secret files landed in a synced or tracked location.
