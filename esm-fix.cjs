const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

// Mark the ESM directory as ESM
fs.writeFileSync('./dist/esm/package.json', JSON.stringify({ type: 'module' }));

// Function to add .js extension to all local imports in ESM files
async function fixImportsInEsmFiles() {
  console.log('Adding .js extensions to ESM imports...');
  const files = await glob('./dist/esm/**/*.js');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add .js extension to all local imports
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
  
  console.log(`Fixed ${files.length} files`);
}

// Main function
async function main() {
  try {
    await fixImportsInEsmFiles();
    console.log('ESM post-processing completed successfully');
  } catch (error) {
    console.error('Error during ESM post-processing:', error);
    process.exit(1);
  }
}

main();
