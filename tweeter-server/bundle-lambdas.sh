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

TARGET_FILE="dist.zip"
FINAL_DIR="$HOME/Downloads"

# Bundle results
cd dist/
zip -r "../$TARGET_FILE" . > /dev/null
cd ..

# Transfer to downloads
echo "Copying $TARGET_FILE to $FINAL_DIR"
cp $TARGET_FILE $FINAL_DIR

# Done
echo Done
