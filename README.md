Steps to add update and merge new branches:
1. shopify theme pull
2. git init
3. git checkout -b feature/major-changes (or any other branch name e.g. feature/cool-branch)
4. Use source control within VScode to fix conflicting files (choose to keep current changes if I made changes on vscode before comparing to git main branch, keep incoming if I want to incorporate changes already on main)
5. git add .
6. git commit (maybe add a message too)
7. git push -u origin feature/major-changes (or any other branch name e.g. feature/cool-branch)
8. git pull origin main --allow-unrelated-histories
9. Compare diffs, make sure they are correct
10. create PR
11. Merge changes once feature is live to keep main branch up-to-date


Workflow for new feature
1. shopify theme pull
2. git init
3. git remote add origin https://github.com/elkaholic6/shopify-git-test.git
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
