#!/usr/bin/env sh

# abort on errors
set -e

# build
# npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy' --allow-empty

git push -f git@github.com:samuelswandi/speedtype.git main:gh-pages

cd -