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
  console.log('⏭️  Skipping WebViewer copy - will use CDN instead');
  console.log('✅ Setup complete! The app will load WebViewer from CDN.');
  process.exit(0);
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
} catch (error) {
  console.error('❌ Error copying WebViewer library:', error.message);
  console.warn('⚠️  If running on StackBlitz, this is expected. The app will use CDN instead.');
  process.exit(1);
}
