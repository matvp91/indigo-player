set -e

echo "Enter new version (x.x.x): "
read VERSION

read -p "Releasing v$VERSION? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing v$VERSION ..."

  # build
  npm --no-git-tag-version version $VERSION
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git add -f lib/ -A
  git commit -m "v$VERSION"

  # publish
  git tag v$VERSION
  git push origin refs/tags/v$VERSION
  git push
  npm publish
fi