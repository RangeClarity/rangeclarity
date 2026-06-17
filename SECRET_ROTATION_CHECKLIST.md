# Secret Rotation Checklist

Use this when a secret may have been exposed (pasted in chat, committed, logged, shared, or stored in a synced/public location). **Good news from the audit:** no `.env` is currently tracked by git, and dev folders aren't in OneDrive — so there's no evidence of online exposure right now. Rotate anyway if you're ever unsure; rotation is cheap, a leak is not.

## General rule
Rotate immediately if a secret was: committed to git (even once, even if later removed — it stays in history), pasted into a chat/issue/screenshot, printed in CI logs, stored in a cloud-synced/public folder, or on a device you no longer fully control.

---

## Telegram bot token (`TELEGRAM_BOT_TOKEN`)
- **Rotate:** Message **@BotFather** → `/revoke` → select the bot → receive a new token.
- **Update:** put the new token in each project's `.env` only; never in chat or git.
- **Verify:** old token stops working; send one test message with the new token.
- **Found on this PC:** Hermes agent (`Hermes_Gateway` task) — ensure its token lives in `.env`, not source.

## GitHub tokens (PAT / OAuth)
- **Rotate:** GitHub → Settings → Developer settings → **Personal access tokens** → revoke the old, create a fine-grained token (minimal scope, expiry).
- **Also:** rotate any SSH key you suspect is exposed; enable 2FA; turn on Push Protection so future secrets are blocked pre-commit.

## Vercel tokens / env vars
- **Rotate:** Vercel → Account Settings → **Tokens** → revoke + recreate.
- **Env vars:** re-enter any leaked value in Project → Settings → Environment Variables; redeploy so old values are replaced.

## OpenAI / Anthropic API keys
- **Rotate:** provider dashboard → API keys → revoke the exposed key → create a new one → update `.env`.
- Set usage limits/billing alerts to catch misuse early.

## AWS / cloud keys (you have `dev\ml-observability-pipeline` using botocore/moto)
- **Rotate:** IAM → deactivate then delete the exposed access key → create a new one.
- Prefer short-lived credentials / SSO over long-lived keys where possible.
- Note: the `cacert.pem` / `moto` `*.key` files found are **library/test files, not your credentials** — no action needed.

## Namecheap account
- Rotate the **account password** (password manager), enable **2FA**, confirm **domain lock** + WHOIS privacy. Review API keys if you use the Namecheap API.

## Google account
- Change password if exposed, enable **2FA** (authenticator/passkey), review **third-party app access** and active sessions, update recovery email/phone.

## SSH keys (`~/.ssh`)
- **Rotate:** generate a new keypair (`ssh-keygen -t ed25519`), add the new public key to GitHub/servers, remove the old public key everywhere, delete the old private key. Protect the private key with a passphrase.

---

## Rotate-immediately triggers (quick reference)
- [ ] Secret appeared in a git commit or `git log`/history
- [ ] Token pasted into chat, email, screenshot, or a ticket
- [ ] Secret-bearing folder synced to OneDrive/Dropbox/Google Drive or a public repo
- [ ] Key printed in build/CI logs
- [ ] Laptop lost, sold, or serviced while drive was unencrypted

## How to avoid re-exposing
- Keep secrets only in git-ignored `.env`; commit `.env.example` placeholders.
- Never echo/print secrets in scripts or share them in chat.
- Use a password manager; enable 2FA everywhere.
- Turn on GitHub Secret Scanning + Push Protection.
- Encrypt the disk so a lost device doesn't equal a lost secret.
