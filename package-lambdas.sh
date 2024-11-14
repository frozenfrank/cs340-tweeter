#!/bin/bash

git diff --quiet
if [ $? -ne 0 ]; then
  echo "Refusing to proceed without a clean working git directory."
  exit 1
fi

# Terminate on error
set -e

# Rebuild shared
cd tweeter-shared/
npm run build

# Rebuild server
cd ../tweeter-server/
npm run build
npm run deps:b

# Prompt the user to do actions
echo "Please upload the new lambda layer. Press (enter) when complete."
read

# Request the next lambda layer version number
echo "Provide the new lambda layer version number. The previous layer version is provided for reference."
echo "We will save this into the .server file for you. Press (enter) complete."
source .server
while true; do
  printf "Lambda layer version (prev=$LAMBDALAYER_VERSION): "
  read new_lambda_layer_version


  # Check if the input is a valid number
  if [[ "$new_lambda_layer_version" =~ ^[0-9]+$ ]]; then
      break  # Exit the loop if a valid number is entered
  else
      echo "You entered: $number"
      echo "Error: Input is not a valid number. Please try again."
  fi
done

# Update the value in the file
sed -i '' -E "s/LAMBDALAYER_VERSION=.*$/LAMBDALAYER_VERSION=$new_lambda_layer_version/" .server

# Update lambdas
npm run lambdas:b
echo "Uploading lambdas"
./upload-lambdas.sh

echo "Sleeping between upload operations"
sleep 5

echo "Updating lambda layers"
./update-layers.sh

# Save adjustments to git
git commit -am "Update Lambda Layer to version $new_lambda_layer_version"

# Done
echo "Done uploading. Manually test any new endpoints."
