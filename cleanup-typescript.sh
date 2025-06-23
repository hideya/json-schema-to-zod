#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Cleaning up the repository ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Remove unnecessary files
echo "Removing unnecessary files..."

# Remove old build scripts
rm -f postcjs.js postesm.js manual-esm.js esm-only.cjs
rm -f package-esm-only.json package-typescript.json
rm -f .eslintrc.js jest.config.js .npmignore

# Keep all necessary TypeScript files (src, tsconfig.json)

# Remove old test scripts
rm -f test-both-approaches.sh test-manual-esm.sh test-esm.sh test-package.js test-package.mjs verify-build.sh fix-and-install.sh test-typescript.sh

# Keep the ESM fix script
# Keep the TypeScript configuration
# Keep the src directory
# Keep the package.json with TypeScript build process

echo ""
echo "Repository cleaned up successfully!"
echo ""
echo "The package now uses a TypeScript-based build process with ESM compatibility:"
echo "1. Original TypeScript source from src/ directory"
echo "2. TypeScript compilation with tsconfig.json"
echo "3. ESM fix script (esm-fix.cjs) to add .js extensions"
echo ""
echo "To build the package:"
echo "npm run build"
echo ""
echo "To test the package:"
echo "npm test"
echo ""
echo "To install in your main project:"
echo "cd /Users/hideya/Desktop/WS/AT/mcp-client-langchain-ts"
echo "npm uninstall @n8n/json-schema-to-zod"
echo "npm install /Users/hideya/Desktop/WS/AT/json-schema-to-zod"
echo "npm run build"
