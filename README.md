# Json-Schema-to-Zod

A package to convert JSON schema (draft 4+) objects into Zod schemas in the form of Zod objects at runtime.

A fork of [@n8n/json-schema-to-zod](https://github.com/n8n-io/n8n/tree/master/packages/%40n8n/json-schema-to-zod)
with improved ESM module compatibility.  
The src files are of Jun 21, 2025 (version 1.3.0, commit hash: `351db43`).

## Installation

```bash
npm install @h1deya/json-schema-to-zod
```

## Usage

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

## The Problem This Fork Solves

When using the original `@n8n/json-schema-to-zod` package in an ESM environment (projects with `"type": "module"` in package.json), you might encounter this error:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../parse-schema' imported from '.../json-schema-to-zod.js'
```

This happens because:
1. Node.js requires file extensions (like `.js`) in ESM import paths
2. The original package's TypeScript source doesn't include these extensions
3. When compiled for ESM, this creates broken imports

## How This Fork Fixes It

This fork fixes the issue through a specialized build process that:
1. Temporarily adds `.js` extensions to all imports in the TypeScript source
2. Compiles the modified source to ESM
3. Restores the original source code afterward

This approach:
- Preserves the original source code (making future upstream syncs easier)
- Produces ESM-compatible output that works in modern Node.js environments
- Maintains full functionality and API compatibility

### Additional Fix: CommonJS Require Removal

A leftover CommonJS `require()` usage was found in `src/parsers/parse-nullable.ts`
and was replaced with an ESM `import`:

```typescript
--- a/src/parsers/parse-nullable.ts
+++ b/src/parsers/parse-nullable.ts
@@ -1,9 +1,9 @@
 import { z } from 'zod';
 
 import type { JsonSchemaObject } from '../types';
+import { parseSchema } from './parse-schema';
 
 export const parseNullable = (jsonSchema: JsonSchemaObject & { nullable: true }, refs: any) => {
-       const { parseSchema } = require('./parse-schema');
```

## Source & Maintenance

This package is based on the original code from:
- **Repository**: [n8n](https://github.com/n8n-io/n8n)
- **Commit Hash**: `351db43` (Jun 21, 2025)
- **Source Path**: [`packages/@n8n/json-schema-to-zod`](https://github.com/n8n-io/n8n/tree/master/packages/%40n8n/json-schema-to-zod)

To update with upstream changes:
1. Update the source files in the `src` directory
2. Run `npm run build`
3. Test with `npm test`

## Credits

Original package created by Stefan Terdell and the n8n team.

This fork maintains the original ISC license and acknowledges all original contributors.

## License

ISC License
