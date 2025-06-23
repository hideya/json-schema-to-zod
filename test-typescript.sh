#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing TypeScript approach with ESM fix ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Replace package.json with TypeScript version
cp package-typescript.json package.json

# Build using TypeScript
echo "Building with TypeScript + ESM fix..."
npm run build

# Link it
echo "Linking the package..."
npm unlink || true
npm link

# Run the ESM test
echo ""
echo "=== Testing ESM imports ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod/esm-test
npm link @h1deya/json-schema-to-zod
node index.js

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
