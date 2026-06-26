import PDFHelper from './PDFHelper.js';

/**
 * Example usage of PDFHelper for server-side PDF processing
 */

async function main() {
  // Initialize with Apryse license key from environment variable
  // Or pass explicitly: new PDFHelper('YOUR_LICENSE_KEY')
  const pdfHelper = new PDFHelper(process.env.REACT_APP_APRYSE_LICENSE_KEY);
  
  const pdfPath = 'C:\\Users\\duongdo\\Desktop\\Project Features Implementation Guide\\apryse-pdf-viewer\\public\\sample.pdf';
  const outputPath = './output.pdf';

  try {
    // Example 1: Extract all form fields
    console.log('\n========== Extracting Form Fields ==========');
    const fields = await pdfHelper.extractFormFields(pdfPath);
    
    fields.forEach(field => {
      console.log(`\nField: "${field.name}"`);
      console.log(`  Type: ${field.type}`);
      console.log(`  Value: ${field.value}`);
      
      field.widgets.forEach((widget, idx) => {
        console.log(`  Widget ${idx + 1}:`);
        console.log(`    Page: ${widget.page}`);
        console.log(`    Position: (${widget.rect.x1.toFixed(2)}, ${widget.rect.y1.toFixed(2)}) to (${widget.rect.x2.toFixed(2)}, ${widget.rect.y2.toFixed(2)})`);
        console.log(`    Normalized: x=${widget.normalizedRect.x.toFixed(4)}, y=${widget.normalizedRect.y.toFixed(4)}, w=${widget.normalizedRect.w.toFixed(4)}, h=${widget.normalizedRect.h.toFixed(4)}`);
      });
    });
    
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();
