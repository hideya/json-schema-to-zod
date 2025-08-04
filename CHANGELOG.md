# Changelog

## [0.1.1] - 2025-06-30

## Fixed
- Fix a leftover CommonJS `require()` usage found in `src/parsers/parse-nullable.ts`


## [0.1.0] - 2025-06-24

**Release Date:** TBD (When you publish the package)

### Source Information
- Based on `@n8n/json-schema-to-zod` package from n8n repository
- Source commit: `351db43` (https://github.com/n8n-io/n8n/commits/master/)
- Source path: `packages/@n8n/json-schema-to-zod`

### Key Fix: ESM Module Resolution

This package fixes a critical issue with ESM module resolution. The root cause:

1. Node.js requires explicit file extensions in import paths for ESM modules
2. The original TypeScript source doesn't include these extensions
3. When compiled for ESM, this creates broken import paths

Our solution uses a specialized build process that:
- Temporarily adds .js extensions to all imports in the TypeScript source
- Compiles the modified source to ESM
- Restores the original source code afterward

### Additional Improvements

- Configured TypeScript to properly handle ESM module resolution
- Disabled strict implicit any checks to preserve original code behavior
- Added proper ESM package.json configuration

### Functionality

No changes to the underlying logic or functionality. This package maintains full API compatibility with the original while fixing the ESM compatibility issues.

## Credits
The original package was created by Stefan Terdell and the n8n team.
