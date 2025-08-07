# Rollback Procedures for Repo Hygiene Sprint

## Overview
This document outlines the rollback procedures for the repo-hygiene changes made on 2025-08-07.

## Backup Information
- **Backup Tag Created**: `backup-before-push-20250807-111606`
- **Branch**: `repo-hygiene`
- **Main Changes**: Removed dist/ directory from Git tracking

## Rollback Procedures

### 1. To Rollback to Pre-Push State
If you need to rollback to the state before pushing the repo-hygiene changes:

```bash
# Checkout the backup tag
git checkout backup-before-push-20250807-111606

# Create a new branch from this point
git checkout -b rollback-branch

# Force push to override the repo-hygiene branch (if needed)
git push --force origin rollback-branch:repo-hygiene
```

### 2. To Restore dist/ Directory Tracking (Not Recommended)
If you absolutely need to restore tracking of the dist/ directory:

```bash
# Checkout the commit before dist/ was removed
git checkout backup-before-push-20250807-111606

# Copy the dist/ directory state
cp -r dist/ ../dist-backup/

# Go back to main branch
git checkout main

# Add dist/ back
cp -r ../dist-backup/ dist/
git add dist/
git commit -m "Restore dist/ directory tracking"
```

### 3. To Revert the Entire Commit
If the PR has been merged and you need to revert:

```bash
# Find the merge commit
git log --oneline --graph

# Revert the merge commit
git revert -m 1 <merge-commit-hash>

# Push the revert
git push origin main
```

### 4. Emergency Recovery
If all else fails:

```bash
# Reset to the backup tag
git reset --hard backup-before-push-20250807-111606

# Force push (CAUTION: This will overwrite remote)
git push --force origin main
```

## Important Notes

1. **dist/ Directory**: The dist/ directory should remain untracked as it contains build artifacts. These files are generated during the build process and should not be in version control.

2. **Build Issues**: There is a known build issue with missing `sortablejs` dependency that is unrelated to the repo hygiene changes.

3. **Backup Tags**: The backup tag `backup-before-push-20250807-111606` will remain in the repository for future reference.

## Verification Steps

After any rollback:
1. Run `git status` to verify the working directory state
2. Run `npm install` to ensure dependencies are correct
3. Run `npm run build` to verify the build works (note: sortablejs issue may persist)
4. Check that `.gitignore` properly excludes dist/

## Contact
For questions about this rollback procedure, refer to the PR: https://github.com/pdarleyjr/iplcforms-v3/pull/new/repo-hygiene