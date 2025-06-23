#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing Manual ESM Implementation ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Build using manual approach
echo "Building with manual ESM approach..."
npm run build:types
npm run build:cjs
node manual-esm.js

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

echo ""
echo "=== If you see 'All tests completed successfully!', the ESM compatibility is working! ==="

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
