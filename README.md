# Apryse PDF Viewer Demo - SPECOPS-1445

This React application demonstrates the capabilities of the Apryse WebViewer library for implementing PDF viewer controls as specified in SPECOPS-1445.

## 📋 Project Overview

This spike investigates whether Apryse supports the following controls required for the Blueprint Schema step:

- ✅ Rotate clockwise and counter-clockwise
- ✅ Zoom in and out
- ✅ Page navigation (Previous/Next)
- ⚠️ Highlights toggle to highlight recognized fields and labels on the PDF

## 🚀 Quick Start

### 🌐 Try it Online (StackBlitz)

Want to try it without installing? Deploy to StackBlitz:

1. **See deployment guide**: [STACKBLITZ_DEPLOYMENT.md](./STACKBLITZ_DEPLOYMENT.md)
2. **Quick method**: Push to GitHub and import to StackBlitz
3. **Uses CDN**: No need to copy WebViewer files

### 💻 Local Development

#### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Apryse WebViewer license key (get a trial key from https://dev.apryse.com/)

#### Installation

1. Clone or navigate to this directory:
   ```bash
   cd apryse-pdf-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the Apryse WebViewer library to the public folder:
   ```bash
   npm run postinstall
   ```
   Or manually:
   ```bash
   cp -r node_modules/@pdftron/webviewer/public public/webviewer
   ```

4. Add your Apryse license key:
   - Open `src/components/PDFViewer.js`
   - Replace `YOUR_LICENSE_KEY_HERE` with your actual license key

5. Add a sample PDF:
   - Place a PDF file named `sample.pdf` in the `public` folder
   - Or update the `initialDoc` path in `PDFViewer.js` to point to your PDF

### Running the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## 🎯 Features Demonstrated

### 1. Rotation Controls (✅ Out of the Box)
- **Rotate Clockwise**: Rotates the PDF 90° clockwise
- **Rotate Counter-clockwise**: Rotates the PDF 90° counter-clockwise
- **API Used**: `documentViewer.setRotation(rotation)`
- **Status**: Fully supported by Apryse

### 2. Zoom Controls (✅ Out of the Box)
- **Zoom In**: Increases zoom level by 25%
- **Zoom Out**: Decreases zoom level by 20%
- **API Used**: `documentViewer.zoomTo(zoomLevel)`
- **Status**: Fully supported by Apryse

### 3. Page Navigation (✅ Out of the Box)
- **Previous Page**: Navigate to the previous page
- **Next Page**: Navigate to the next page
- **Current Page Display**: Shows current page and total pages
- **API Used**: `documentViewer.setCurrentPage(pageNumber)`
- **Status**: Fully supported by Apryse

### 4. Highlights Toggle (⚠️ Custom Implementation)
- **Toggle Highlights**: Show/hide highlights for recognized fields
- **API Used**: `annotationManager` with `TextHighlightAnnotation`
- **Status**: Requires custom implementation using Apryse Annotations API
- **Note**: Apryse provides the annotation framework, but field recognition and highlighting logic must be implemented separately

### 5. Custom UI (✅ Default Toolbar Hidden)
- **Default Apryse toolbar is hidden** to showcase custom controls
- All PDF operations are controlled through the custom panel on the left
- See [UI_CUSTOMIZATION.md](./UI_CUSTOMIZATION.md) to restore default toolbar or customize further
- Demonstrates complete control over UI/UX

## 📁 Project Structure

```
apryse-pdf-viewer/
├── public/
│   ├── index.html
│   ├── sample.pdf              # Your PDF file (add this)
│   └── webviewer/              # Apryse WebViewer lib (auto-copied)
├── src/
│   ├── components/
│   │   ├── PDFViewer.js        # Main PDF viewer component
│   │   └── PDFViewer.css       # Viewer styles
│   ├── App.js                  # Root component
│   ├── App.css                 # App styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
├── package.json
├── README.md
└── FINDINGS.md                 # Detailed findings document
```

## 🔧 Configuration

### License Key
Update the license key in `src/components/PDFViewer.js`:
```javascript
WebViewer({
  path: '/webviewer/lib',
  initialDoc: '/sample.pdf',
  licenseKey: 'YOUR_LICENSE_KEY_HERE', // Replace this
}, viewer.current)
```

### Custom PDF Document
To use a different PDF, either:
1. Replace `public/sample.pdf` with your PDF
2. Or update the `initialDoc` path in `PDFViewer.js`

## 📖 API Reference

### Key Apryse APIs Used

- **documentViewer.setRotation(rotation)**: Rotate pages
- **documentViewer.zoomTo(zoomLevel)**: Set zoom level
- **documentViewer.setCurrentPage(pageNumber)**: Navigate pages
- **documentViewer.getPageCount()**: Get total pages
- **documentViewer.getCurrentPage()**: Get current page
- **annotationManager.addAnnotation()**: Add highlights
- **annotationManager.deleteAnnotations()**: Remove highlights

## 🐛 Troubleshooting

### WebViewer not loading
- Ensure the WebViewer library is copied to `public/webviewer/`
- Check that your license key is valid
- Verify the PDF path is correct

### CORS Errors
- Make sure the PDF is served from the same origin or CORS is properly configured
- For local development, place PDFs in the `public` folder

### Performance Issues
- Apryse WebViewer is optimized for large PDFs
- Consider lazy loading for multi-page documents
- Use streaming for remote PDFs

## 📚 Additional Resources

- [Apryse WebViewer Documentation](https://docs.apryse.com/documentation/web/)
- [API Reference](https://docs.apryse.com/api/web/Core.html)
- [Samples and Guides](https://showcase.apryse.com/)

## 📄 License

This demo is for evaluation purposes. Apryse WebViewer requires a commercial license for production use.

## 🔗 Related Documents

See [FINDINGS.md](./FINDINGS.md) for detailed analysis of Apryse capabilities and recommendations.
