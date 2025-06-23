const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use git to restore the src directory
try {
  console.log('Restoring source files to original state...');
  execSync('git checkout -- src/', { stdio: 'inherit' });
  console.log('Source files restored successfully');
} catch (error) {
  // If git checkout fails (e.g., files not in git), create a backup/restore mechanism
  console.log('Git checkout failed. Using backup mechanism...');
  
  // Check if backup exists
  if (fs.existsSync('./src-backup')) {
    // Copy backup back to src
    fs.rmSync('./src', { recursive: true, force: true });
    fs.cpSync('./src-backup', './src', { recursive: true });
    console.log('Source files restored from backup');
  } else {
    console.warn('No backup found. Source files may contain .js extensions in imports.');
  }
}
