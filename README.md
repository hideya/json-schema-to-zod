# @h1deya/json-schema-to-zod

A fork of [@n8n/json-schema-to-zod](https://github.com/n8n-io/n8n/tree/master/packages/%40n8n/json-schema-to-zod) with improved ESM module compatibility.

This package properly handles ESM module imports, fixing issues with Node.js ESM resolution that can occur when using the original package in ESM projects.

## 🔧 Installation

```bash
npm install @h1deya/json-schema-to-zod
```

## ✨ Features

- **ESM Compatible**: Works correctly in ESM environments
- **Simple API**: Convert JSON Schema to Zod schema with a single function
- **Drop-in Replacement**: Same API as the original package
- **Fixed Module Resolution**: No more `ERR_MODULE_NOT_FOUND` errors in ESM projects

## 📚 Usage

```javascript
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
```

## 🔍 What's Fixed?

This fork addresses a critical issue with ESM module resolution in the original package. When using the package in an ESM environment (projects with `"type": "module"` in package.json), Node.js requires local imports to include file extensions (e.g., './parsers/parse-schema.js').

Our solution:

1. Uses the original TypeScript source code without modifications
2. Compiles to ESM format using modern TypeScript settings
3. Adds `.js` extensions to all local imports in the compiled output
4. Properly configures package.json for ESM usage

## 📋 Source Version

This package is based on the `@n8n/json-schema-to-zod` package from n8n repository at commit:

- **Repository**: [n8n](https://github.com/n8n-io/n8n)
- **Commit Hash**: `351db43`
- **Source Path**: `packages/@n8n/json-schema-to-zod`

The implementation has been adapted to work reliably in ESM environments while maintaining the full functionality of the original package.

## 🙌 Contribution & Maintenance

This approach makes it easy to incorporate future upstream changes:

1. Update the source files from the upstream repository
2. Run the build process with `npm run build`
3. Test the package with `npm test`

## 🙏 Credits

Original package created by Stefan Terdell and the n8n team.

This fork maintains the original ISC license and acknowledges all original contributors.

## 📄 License

ISC License
