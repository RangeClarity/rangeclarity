You are working in my local project:

C:\Users\USER\Claude\Projects\RangeClarity

Goal:
Fix and connect this project to GitHub so I can deploy it to Vercel.

Important context:

* Running `git status` previously returned:
  `fatal: not a git repository`
* Then I tried `git init` and got:
  `error: could not lock config file C:/Users/USER/Claude/Projects/RangeClarity/.git/config: File exists`
  `fatal: could not set 'core.repositoryformatversion' to '0'`
* This likely means a broken/incomplete `.git` folder exists.
* Do not delete or modify project source files.
* Only fix Git setup.
* Protect secrets. Make sure `.env`, `.env.local`, `.next`, `node_modules`, and `.vercel` are ignored.
* Do not push secrets or generated build folders.
* Do not deploy to production.

GitHub repo I want connected:
https://github.com/RangeClarity/RangeClarity.git

Tasks:

1. Inspect the folder safely

   * Confirm current directory is:
     `C:\Users\USER\Claude\Projects\RangeClarity`
   * Check whether `.git` exists.
   * Check whether `.git/config` exists.
   * Check if Git is partially initialized or corrupted.
   * Check for `.gitignore`.

2. Fix broken Git initialization

   * If `.git` is broken/corrupted, do NOT delete it immediately.
   * Rename it to a backup folder, for example:
     `.git-broken-backup`
   * Then run a clean:
     `git init`
     `git branch -M main`

3. Ensure `.gitignore` is correct
   Make sure `.gitignore` contains at least:
   node_modules
   .next
   .env
   .env.local
   .vercel
   .DS_Store

4. Stage and commit

   * Run:
     `git status`
     `git add .`
     `git commit -m "Prepare RangeClarity landing page for production"`
   * If commit fails because Git user name/email is missing, configure local repo only:
     `git config user.name "Dean Lich"`
     `git config user.email "dindin9@gmail.com"`
     Then commit again.

5. Connect remote

   * Add or update origin to:
     `https://github.com/RangeClarity/RangeClarity.git`
   * If origin already exists but is wrong, use:
     `git remote set-url origin https://github.com/RangeClarity/RangeClarity.git`
   * Verify:
     `git remote -v`

6. Push

   * Run:
     `git push -u origin main`
   * If GitHub authentication fails, explain the exact next step:

     * use browser login
     * or `gh auth login`
     * or GitHub Desktop
   * If error says repository not found, tell me clearly that the repo probably does not exist yet or I do not have permission to push to `RangeClarity/RangeClarity`.

7. Final report
   Tell me:

   * whether Git is fixed
   * whether commit was created
   * whether remote is connected
   * whether push succeeded
   * exact next command/action I need to do

Do not run deployment.
Do not change landing page design.
Do not edit app code unless absolutely required for Git safety.
