# Add Your PDF File Here

To test the application, you need to add a PDF file to this folder.

## Instructions:

1. Place your PDF file in this folder (public/)
2. Name it `sample.pdf` 
   - OR update the filename in `src/components/PDFViewer.js`
   - OR set REACT_APP_INITIAL_PDF in .env.local

## Recommended PDFs for Testing:

For best demonstration of all features, use a PDF that:
- Has multiple pages (3+ pages) - for testing navigation
- Contains text content - for testing zoom and rotation
- Is a form or has structured fields - for testing highlights
- Is not too large (< 10MB for faster loading)

## Where to Get Sample PDFs:

1. **Government Forms**: 
   - IRS forms (e.g., W-9, 1040)
   - Available at: https://www.irs.gov/forms-instructions

2. **Adobe Sample PDFs**:
   - Available at: https://acrobat.adobe.com/us/en/acrobat/pdf-reader.html

3. **Your Own Documents**:
   - Use any PDF from your organization
   - Form PDFs work best for highlights testing

## Current Setup:

Place your PDF here and name it: `sample.pdf`

Example:
```
public/
  ├── index.html
  ├── sample.pdf  <-- Your PDF goes here
  └── webviewer/  (auto-generated)
```

## After Adding PDF:

Run the application:
```bash
npm start
```

The PDF will load automatically when the page opens.

## Troubleshooting:

**PDF not loading?**
- Make sure the file is actually in the public/ folder
- Check that it's named exactly `sample.pdf` (case-sensitive on some systems)
- Verify the PDF is not corrupted (try opening it in a PDF reader first)
- Check browser console for error messages

**Want to use a different filename?**
1. Create a `.env.local` file in the root folder
2. Add: `REACT_APP_INITIAL_PDF=your-filename.pdf`
3. Restart the application

---

For more help, see README.md
