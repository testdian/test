#!/bin/bash

# Backup the existing tsconfig.json
cp tsconfig.json tsconfig.json.bak

# Copy the translation config to tsconfig.json
cp tsconfig.translate.json tsconfig.json

# Run the translation command
./node_modules/kiwi-clis/dist/index.js --translate

# Restore the original tsconfig.json
mv tsconfig.json.bak tsconfig.json
