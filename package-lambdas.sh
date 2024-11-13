#!/bin/bash

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

echo "Please update the tweeter-server/.server with the new lambda version. Press (enter) when complete."
read

# Update lambdas
npm run lambdas:b
echo "Uploading lambdas"
./upload-lambdas.sh
echo "Updating lambda layers"
./update-layers.sh

# Done
echo "Done uploading. Manually test any new endpoints."
