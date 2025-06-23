const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

async function backupSourceFiles() {
  console.log('Creating backup of source files...');
  
  // Remove any existing backup
  if (fs.existsSync('./src-backup')) {
    fs.rmSync('./src-backup', { recursive: true, force: true });
  }
  
  // Create a new backup
  fs.cpSync('./src', './src-backup', { recursive: true });
  console.log('Backup created');
}

async function addExtensionsToImports() {
  console.log('Adding .js extensions to TypeScript imports...');
  const files = await glob('./src/**/*.ts');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add .js extension to all relative imports that don't already have an extension
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
  
  console.log(`Processed ${files.length} files`);
}

// Main function
async function main() {
  try {
    await backupSourceFiles();
    await addExtensionsToImports();
    console.log('Pre-processing completed successfully');
  } catch (error) {
    console.error('Error during pre-processing:', error);
    process.exit(1);
  }
}

main();
