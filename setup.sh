#!/bin/bash

# Install dependencies
npm install

# Build the package
npm run build

echo "Package has been built successfully!"
echo ""
echo "To publish to npm, run:"
echo "npm login"
echo "npm publish --access=public"
echo ""
echo "To test locally, run:"
echo "npm pack"
echo "# This will create a tarball file that you can install in your project:"
echo "# npm install /path/to/h1deya-json-schema-to-zod-0.1.0.tgz"
