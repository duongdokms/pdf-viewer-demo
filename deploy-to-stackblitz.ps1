# Quick StackBlitz Deployment Script
# Run this to prepare and deploy your app to StackBlitz

Write-Host "🚀 Preparing for StackBlitz Deployment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Update to use CDN
Write-Host "Step 1: Updating to use CDN instead of local files..." -ForegroundColor Yellow
if (Test-Path "src\components\PDFViewer.stackblitz.js") {
    Copy-Item "src\components\PDFViewer.stackblitz.js" "src\components\PDFViewer.js" -Force
    Write-Host "✓ Updated PDFViewer.js" -ForegroundColor Green
}

# Step 2: Initialize git (if not already)
Write-Host ""
Write-Host "Step 2: Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}

# Step 3: Add files
Write-Host ""
Write-Host "Step 3: Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Step 4: Commit
Write-Host ""
Write-Host "Step 4: Creating commit..." -ForegroundColor Yellow
git commit -m "Apryse PDF Viewer Demo - Ready for StackBlitz"
Write-Host "✓ Commit created" -ForegroundColor Green

# Step 5: Instructions for GitHub
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ PROJECT READY FOR STACKBLITZ!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Run these commands (replace YOUR_USERNAME and YOUR_REPO):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Blue
Write-Host "   git branch -M main" -ForegroundColor Blue
Write-Host "   git push -u origin main" -ForegroundColor Blue
Write-Host ""
Write-Host "3. Open StackBlitz and import from GitHub:" -ForegroundColor White
Write-Host "   https://stackblitz.com" -ForegroundColor Blue
Write-Host "   Click: 'Import from GitHub'" -ForegroundColor Cyan
Write-Host "   Enter: https://github.com/YOUR_USERNAME/YOUR_REPO" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 OR use this direct link format:" -ForegroundColor Yellow
Write-Host "   https://stackblitz.com/github/YOUR_USERNAME/YOUR_REPO" -ForegroundColor Blue
Write-Host ""
