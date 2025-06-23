#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing updated build process ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Build the package
echo "Building with updated process..."
npm run build

# Link it
echo "Linking the package..."
npm unlink || true
npm link

# Run the ESM test
echo ""
echo "=== Testing ESM imports ==="
pushd test-esm
npm link @h1deya/json-schema-to-zod
node index.js
popd

# Create a package for mcp-client-langchain-ts
echo ""
echo "Creating package tarball..."
npm pack

echo ""
echo "To install in your main project, run:"
echo "cd ../mcp-client-langchain-ts"
echo "npm uninstall @n8n/json-schema-to-zod"
echo "npm install ../json-schema-to-zod/h1deya-json-schema-to-zod-0.1.0.tgz"
echo "npm run build"
