# Changelog

## v0.1.0 (Initial Release)

**Release Date:** TBD (When you publish the package)

### Source Information
- Based on `@n8n/json-schema-to-zod` package from n8n repository
- Source commit: `351db43` (https://github.com/n8n-io/n8n/commits/master/)
- Source path: `packages/@n8n/json-schema-to-zod`

### Changes
- Fixed ESM module resolution issues to support projects using `"type": "module"`
  - Added `.js` extensions to all local imports in ESM build output
  - Changed TypeScript module resolution to "NodeNext" for better ESM compatibility
  - Updated build scripts to properly handle ESM/CommonJS dual package
- Fixed TypeScript compatibility issues:
  - Added proper type casting for Zod methods
  - Resolved type incompatibilities with Serializable types
  - Fixed return type issues with refine() methods
  - Added explicit type annotations to eliminate type errors

### Functionality
- No changes to source code logic or functionality
- All behavior remains identical to the original package
- This is strictly a build/packaging fix

## Credits
The original package was created by Stefan Terdell and the n8n team.
