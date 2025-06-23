# @h1deya/json-schema-to-zod

A fork of [@n8n/json-schema-to-zod](https://github.com/n8n-io/n8n/tree/master/packages/%40n8n/json-schema-to-zod) with improved ESM module compatibility.

This package properly handles ESM module paths, fixing issues with Node.js ESM resolution that can occur when using the original package in ESM projects.

## 🔧 Installation

```bash
npm install @h1deya/json-schema-to-zod
```

## ✨ Features

- **ESM Compatible**: Works correctly in both ESM and CommonJS environments
- **Full Feature Set**: Includes all functionality from the original package
- **Drop-in Replacement**: Identical API to the original package
- **Fixed Module Resolution**: No more `ERR_MODULE_NOT_FOUND` errors in ESM projects

## 📚 Usage

```typescript
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

This fork addresses two critical issues with the original package:

1. **ESM Module Resolution**: When using the package in an ESM environment (projects with `"type": "module"` in package.json), Node.js requires local imports to include file extensions. Our solution:
   - Adds `.js` extensions to all local imports in the compiled ESM output
   - Uses `NodeNext` moduleResolution in TypeScript config
   - Properly configures package exports for dual ESM/CommonJS compatibility

2. **TypeScript Compatibility**: The original package has type issues that prevent successful TypeScript compilation. Our solution:
   - Fixes type compatibility with the Zod library
   - Adds proper type casting for Zod methods
   - Resolves issues with generic types and type inference

## 📋 Source Version

This package is based on the `@n8n/json-schema-to-zod` package from n8n repository at commit:

- **Repository**: [n8n](https://github.com/n8n-io/n8n)
- **Commit Hash**: `351db43`
- **Source Path**: `packages/@n8n/json-schema-to-zod`
- **Source Date**: Check the commit date on the [n8n repository](https://github.com/n8n-io/n8n/commits/master/)

No modifications were made to the original source code logic - only build configuration changes to fix ESM compatibility issues.

## 🛠️ API

The package exports the main `jsonSchemaToZod` function:

```typescript
function jsonSchemaToZod<T extends z.ZodTypeAny = z.ZodTypeAny>(
  schema: JsonSchema, 
  options?: JsonSchemaToZodOptions
): T;
```

### Options

```typescript
interface JsonSchemaToZodOptions {
  withoutDefaults?: boolean;     // Don't include default values
  withoutDescribes?: boolean;    // Don't include descriptions
  parserOverride?: ParserOverride; // Custom parser function
  depth?: number;                // Max recursion depth
}
```

## 🙏 Credits

Original package created by Stefan Terdell and the n8n team.

This fork maintains the original ISC license and acknowledges all original contributors.

## 📄 License

ISC License
