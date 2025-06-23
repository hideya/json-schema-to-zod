#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Testing ESM compatibility ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Build the package
echo "Building the package..."
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

echo ""
echo "=== If you see 'All tests completed successfully!', the ESM compatibility is working! ==="
