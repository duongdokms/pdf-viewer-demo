const fs = require('fs-extra');
const path = require('path');

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
  process.exit(1);
}
