# Prepare for StackBlitz Deployment
# This script updates files to use CDN instead of local WebViewer files

Write-Host "🚀 Preparing Apryse PDF Viewer for StackBlitz Deployment..." -ForegroundColor Cyan
Write-Host ""

# 1. Update PDFViewer.js to use CDN version
Write-Host "✓ Updating PDFViewer.js to use CDN..." -ForegroundColor Green
Copy-Item "src\components\PDFViewer.stackblitz.js" "src\components\PDFViewer.js" -Force

# 2. Update package.json for safer postinstall
Write-Host "✓ Updating package.json..." -ForegroundColor Green
Copy-Item "package.stackblitz.json" "package.json" -Force

Write-Host ""
Write-Host "✅ Preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test locally: npm start"
Write-Host "  2. Create GitHub repo"
Write-Host "  3. Push to GitHub"
Write-Host "  4. Import to StackBlitz from GitHub"
Write-Host ""
Write-Host "📖 See DEPLOY_TO_STACKBLITZ.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 StackBlitz URL: https://stackblitz.com" -ForegroundColor Blue
