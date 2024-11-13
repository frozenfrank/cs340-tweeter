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

ZIP_DIR="nodejs"
TARGET_FILE="nodejs.zip"
FINAL_DIR="$HOME/Downloads"

# Bundle results properly
echo "Bundling dependencies for Lambda"
mkdir $ZIP_DIR
cp -RL node_modules $ZIP_DIR
zip -r $TARGET_FILE $ZIP_DIR > /dev/null

# Transfer to downloads
echo "Copying zip file to $FINAL_DIR"
mv $TARGET_FILE $FINAL_DIR
rm -rf $ZIP_DIR

# Done
echo Done
