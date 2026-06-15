# Deploying to StackBlitz

## Option 1: Using StackBlitz with CDN (Recommended)

StackBlitz works best when using the WebViewer from a CDN instead of copying local files.

### Step 1: Update PDFViewer.js for CDN

Change the WebViewer initialization to use the CDN path:

```javascript
WebViewer(
  {
    path: 'https://unpkg.com/@pdftron/webviewer@10.11.0/public',
    initialDoc: '/sample.pdf',
    licenseKey: 'YOUR_LICENSE_KEY_HERE',
  },
  viewer.current
)
```

### Step 2: Push to GitHub

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 3: Import to StackBlitz

1. Go to https://stackblitz.com
2. Click "Import from GitHub"
3. Enter your repository URL
4. StackBlitz will automatically detect it's a React app and run it

---

## Option 2: Direct Upload to StackBlitz

### Files to Upload (Exclude Large Folders):

**Include:**
- `src/` folder (all files)
- `public/index.html`
- `public/sample.pdf`
- `package.json`
- `README.md`

**Exclude:**
- `node_modules/`
- `public/webviewer/` (use CDN instead)
- `.git/`

### Steps:

1. Go to https://stackblitz.com
2. Click "New Project" → "React"
3. Upload your files manually (drag & drop)
4. Update WebViewer path to use CDN (see Option 1)

---

## Option 3: Use StackBlitz SDK Link

Create a quick deploy link by adding this to your README:

```markdown
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/YOUR_USERNAME/YOUR_REPO_NAME)
```

---

## Required Changes for StackBlitz

### 1. Update package.json

Make sure you have these scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

### 2. Use CDN for WebViewer (Recommended)

Since StackBlitz has file size limitations, using the CDN is more reliable.

**Update `src/components/PDFViewer.js`:**

Find this section:
```javascript
WebViewer(
  {
    path: '/webviewer',
    // ...
  }
)
```

Change to:
```javascript
WebViewer(
  {
    path: 'https://unpkg.com/@pdftron/webviewer@10.11.0/public',
    // ...
  }
)
```

### 3. Simplify postinstall Script

Remove or comment out the postinstall script in package.json since you're using CDN:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
    // Remove: "postinstall": "node scripts/copy-webviewer.js"
  }
}
```

---

## Quick Start Commands for StackBlitz

Once imported, StackBlitz will automatically run:
```bash
npm install
npm start
```

The app will be live at a StackBlitz URL like:
`https://stackblitz.com/edit/your-project-name`

---

## Troubleshooting StackBlitz

### Issue: WebViewer not loading
**Solution**: Make sure you're using the CDN path instead of local files

### Issue: Sample PDF not found
**Solution**: 
- Ensure `sample.pdf` is in the `public/` folder
- Or use a publicly accessible PDF URL:
  ```javascript
  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
  ```

### Issue: CORS errors
**Solution**: Use the demo PDF from Apryse or host your PDF on a CORS-enabled server

### Issue: Slow loading
**Solution**: This is normal for the first load as StackBlitz downloads the WebViewer from CDN

---

## Example StackBlitz Configuration

Create a `.stackblitzrc` file in your root directory:

```json
{
  "installDependencies": true,
  "startCommand": "npm start",
  "env": {
    "BROWSER": "none"
  }
}
```

---

## Testing Before Deployment

Test the CDN version locally:

1. Update PDFViewer.js to use CDN path
2. Run `npm start`
3. If it works locally, it will work on StackBlitz

---

## Alternative: Use CodeSandbox

If StackBlitz has issues, CodeSandbox is another option:

1. Go to https://codesandbox.io
2. Click "Create Sandbox" → "Import from GitHub"
3. Enter your repo URL
4. Same CDN changes apply

---

## Share Your StackBlitz Project

Once deployed, you can:
- Share the live URL
- Embed it in documentation
- Allow others to fork and edit

Example share URL format:
```
https://stackblitz.com/edit/apryse-pdf-viewer-demo?file=src/components/PDFViewer.js
```

---

## Notes

- StackBlitz has a ~20MB limit, so CDN is essential
- The app will run slightly slower than localhost (browser-based IDE)
- Some features may require adjusting security settings
- For production deployment, use Netlify, Vercel, or GitHub Pages instead

---

**Need Help?**
- StackBlitz Documentation: https://developer.stackblitz.com/docs/platform/
- Apryse WebViewer Docs: https://docs.apryse.com/documentation/web/
