#!/bin/bash

# Terminate on error
set -e

# Optionally install dependencies first
if [[ "$1" == "-B" || "$1" == "--no-build" ]]; then
  echo "Skipping install and build steps."
else
  echo "Installing and building."
  echo "Skip this step by providing the -B or --no-build flags first."
  npm install
  npm run build
fi

# Bundle results properly
echo "Bundling dependencies for Lambda"
mkdir nodejs
cp -R node_modules nodejs
zip -r nodejs.zip nodejs > /dev/null

# Transfer to downloads
echo "Copying zip file to ~/Downloads"
mv nodejs.zip ~/Downloads
rm -rf nodejs

# Done
echo Done
