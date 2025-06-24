const fs = require('fs');
const path = require('path');

// Use the backup we created in pre-build.cjs to restore the source files
try {
  console.log('Restoring source files from backup...');
  
  // Check if backup exists
  if (fs.existsSync('./src-backup')) {
    // Remove the modified src directory
    if (fs.existsSync('./src')) {
      fs.rmSync('./src', { recursive: true, force: true });
    }
    
    // Copy backup back to src
    fs.cpSync('./src-backup', './src', { recursive: true });
    
    // // Clean up the backup
    // fs.rmSync('./src-backup', { recursive: true, force: true });
    
    console.log('Source files successfully restored from backup');
  } else {
    console.warn('Warning: No backup found at ./src-backup');
    console.warn('Source files may still contain .js extensions in imports.');
    console.warn('If this is unexpected, you may need to manually restore your source files.');
  }
} catch (error) {
  console.error('Error restoring source files:', error);
  console.warn('Source files may still contain .js extensions in imports.');
  console.warn('You may need to manually restore your source files.');
}
