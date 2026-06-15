const fs = require('fs-extra');
const path = require('path');

// Detect if running on StackBlitz or similar online IDE
const isStackBlitz = process.env.SHELL === '/bin/jsh' || 
                     process.env.TERM_PROGRAM === 'stackblitz' ||
                     process.cwd().includes('/home/') && !process.cwd().includes('/home/runner');

const isOnlineIDE = isStackBlitz || 
                    process.env.CODESANDBOX_SSE || 
                    process.env.GITPOD_WORKSPACE_ID ||
                    process.env.CODESPACES;

if (isOnlineIDE) {
  console.log('🌐 Detected online IDE (StackBlitz/CodeSandbox/Gitpod)');
  console.log('⚠️  WebViewer files should be committed to git for deployment');
  console.log('ℹ️  Attempting to copy files (may fail on some platforms)...');
}

const sourceDir = path.resolve(__dirname, '../node_modules/@pdftron/webviewer/public');
const targetDir = path.resolve(__dirname, '../public/webviewer');

console.log('Copying Apryse WebViewer library...');
console.log('From:', sourceDir);
console.log('To:', targetDir);

if (!fs.existsSync(sourceDir)) {
  console.error('ERROR: Apryse WebViewer source directory not found!');
  console.error('Make sure @pdftron/webviewer is installed.');
  process.exit(1);
}

try {
  // Remove existing directory if it exists
  if (fs.existsSync(targetDir)) {
    console.log('Removing existing webviewer directory...');
    fs.removeSync(targetDir);
  }

  // Copy the directory
  fs.copySync(sourceDir, targetDir);
  console.log('✅ Apryse WebViewer library copied successfully!');
  
  if (isOnlineIDE) {
    console.log('📝 Note: For StackBlitz deployment, commit public/webviewer/ to your git repo');
  }
} catch (error) {
  console.error('❌ Error copying WebViewer library:', error.message);
  
  if (isOnlineIDE) {
    console.warn('⚠️  Copy failed on online IDE - this is expected');
    console.warn('⚠️  Make sure public/webviewer/ is committed to your git repository');
    console.log('✅ Continuing anyway...');
    process.exit(0); // Don't fail the build
  } else {
    process.exit(1);
  }
}
