# Quick Start Guide

## SPECOPS-1445: Apryse PDF Viewer Demo

### Setup in 3 Steps:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Copy WebViewer library**
   ```bash
   # Windows (PowerShell)
   xcopy /E /I node_modules\@pdftron\webviewer\public public\webviewer
   
   # Mac/Linux
   cp -r node_modules/@pdftron/webviewer/public public/webviewer
   ```

3. **Add sample PDF and license key**
   - Place a PDF file named `sample.pdf` in the `public` folder
   - Edit `src/components/PDFViewer.js` and add your Apryse license key
   - Get a trial key: https://dev.apryse.com/

4. **Run the app**
   ```bash
   npm start
   ```

### Features Demonstrated:

✅ **Rotation Controls** - Rotate PDF clockwise/counter-clockwise  
✅ **Zoom Controls** - Zoom in/out with live zoom percentage  
✅ **Page Navigation** - Navigate previous/next with page counter  
⚠️ **Highlights Toggle** - Show/hide field highlights (custom implementation)

### Documentation:

- Full setup guide: [README.md](./README.md)
- Detailed findings: [FINDINGS.md](./FINDINGS.md)
- JIRA ticket: SPECOPS-1445

### Troubleshooting:

**WebViewer not loading?**
- Make sure `public/webviewer/` folder exists and contains the library files
- Check that `sample.pdf` exists in the `public` folder
- Verify your license key is correct

**Need help?**
- Check the detailed README.md
- Review the FINDINGS.md document
- Consult Apryse documentation: https://docs.apryse.com/
