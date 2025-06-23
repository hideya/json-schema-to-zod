#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing declaration files generation ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Build the package
echo "Building with TypeScript declaration files..."
npm run build

# Check for declaration files
echo ""
echo "=== Checking for declaration files ==="
find ./dist/esm -name "*.d.ts" | sort

# Link it
echo ""
echo "Linking the package..."
npm unlink || true
npm link

# Create a package for mcp-client-langchain-ts
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod
echo ""
echo "Creating package tarball..."
npm pack

echo ""
echo "To install in your main project, run:"
echo "cd /Users/hideya/Desktop/WS/AT/mcp-client-langchain-ts"
echo "npm uninstall @n8n/json-schema-to-zod"
echo "npm install /Users/hideya/Desktop/WS/AT/json-schema-to-zod/h1deya-json-schema-to-zod-0.1.0.tgz"
echo "npm run build"
