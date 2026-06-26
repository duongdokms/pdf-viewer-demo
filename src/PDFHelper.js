const { PDFNet } = require('@pdftron/pdfnet-node');

/**
 * Server-side PDF Helper using Apryse PDFNet SDK
 * Handles form field extraction and PDF processing on the server
 */
class PDFHelper {
  constructor(licenseKey = process.env.REACT_APP_APRYSE_LICENSE_KEY || '') {
    this.licenseKey = licenseKey;
    this.initialized = false;
  }

  /**
   * Initialize PDFNet library
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await PDFNet.initialize(this.licenseKey);
      this.initialized = true;
      console.log('PDFNet initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PDFNet:', error);
      throw error;
    }
  }

  /**
   * Extract all form fields from a PDF file
   * @param {string} pdfPath - Path to the PDF file
   * @returns {Promise<Array>} Array of field objects with metadata
   */
  async extractFormFields(pdfPath) {
    await this.initialize();

    const extractedFields = [];

    try {
      const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
      await doc.initSecurityHandler();
      await doc.lock();

      const pageCount = await doc.getPageCount();

      // Iterate through all pages and their annotations directly
      for (let p = 1; p <= pageCount; p++) {
        const page = await doc.getPage(p);
        const numAnnots = await page.getNumAnnots();
        
        for (let i = 0; i < numAnnots; i++) {
          const annot = await page.getAnnot(i);
          const annotType = await annot.getType();
          
          if (annotType === PDFNet.Annot.Type.e_Widget) {
            const widget = await PDFNet.WidgetAnnot.createFromAnnot(annot);
            const field = await widget.getField();
            
            if (field && await field.isValid()) {
              // Retrieve field data
              const fieldName = await field.getName();
              const fieldValue = await field.getValueAsString();
              const fieldType = await field.getType();

              // Get alternate field name (often used as label/tooltip)
              let label = null;
              try {
                const fieldSDFObj = await field.getSDFObj();
                if (fieldSDFObj) {
                  const tuObj = await fieldSDFObj.findObj('TU');
                  if (tuObj) {
                    label = await tuObj.getAsPDFText();
                  }
                }
              } catch (e) {
                // TU field not available
              }

              // Get the rectangle (position and size)
              const rect = await annot.getRect();
              const x1 = await rect.x1;
              const y1 = await rect.y1;
              const x2 = await rect.x2;
              const y2 = await rect.y2;
              
              const position = {
                x: x1,
                y: y1
              };
              
              const dimensions = {
                width: x2 - x1,
                height: y2 - y1
              };

              // Extract nearby text as potential label
              let nearbyText = null;
              try {
                const textExtractor = await PDFNet.TextExtractor.create();
                await textExtractor.begin(page);
                
                // Create a search area to the left of the field
                const searchRect = await PDFNet.Rect.init(
                  Math.max(0, x1 - 200), // Search 200 points to the left
                  y1,
                  x1,
                  y2
                );
                
                const textInArea = await textExtractor.getTextUnderAnnot(annot);
                if (!textInArea || textInArea.trim() === '') {
                  // Try getting text in nearby region
                  nearbyText = await textExtractor.getTextInRect(searchRect);
                  nearbyText = nearbyText ? nearbyText.trim() : null;
                }
              } catch (e) {
                // Text extraction failed, continue without nearby text
              }

              console.log(`Field Name: ${fieldName}`);
              console.log(`Field Value: ${fieldValue}`);
              console.log(`Field Type (Enum ID): ${fieldType}`);
              console.log(`Label (TU): ${label || 'N/A'}`);
              console.log(`Position: x=${position.x}, y=${position.y}`);
              console.log(`Dimensions: width=${dimensions.width}, height=${dimensions.height}`);
              console.log(`Page: ${p}`);
              console.log(`Nearby Text: ${nearbyText || 'N/A'}`);
              console.log('------------------------');

              extractedFields.push({
                name: fieldName,
                value: fieldValue,
                type: this.getFieldTypeName(fieldType),
                typeId: fieldType,
                label: label,
                nearbyText: nearbyText,
                position,
                dimensions,
                page: p
              });
            }
          }
        }
      }

      await doc.unlock();

      console.log(`Extracted ${extractedFields.length} form fields from PDF`);
      return extractedFields;

    } catch (error) {
      console.error('Error extracting form fields:', error);
      throw error;
    }
  }

