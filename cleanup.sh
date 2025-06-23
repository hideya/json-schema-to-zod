#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "=== Cleaning up the repository ==="
cd /Users/hideya/Desktop/WS/AT/json-schema-to-zod

# Remove unnecessary files
echo "Removing unnecessary files..."

# Remove old build scripts and config files
rm -f postcjs.js postesm.js manual-esm.js
rm -f tsconfig.json tsconfig.cjs.json tsconfig.esm.json tsconfig.types.json
rm -f .eslintrc.js jest.config.js .npmignore

# Keep the src directory for reference - DON'T REMOVE
# We'll add a note that it's for reference only
echo "// NOTE: This source code is kept for reference only.
// The actual implementation used is in esm-only.cjs" > src/README.md

# Remove old test scripts
rm -f test-both-approaches.sh test-manual-esm.sh test-esm.sh test-package.js test-package.mjs verify-build.sh fix-and-install.sh

# Rename our ESM-only files to be the standard ones
echo "Setting up clean repository..."
mv package-esm-only.json package.json

# Create a clean README
cat > README.md << EOF
# @h1deya/json-schema-to-zod

A fork of [@n8n/json-schema-to-zod](https://github.com/n8n-io/n8n/tree/master/packages/%40n8n/json-schema-to-zod) with improved ESM module compatibility.

This package properly handles ESM module imports, fixing issues with Node.js ESM resolution that can occur when using the original package in ESM projects.

## 🔧 Installation

\`\`\`bash
npm install @h1deya/json-schema-to-zod
\`\`\`

## ✨ Features

- **ESM Compatible**: Works correctly in ESM environments
- **Simple API**: Convert JSON Schema to Zod schema with a single function
- **Drop-in Replacement**: Same API as the original package
- **Fixed Module Resolution**: No more \`ERR_MODULE_NOT_FOUND\` errors in ESM projects

## 📚 Usage

\`\`\`javascript
import { jsonSchemaToZod } from '@h1deya/json-schema-to-zod';
import { z } from 'zod';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};

const zodSchema = jsonSchemaToZod(schema);
// Result: z.object({ name: z.string(), age: z.number().optional() })

// Validate data
const validData = { name: 'John', age: 30 };
zodSchema.parse(validData); // Works!

const invalidData = { age: 30 };
try {
  zodSchema.parse(invalidData);
} catch (error) {
  console.error(error); // Validation error: name is required
}
\`\`\`

## 📋 Source Version

This package is based on the \`@n8n/json-schema-to-zod\` package from n8n repository at commit:

- **Repository**: [n8n](https://github.com/n8n-io/n8n)
- **Commit Hash**: \`351db43\`
- **Source Path**: \`packages/@n8n/json-schema-to-zod\`

The implementation has been simplified and adapted to work reliably in ESM environments.

## 🙏 Credits

Original package created by Stefan Terdell and the n8n team.

This fork maintains the original ISC license and acknowledges all original contributors.

## 📄 License

ISC License
EOF

echo ""
echo "Repository cleaned up successfully!"
echo ""
echo "To install in your main project, run:"
echo "cd /Users/hideya/Desktop/WS/AT/mcp-client-langchain-ts"
echo "npm uninstall @n8n/json-schema-to-zod"
echo "npm install /Users/hideya/Desktop/WS/AT/json-schema-to-zod/h1deya-json-schema-to-zod-0.1.0.tgz"
echo "npm run build"
