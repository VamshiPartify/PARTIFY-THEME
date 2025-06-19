# Workflow (if theme code is not connected to Github):

## Workflow Summary Table
| Step Range | Purpose                                                         |
|------------|-----------------------------------------------------------------|
| 1–7        | Standard Git feature branch workflow (local changes, push to GitHub) |
| 8–13       | Sync `main` with live Shopify theme, update GitHub if necessary |
| 14–19      | Rebase feature branch onto latest `main`, resolve conflicts     |
| 20–21      | Merge feature to `main`, deploy to Shopify                      |

1. git checkout main
2. git pull origin main
3. git checkout -b branch-name
4. make changes
5. stage changes (git add . or individual files)
6. git commit -m "random message"
7. git push -u origin branch-name
8. git checkout main
9. git pull origin main (to make sure that we are still up to date)
10. git checkout -b shopifypull/01-01-25 (or today's date)
11. shopify theme pull (pull live site code for current published theme code)
12. In source control on VSCode, use diff to spot differences
- If there are no differences:
    - Merge original branch with main
    - Shopify theme push (to desired theme)
- If there are differences:
    - Inspect and stage desired changes
    - git commit -m "up to date with shopify code"
    - git push -u origin shopifypull/01-01-25
**The following is only if there were differences between main and shopify code**
13. In github, merge the shopifypull/01-01-25 branch with main
- Main branch is now up to date with shopify code
14. git checkout original-branch-name
15. git rebase main
16. if there are any conflicts, fix and then stage the fixes
17. git rebase --continue (only run this if conflicts had to be fixed)
18. repeat steps 15-17 until rebase is done
19. git push --force-with-lease (only run `--force-with-lease` if the branch was previously pushed to remote repo, Github, as it updates remote branch to be rebased)
20. merge branch with main in github
21. Shopify theme push (to desired theme)

# If i pushed a branch and want to merge it into the latest shopify theme code
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

# If I want to revert back to a previous commit without deleting local work
1. git checkout main
2. git pull origin main          
3. git log --oneline            
4. git revert <bad-commit-hash>
5. git push origin main

