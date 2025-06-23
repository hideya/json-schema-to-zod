#!/bin/bash

# Build and install script for fixing the json-schema-to-zod dependency issue

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Building the fixed json-schema-to-zod package ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the package
echo "Building the package..."
npm run build

# Create the package tarball
echo "Creating package tarball..."
npm pack

# Get the tarball filename
TARBALL=$(ls -t *.tgz | head -1)
echo "Created tarball: $TARBALL"

echo "=== Updating the mcp-client-langchain-ts project ==="
cd /Users/hideya/Desktop/WS/AT/mcp-client-langchain-ts

# Remove the old package
echo "Removing @n8n/json-schema-to-zod dependency..."
npm uninstall @n8n/json-schema-to-zod

# Install the fixed package
echo "Installing the fixed package..."
npm install /Users/hideya/Desktop/WS/AT/json-schema-to-zod/$TARBALL

# Build the project
echo "Building the mcp-client-langchain-ts project..."
npm run build

echo ""
echo "=== All done! ==="
echo "Your mcp-client-langchain-ts project now uses the fixed json-schema-to-zod package."
echo "You can test it by running: node dist/index.js"
echo ""
echo "If you'd like to publish the package to npm, run:"
echo "cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod"
echo "npm login"
echo "npm publish"
