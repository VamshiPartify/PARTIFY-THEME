Steps to add update and merge new branches:
1. git init
2. git checkout feature/major-changes (or any other branch name e.g. feature/cool-branch)
3. git pull origin main --allow-unrelated-histories
4. Use source control within VScode to fix conflicting files (choose to keep current changes)
5. git add .
6. git commit (maybe add a message too)
7. git push origin feature/major-changes (or any other branch name e.g. feature/cool-branch)
8. Compare diffs, make sure they are correct
9. create PR
10. Merge changes
