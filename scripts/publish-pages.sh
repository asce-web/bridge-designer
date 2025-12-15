#!/bin/bash

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Worktree must be clean."
  exit 1
fi

# Get git project root dir.
project_dir=$(git rev-parse --show-toplevel)

# Copy the contents of dist to the pages site source.
site_source="$project_dir/docs"
rm -rf "$site_source/app"
cp -R "$project_dir/dist/bridge-designer/browser" "$site_source"
mv "$site_source/browser" "$site_source/app"

# Edit the base URL of the root page to match its location.
sed -i 's@base href="/"@base href="/bridge-designer/app/"@' "$site_source/app/index.html"

# Switch to publishing branch and update it to current, including new pages.
old_branch=$(git branch --show-current)

echo "Switch from branch ${old_branch} to publish-pages, merge, and push? (Y/n))"
read -sn1 key
if [[ "$key" != 'n' ]]
then
  git switch publish-pages
  git merge main
  # Push to trigger publish
  git push origin publish-pages
fi

# Restore old branch
git switch "$old_branch"
