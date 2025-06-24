#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing updated build process ==="

package_name=$(jq -r '.name' package.json)
echo "Package name: $package_name"

# Build the package
echo "Building with updated process..."
npm run build

# Link it
echo "Linking the package..."
npm -g uninstall $package_name || true
npm link

# Run the ESM test
echo ""
echo "=== Testing ESM imports ==="
pushd test-esm
npm link $package_name
node index.js
popd

npm -g uninstall $package_name || true

# # Create a package for mcp-client-langchain-ts
# echo ""
# echo "Creating package tarball..."
# npm pack
