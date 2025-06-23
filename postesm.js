const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

// Write package.json to mark as ESM
fs.writeFileSync('./dist/esm/package.json', '{"type":"module"}', 'utf-8');

// Read the index.ts file to determine exports
const indexTs = fs.readFileSync('./src/index.ts', 'utf8');
const exportsList = [];
const exportRegex = /export\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
let match;
while ((match = exportRegex.exec(indexTs)) !== null) {
  const exportNames = match[1].split(',').map(name => name.trim());
  const fromModule = match[2];
  
  exportsList.push({ exportNames, fromModule });
}

// Function to add .js extension to all local imports and fix ESM syntax
async function fixImportsInEsmFiles() {
  const files = await glob('./dist/esm/**/*.js');
  
  // First, create proper ESM index.js
  const indexJsPath = './dist/esm/index.js';
  let indexContent = '';
  
  exportsList.forEach(({ exportNames, fromModule }) => {
    // Each export name might be like "jsonSchemaToZod" or "name as alias"
    exportNames.forEach(exportName => {
      // Use the proper path with .js extension
      const modulePath = fromModule.startsWith('.') 
        ? `${fromModule}.js`
        : fromModule;
      
      indexContent += `export { ${exportName} } from "${modulePath}";\n`;
    });
  });
  
  // Write the proper ESM index.js
  fs.writeFileSync(indexJsPath, indexContent, 'utf8');
  
  // Then fix all other files
  for (const file of files) {
    if (file === indexJsPath) continue; // Skip the index.js we just created
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace CommonJS require with ESM import
    content = content.replace(
      /(?:const|var|let)\s+([^=]+)\s*=\s*require\(['"]([^'"]+)['"]\);/g,
      (_, importName, importPath) => {
        // Fix the import path to include .js extension for local imports
        const fixedPath = importPath.startsWith('.')
          ? `${importPath}.js`
          : importPath;
          
        return `import * as ${importName} from '${fixedPath}';`;
      }
    );
    
    // Replace CommonJS exports with ESM exports
    content = content.replace(
      /exports\.([^ ]+) = ([^;]+);/g,
      'export const $1 = $2;'
    );
    
    // Remove CommonJS specific lines
    content = content.replace(
      /"use strict";(\r?\n)/g,
      ''
    );
    
    content = content.replace(
      /Object\.defineProperty\(exports, "__esModule", \{\s*value: true\s*\}\);(\r?\n)/g,
      ''
    );
    
    // Add .js extension to existing ESM imports
    content = content.replace(
      /from\s+['"](\.[^'"]+)['"]/g, 
      (match, importPath) => {
        // Skip if already has an extension
        if (path.extname(importPath) !== '') {
          return match;
        }
        return `from '${importPath}.js'`;
      }
    );
    
    fs.writeFileSync(file, content, 'utf8');
  }
}

fixImportsInEsmFiles().catch(error => {
  console.error('Error fixing ESM imports:', error);
  process.exit(1);
});
