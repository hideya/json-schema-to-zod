#!/bin/bash

# This script performs final cleanup of the repository,
# removing unnecessary files and keeping only what's needed
# for the package to function properly.

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Cleaning up the repository ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Remove old build scripts and test files
echo "Removing unnecessary files..."
rm -f test-both-approaches.sh test-manual-esm.sh test-esm.sh test-package.js test-package.mjs verify-build.sh fix-and-install.sh test-typescript.sh test-updated-build.sh

# Remove temporary files from previous approaches
rm -f manual-esm.js esm-only.cjs package-esm-only.json package-typescript.json
rm -f postcjs.js postesm.js .eslintrc.js jest.config.js .npmignore

# Keep essential files
echo "Essential files retained:"
echo "- pre-build.cjs: Prepares source files for ESM-compatible build"
echo "- esm-fix.cjs: Fixes ESM module paths in compiled output"
echo "- restore-src.cjs: Restores original source files after build"
echo "- src/: Original TypeScript source code"
echo "- tsconfig.json: TypeScript configuration for ESM build"
echo "- package.json: Package configuration with build scripts"
echo "- README.md, CHANGELOG.md, ESM_FIX_EXPLANATION.md: Documentation"

echo ""
echo "Repository cleaned up successfully!"
echo ""
echo "The package now uses a specialized build process that:"
echo "1. Temporarily adds .js extensions to imports in the TypeScript source"
echo "2. Compiles the modified source to ESM"
echo "3. Restores the original source code afterward"
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
