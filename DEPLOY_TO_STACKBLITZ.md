# Quick StackBlitz Deployment Steps

## Method 1: GitHub Import (Recommended)

### Step 1: Prepare for StackBlitz
```powershell
# In the apryse-pdf-viewer folder

# 1. Update PDFViewer to use CDN
# Copy the StackBlitz version over the current one
Copy-Item src\components\PDFViewer.stackblitz.js src\components\PDFViewer.js -Force

# 2. Update package.json (optional - safer postinstall)
Copy-Item package.stackblitz.json package.json -Force
```

### Step 2: Create GitHub Repository
```powershell
# Initialize git
git init

# Add files (excluding large folders)
git add .

# Commit
git commit -m "Apryse PDF Viewer Demo - SPECOPS-1445"

# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/apryse-pdf-viewer.git
git branch -M main
git push -u origin main
```

### Step 3: Import to StackBlitz
1. Go to https://stackblitz.com
2. Click "Import from GitHub"
3. Paste your repo URL: `https://github.com/YOUR_USERNAME/apryse-pdf-viewer`
4. Wait for StackBlitz to load and install dependencies
5. The app will run automatically!

---

## Method 2: Direct Upload

### What to Upload:
```
✅ src/ (all files)
✅ public/index.html
✅ public/sample.pdf (or remove, it will use demo PDF)
✅ package.json
✅ README.md
❌ node_modules/ (StackBlitz installs automatically)
❌ public/webviewer/ (using CDN instead)
```

### Steps:
1. Go to https://stackblitz.com
2. Click "New Project" → "React"
3. Delete default files
4. Drag & drop your files
5. Update imports if needed

---

## Method 3: Use StackBlitz Link

After pushing to GitHub, create a one-click deploy link:

```
https://stackblitz.com/github/YOUR_USERNAME/apryse-pdf-viewer
```

Share this link and anyone can open your project!

---

## Verify It Works

After deployment, check browser console for:
```
✅ "Initializing WebViewer..."
✅ "Loading from CDN..."
✅ "WebViewer instance created successfully!"
✅ "Document loaded successfully"
```

---

## StackBlitz URL Format

Your live app will be at:
```
https://stackblitz.com/edit/YOUR-PROJECT-NAME
```

Or:
```
https://YOUR-PROJECT-NAME.stackblitz.io
```

---

## Troubleshooting

**Problem**: "Cannot find module '@pdftron/webviewer'"  
**Solution**: Wait for npm install to complete (check console)

**Problem**: PDF not loading  
**Solution**: App will use demo PDF automatically

**Problem**: Slow loading  
**Solution**: First load from CDN takes ~10-20 seconds

**Problem**: "Invalid license key"  
**Solution**: Get trial key from https://dev.apryse.com/

---

## Next Steps

After successful deployment:
1. Share the StackBlitz URL with your team
2. Test all features (rotation, zoom, navigation, highlights)
3. Update license key in environment variables
4. Customize the PDF document

---

**Need help?** See [STACKBLITZ_DEPLOYMENT.md](./STACKBLITZ_DEPLOYMENT.md) for detailed guide.
