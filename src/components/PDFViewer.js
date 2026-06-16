import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './PDFViewer.css';

const PDFViewer = () => {
  const viewer = useRef(null);
  const webViewerInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple instances in React StrictMode
    if (webViewerInstanceRef.current) {
      console.log('WebViewer instance already exists, skipping initialization');
      return;
    }

    console.log('Initializing WebViewer...');
    
    // Use PUBLIC_URL for GitHub Pages subdirectory support
    const publicUrl = process.env.PUBLIC_URL || '';
    const webViewerPath = `${publicUrl}/webviewer`;
    const pdfDoc = process.env.REACT_APP_INITIAL_PDF || `${publicUrl}/sample.pdf`;
    
    console.log('PUBLIC_URL:', publicUrl);
    console.log('WebViewer Path:', webViewerPath);
    console.log('Initial Doc:', pdfDoc);
    console.log('Full WebViewer URL:', window.location.origin + webViewerPath);

    // Set initialization timeout
    const timeoutId = setTimeout(() => {
      if (!webViewerInstanceRef.current) {
        console.error('WebViewer initialization timeout');
        console.error('Attempted to load from:', window.location.origin + webViewerPath);
        setIsLoading(false);
        setError('Failed to initialize WebViewer. The library files may be missing. Check the browser console for details.');
      }
    }, 30000);

    // Initialize WebViewer with error handling
    WebViewer(
      {
        path: webViewerPath,
        initialDoc: pdfDoc,
        licenseKey: process.env.REACT_APP_APRYSE_LICENSE_KEY || 'YOUR_LICENSE_KEY_HERE',
        fullAPI: true,
        enableFilePicker: false,
        isReadOnly: true,
      },
      viewer.current
    ).then((inst) => {
      clearTimeout(timeoutId);
      console.log('WebViewer instance created successfully!');
      webViewerInstanceRef.current = inst;
      const { documentViewer, annotationManager, Annotations } = inst.Core;
      
      // Enable readonly mode
      inst.UI.disableFeatures([inst.UI.Feature.Annotations]);

      // Define button handler functions
      const rotateClockwise = () => {
        const currentRotation = documentViewer.getCompleteRotation(documentViewer.getCurrentPage());
        const newRotation = (currentRotation + 1) % 4;
        documentViewer.setRotation(newRotation);
      };

      const rotateCounterClockwise = () => {
        const currentRotation = documentViewer.getCompleteRotation(documentViewer.getCurrentPage());
        const newRotation = (currentRotation + 3) % 4;
        documentViewer.setRotation(newRotation);
      };

      const previousPage = () => {
        const current = documentViewer.getCurrentPage();
        if (current > 1) {
          documentViewer.setCurrentPage(current - 1);
        }
      };

      const nextPage = () => {
        const current = documentViewer.getCurrentPage();
        const total = documentViewer.getPageCount();
        if (current < total) {
          documentViewer.setCurrentPage(current + 1);
        }
      };

      const toggleHighlights = () => {
        const currentAnnotations = annotationManager.getAnnotationsList();
        const highlightAnnotations = currentAnnotations.filter(
          (annot) => annot instanceof Annotations.TextHighlightAnnotation
        );
        
        console.log('Toggle called, found highlights:', highlightAnnotations.length);
        
        if (highlightAnnotations.length === 0) {
          // Add sample highlights
          const pageNumber = documentViewer.getCurrentPage();
          const highlight1 = new Annotations.TextHighlightAnnotation({
            PageNumber: pageNumber,
            Quads: [{ x1: 100, y1: 100, x2: 200, y2: 100, x3: 200, y3: 120, x4: 100, y4: 120 }],
            StrokeColor: new Annotations.Color(255, 255, 0, 0.5),
          });
          highlight1.Subject = 'Recognized Field';
          highlight1.setContents('Field detected by form recognition');

          const highlight2 = new Annotations.TextHighlightAnnotation({
            PageNumber: pageNumber,
            Quads: [{ x1: 100, y1: 150, x2: 200, y2: 150, x3: 200, y3: 170, x4: 100, y4: 170 }],
            StrokeColor: new Annotations.Color(0, 255, 0, 0.5),
          });
          highlight2.Subject = 'Recognized Label';
          highlight2.setContents('Label detected by form recognition');

          annotationManager.addAnnotation(highlight1);
          annotationManager.addAnnotation(highlight2);
          annotationManager.redrawAnnotation(highlight1);
          annotationManager.redrawAnnotation(highlight2);
          console.log('Added highlights');
          return true; // Highlights are now visible
        } else {
          // Remove highlights
          console.log('Deleting', highlightAnnotations.length, 'highlights');
          
          // Delete each annotation
          highlightAnnotations.forEach(annot => {
            annotationManager.deleteAnnotation(annot, { imported: false, force: true });
          });
          
          const remaining = annotationManager.getAnnotationsList().filter(a => a instanceof Annotations.TextHighlightAnnotation);
          console.log('Deleted highlights, remaining:', remaining.length);
          return false; // Highlights are now hidden
        }
      };

      // Add custom control buttons to the main toolbar
      inst.UI.setHeaderItems(header => {
        // Get existing items
        const existingItems = header.getItems();
        
        // Find the last zoom-related button index
        let lastZoomIndex = -1;
        existingItems.forEach((item, index) => {
          const element = item.dataElement || '';
          if (element.toLowerCase().includes('zoom')) {
            lastZoomIndex = index;
          }
        });
        
        // Track highlights state
        let highlightsVisible = false;
        let isToggling = false; // Prevent double-clicks
        
        // Create toggle button for highlights
        const toggleHighlightsBtn = {
          type: 'customElement',
          render: () => {
            const button = document.createElement('button');
            button.className = 'Button ActionButton';
            button.setAttribute('data-element', 'toggleHighlightsButton');
            button.title = 'Toggle Field Highlights';
            button.style.cursor = 'pointer';
            
            const updateButtonState = () => {
              button.style.backgroundColor = highlightsVisible ? 'var(--blue-2)' : '';
              button.innerHTML = `<div class="Icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 9.7l-3.6 3.6c-.4.4-.4 1 0 1.4l2 2c.4.4 1 .4 1.4 0l3.6-3.6-3.4-3.4zm3.4 3.4l7.4-7.4 3.4 3.4-7.4 7.4-3.4-3.4zm9.2-9.2c-.4-.4-1-.4-1.4 0l-1.3 1.3 3.4 3.4 1.3-1.3c.4-.4.4-1 0-1.4l-2-2zM3.5 19h17v2h-17z"/></svg></div>`;
            };
            
            updateButtonState();
            
            button.onclick = () => {
              // Prevent double-clicks
              if (isToggling) {
                console.log('Toggle already in progress, ignoring click');
                return;
              }
              
              isToggling = true;
              console.log('Button clicked, current state:', highlightsVisible);
              
              // Call toggleHighlights and get the new state
              highlightsVisible = toggleHighlights();
              updateButtonState();
              
              // Re-enable after a short delay
              setTimeout(() => {
                isToggling = false;
              }, 300);
            };
            
            return button;
          }
        };
        
        // Define custom buttons
        const customButtons = [
          { type: 'divider' },
          // Rotation buttons
          {
            type: 'actionButton',
            img: 'icon-header-page-manipulation-page-rotation-counterclockwise-line',
            onClick: rotateCounterClockwise,
            title: 'Rotate Counter-clockwise',
            dataElement: 'rotateCounterClockwiseButton'
          },
          {
            type: 'actionButton',
            img: 'icon-header-page-manipulation-page-rotation-clockwise-line',
            onClick: rotateClockwise,
            title: 'Rotate Clockwise',
            dataElement: 'rotateClockwiseButton'
          },
          { type: 'divider' },
          // Page navigation buttons
          {
            type: 'actionButton',
            img: 'icon-chevron-left',
            onClick: previousPage,
            title: 'Previous Page',
            dataElement: 'previousPageButton'
          },
          {
            type: 'actionButton',
            img: 'icon-chevron-right',
            onClick: nextPage,
            title: 'Next Page',
            dataElement: 'nextPageButton'
          },
          { type: 'divider' },
          // Toggle highlights button
          toggleHighlightsBtn
        ];
        
        // Insert custom buttons after zoom controls
        if (lastZoomIndex >= 0) {
          const newItems = [
            ...existingItems.slice(0, lastZoomIndex + 1),
            ...customButtons,
            ...existingItems.slice(lastZoomIndex + 1)
          ];
          header.update(newItems);
        } else {
          // If no zoom buttons found, append to the end
          header.update([...existingItems, ...customButtons]);
        }
      });

      // Disable mode selection dropdown and other UI elements
      inst.UI.disableElements([
        'viewControlsButton',
        'toolsHeader',
        'viewControlsOverlay'
      ]);

      // Document loaded event
      documentViewer.addEventListener('documentLoaded', () => {
        console.log('Document loaded successfully');
        setIsLoading(false);
        setError(null);
        const pageCount = documentViewer.getPageCount();
        
        // Log available features
        console.log('Document loaded with', pageCount, 'pages');
      });

      // Document load failed event
      documentViewer.addEventListener('loaderror', (err) => {
        console.error('Document load error:', err);
        console.log('Attempting to load demo PDF...');
        
        // Try loading demo PDF as fallback
        const demoPDF = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';
        inst.UI.loadDocument(demoPDF);
      });
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error('WebViewer initialization error:', err);
      console.error('Error details:', err.message || err);
      setIsLoading(false);
      setError(`Failed to initialize WebViewer: ${err.message || 'Unknown error'}. Please refresh the page or check your internet connection.`);
    });

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewerInstanceRef.current) {
        webViewerInstanceRef.current.UI.dispose();
        webViewerInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="pdf-viewer-container">
      <div className="viewer-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading PDF Viewer...</p>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.7 }}>
              Initializing WebViewer. First load may take a few moments...
            </p>
          </div>
        )}
        {error && (
          <div className="error-overlay">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading PDF Viewer</h3>
            <p className="error-message">{error}</p>
            <div className="error-help">
              <h4>Quick Setup Guide:</h4>
              <ol>
                <li>Ensure you've run: <code>npm install</code></li>
                <li>Copy WebViewer library: <code>npm run postinstall</code></li>
                <li>Add a PDF file named <code>sample.pdf</code> to the <code>public/</code> folder</li>
                <li>Refresh the page</li>
              </ol>
              <p>See <strong>README.md</strong> for detailed instructions.</p>
            </div>
          </div>
        )}
        <div className="webviewer" ref={viewer}></div>
      </div>
    </div>
  );
};

export default PDFViewer;