  /**
   * Convert field type enum to readable string
   * @param {number} fieldType - PDFNet field type enum
   * @returns {string} Human-readable field type
   */
  getFieldTypeName(fieldType) {
    const fieldTypes = {
      0: 'Button',
      1: 'Check',
      2: 'Radio',
      3: 'Text',
      4: 'Choice',
      5: 'Signature',
      6: 'Unknown'
    };
    return fieldTypes[fieldType] || 'Unknown';
  }

  /**
   * Get field value by name
   * @param {string} pdfPath - Path to the PDF file
   * @param {string} fieldName - Name of the field
   * @returns {Promise<string|null>} Field value or null
   */
  async getFieldValue(pdfPath, fieldName) {
    await this.initialize();

    try {
      const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
      await doc.initSecurityHandler();
      await doc.lock();

      const field = await doc.getField(fieldName);
      if (!field) {
        await doc.unlock();
        return null;
      }

      const value = await field.getValueAsString();
      await doc.unlock();

      return value;

    } catch (error) {
      console.error(`Error getting field value for "${fieldName}":`, error);
      throw error;
    }
  }

  /**
   * Set field value by name
   * @param {string} pdfPath - Path to the PDF file
   * @param {string} fieldName - Name of the field
   * @param {string} value - Value to set
   * @param {string} outputPath - Path to save the modified PDF
   * @returns {Promise<void>}
   */
  async setFieldValue(pdfPath, fieldName, value, outputPath) {
    await this.initialize();

    try {
      const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
      await doc.initSecurityHandler();
      await doc.lock();

      const field = await doc.getField(fieldName);
      if (!field) {
        await doc.unlock();
        throw new Error(`Field "${fieldName}" not found`);
      }

      await field.setValueAsString(value);
      await doc.refreshFieldAppearances();

      await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
      await doc.unlock();

      console.log(`Set field "${fieldName}" to "${value}" and saved to ${outputPath}`);

    } catch (error) {
      console.error(`Error setting field value for "${fieldName}":`, error);
      throw error;
    }
  }

  /**
   * Fill multiple fields at once
   * @param {string} pdfPath - Path to the PDF file
   * @param {Object} fieldData - Object with field names as keys and values
   * @param {string} outputPath - Path to save the modified PDF
   * @returns {Promise<void>}
   */
  async fillForm(pdfPath, fieldData, outputPath) {
    await this.initialize();

    try {
      const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
      await doc.initSecurityHandler();
      await doc.lock();

      for (const [fieldName, value] of Object.entries(fieldData)) {
        const field = await doc.getField(fieldName);
        if (field) {
          await field.setValueAsString(String(value));
          console.log(`Set "${fieldName}" = "${value}"`);
        } else {
          console.warn(`Field "${fieldName}" not found in PDF`);
        }
      }

      await doc.refreshFieldAppearances();
      await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
      await doc.unlock();

      console.log(`Filled form and saved to ${outputPath}`);

    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }
  }

  /**
   * Get PDF metadata
   * @param {string} pdfPath - Path to the PDF file
   * @returns {Promise<Object>} PDF metadata
   */
  async getPDFMetadata(pdfPath) {
    await this.initialize();

    try {
      const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
      await doc.initSecurityHandler();
      await doc.lock();

      const pageCount = await doc.getPageCount();
      const info = await doc.getDocInfo();

      const metadata = {
        pageCount,
        title: await info.getTitle(),
        author: await info.getAuthor(),
        subject: await info.getSubject(),
        keywords: await info.getKeywords(),
        creator: await info.getCreator(),
        producer: await info.getProducer()
      };

      await doc.unlock();
      return metadata;

    } catch (error) {
      console.error('Error getting PDF metadata:', error);
      throw error;
    }
  }
}

module.exports = PDFHelper;
