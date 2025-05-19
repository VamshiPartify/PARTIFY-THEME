**If I made changes and want to make sure I am up to date with current Shopify theme code through merging branches:**
1. git add .
2. git commit -m "random message"
3. git push -u origin <any branch>
4. Merge latest branch with 'main' branch in github
5. Shopify theme pull
6. Go to source control within VSCode and fix conflicts
7. Stage conflicts
8. git commit -m "up to date with live theme"
9. git push -u origin <same branch>
10. merge with live.
    - Main theme code will now reflect latest changes while maintaining most up-to-date shopify theme code

**If i made changes but want to make sure I am up to date with current Shopify theme without merging branches**
1. git stash
2. shopify theme pull
3. git add .
4. git stash pop
5. Fix conflicts if any

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

**If I want to revert back to a previous commit without deleting local work**
# Step 1: Revert the bad commit on main
1. git checkout main
2. git pull origin main          # make sure you're up to date
3. git log --oneline            # het the hash of the most recent commits
4. git revert <bad-commit-hash> # creates a new "undo" commit
5. git push origin main

