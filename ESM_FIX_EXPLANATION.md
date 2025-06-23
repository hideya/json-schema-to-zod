# ESM Module Resolution Fix for json-schema-to-zod

## Root Cause of the Issue

The core problem is a mismatch between TypeScript source code conventions and ESM module requirements:

1. **Original TypeScript source** uses imports without file extensions:
   ```typescript
   import { parseSchema } from './parsers/parse-schema';
   ```

2. **Node.js ESM modules** require explicit file extensions:
   ```javascript
   import { parseSchema } from './parsers/parse-schema.js';
   ```

When compiling TypeScript for ESM using modern module resolution (`"moduleResolution": "NodeNext"`), it enforces this requirement but doesn't automatically add the extensions.

## The Solution: A Specialized Build Process

Our solution uses a pre/post build approach that:

1. **Before compilation**:
   - Backs up the original source files
   - Temporarily adds `.js` extensions to all imports in TypeScript files

2. **During compilation**:
   - TypeScript compiles the modified source to ESM modules
   - All imports now have proper `.js` extensions

3. **After compilation**:
   - Restores the original source files without extensions from the backup
   - The compiled output remains ESM-compatible

This approach maintains original source code integrity while producing ESM-compatible output.

## Key Scripts in the Build Process

- **pre-build.cjs**: Backs up source files and adds extensions to imports
- **build:ts**: Compiles TypeScript to JavaScript
- **post-build.cjs**: Restores the original source files

## Usage

This updated build only supports usage in ESM environments.

```javascript
// ESM usage (works correctly now)
import { jsonSchemaToZod } from '@h1deya/json-schema-to-zod';

// CommonJS usage is not supported
// const { jsonSchemaToZod } = require('@h1deya/json-schema-to-zod');
```
