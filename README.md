**Steps to add update and merge new branches:**
1. shopify theme pull
2. git init
3. git remote add origin https://github.com/Partify-USA/partify-theme.git
4. git checkout -b feature/major-changes (or any other branch name e.g. feature/cool-branch)
5. Use source control within VScode to fix conflicting files (choose to keep current changes if I made changes on vscode before comparing to git main branch, keep incoming if I want to incorporate changes already on main)
6. git add .
7. git commit (maybe add a message too)
8. git push -u origin feature/major-changes (or any other branch name e.g. feature/cool-branch)
9. git pull origin main --allow-unrelated-histories
10. Compare diffs, make sure they are correct
11. create PR
12. Merge changes once feature is live to keep main branch up-to-date

**If i pushed a branch and want to merge it into the latest shopify theme code**
1. Push my latest changes to a branch "feature/<new branch>"
2. git checkout feature/latest-updates
3. shopify theme pull
4. git add .
5. git commit
6. git push -u origin feature/latest-updates
7. merge these changes with the main
8. git checkout feature/<new branch>
9. git merge main
10. press esc
11. type :wq and then enter
12. 

**If i made changes but want to make sure I am up to date with current Shopify theme**
1. git stash
2. shopify theme pull
3. git add .
4. git stash pop
5. Fix conflicts if any

**Pull latest changes from shopify**
1. git stash
2. shopify theme pull
3. git checkout -b feature/<new-branch>
4. git add .
5. git stash pop (if needed)
6. git commit
7. git push -u origin feature/<new-branch>
8. Create PR and merge changes
9. git checkout main
10. git pull origin main

**Workflow for new feature**
1. shopify theme pull
2. git init
3. git remote add origin https://github.com/Partify-USA/partify-theme.git
4. git status (to see if there are any changes)
5. fix/update those changes through add, commit, and push
6. git checkout -b feature/major-changes (or any other branch name e.g. feature/cool-branch)
7. git pull origin main --allow-unrelated-histories
8. Use source control within VScode to fix conflicting files (choose to keep current changes)
9. git add .
10. git commit (maybe add a message too)
11. git push origin feature/major-changes (or any other branch name e.g. feature/cool-branch)
12. Compare diffs, make sure they are correct
13. create PR
14. Merge changes
15. Publish new update to shopify
