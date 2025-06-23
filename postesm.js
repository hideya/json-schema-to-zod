const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

// Write package.json to mark as ESM
fs.writeFileSync('./dist/esm/package.json', '{"type":"module"}', 'utf-8');

// Function to add .js extension to all local imports
async function fixImportsInEsmFiles() {
  const files = await glob('./dist/esm/**/*.js');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add .js extension to all local imports (excluding node_modules, etc)
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
