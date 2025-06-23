#!/bin/bash

# Fix TypeScript build issues and test

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Building the fixed json-schema-to-zod package ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the package
echo "Building the package..."
npm run build

# If we get here, the build was successful
echo ""
echo "=== Build successful! ==="
echo ""
echo "The TypeScript type issues have been fixed."
echo ""
echo "Next steps:"
echo "1. Create a package tarball: npm pack"
echo "2. Install it in your project: npm install /path/to/tarball.tgz"
echo "3. Test it in your project"
echo ""
echo "Or to publish to npm directly:"
echo "npm login"
echo "npm publish"
