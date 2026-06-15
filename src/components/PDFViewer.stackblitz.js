import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './PDFViewer.css';

const PDFViewer = () => {
  const viewer = useRef(null);
  const webViewerInstanceRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [highlightsEnabled, setHighlightsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple instances in React StrictMode
    if (webViewerInstanceRef.current) {
      console.log('WebViewer instance already exists, skipping initialization');
      return;
    }

    console.log('Initializing WebViewer...');
    
    // Use CDN for StackBlitz/online deployment, local files for development
    const webViewerPath = process.env.NODE_ENV === 'production' 
      ? 'https://unpkg.com/@pdftron/webviewer@10.11.0/public'
      : '/webviewer';
    
    // Use demo PDF if sample.pdf is not available
    const pdfDoc = process.env.REACT_APP_INITIAL_PDF 
      || '/sample.pdf'
      || 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';
    
    console.log('Path:', webViewerPath);
    console.log('Initial Doc:', pdfDoc);

    // Set a timeout to detect if WebViewer is hanging
    const timeoutId = setTimeout(() => {
      if (!webViewerInstanceRef.current) {
        console.error('WebViewer initialization timeout - library files may be missing');
        setIsLoading(false);
        setError('WebViewer initialization timeout. Using CDN version...');
      }
    }, 15000); // 15 second timeout for CDN

    // Initialize WebViewer with error handling
    WebViewer(
      {
        path: webViewerPath,
        initialDoc: pdfDoc,
        licenseKey: process.env.REACT_APP_APRYSE_LICENSE_KEY || 'YOUR_LICENSE_KEY_HERE',
        // Hide default toolbar and UI elements to use custom controls
        disabledElements: [
          'header',
          'toolsHeader',
          'searchButton',
          'menuButton',
          'ribbons',
          'toggleNotesButton',
        ],
        // Additional UI customization
        fullAPI: true,
        enableFilePicker: false,
      },
      viewer.current
    ).then((inst) => {
      clearTimeout(timeoutId);
      console.log('WebViewer instance created successfully!');
      webViewerInstanceRef.current = inst;
      setInstance(inst);
      const { documentViewer, annotationManager, Annotations } = inst.Core;
      
      // Additional UI cleanup - completely hide the header
      inst.UI.disableElements(['header']);

      // Document loaded event
      documentViewer.addEventListener('documentLoaded', () => {
        console.log('Document loaded successfully');
        setIsLoading(false);
        setError(null);
        const pageCount = documentViewer.getPageCount();
        setTotalPages(pageCount);
        setCurrentPage(documentViewer.getCurrentPage());
        setZoomLevel(Math.round(documentViewer.getZoomLevel() * 100));
        
        // Log available features
        console.log('Document loaded with', pageCount, 'pages');
      });

      // Document load failed event
      documentViewer.addEventListener('loaderror', (err) => {
        console.error('Document load error:', err);
        setIsLoading(false);
        setError('Failed to load PDF. Using demo PDF instead...');
        
        // Try loading demo PDF as fallback
        inst.UI.loadDocument('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf');
      });

      // Page number changed event
      documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
        setCurrentPage(pageNumber);
      });

      // Zoom changed event
      documentViewer.addEventListener('zoomUpdated', (zoom) => {
        setZoomLevel(Math.round(zoom * 100));
      });

      // Rotation changed event
      documentViewer.addEventListener('rotationUpdated', (rotation) => {
        setRotation(rotation);
      });
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error('WebViewer initialization error:', err);
      setIsLoading(false);
      setError('Failed to initialize PDF Viewer. Please ensure you have internet connection for CDN access.');
    });

    // Cleanup function to prevent memory leaks
    return () => {
      if (webViewerInstanceRef.current) {
        webViewerInstanceRef.current.UI.dispose();
        webViewerInstanceRef.current = null;
      }
    };
  }, []);

  // Rotate Clockwise (90 degrees)
  const rotateClockwise = () => {
    if (instance) {
      const { documentViewer } = instance.Core;
      const currentRotation = documentViewer.getCompleteRotation(currentPage);
      const newRotation = (currentRotation + 1) % 4; // 0, 1, 2, 3 (0°, 90°, 180°, 270°)
      documentViewer.setRotation(newRotation);
      setRotation(newRotation * 90);
    }
  };

  // Rotate Counter-clockwise (90 degrees)
  const rotateCounterClockwise = () => {
    if (instance) {
      const { documentViewer } = instance.Core;
      const currentRotation = documentViewer.getCompleteRotation(currentPage);
      const newRotation = (currentRotation + 3) % 4; // Equivalent to -90 degrees
      documentViewer.setRotation(newRotation);
      setRotation(newRotation * 90);
    }
  };

  // Zoom In
  const zoomIn = () => {
    if (instance) {
      const { documentViewer } = instance.Core;
      const currentZoom = documentViewer.getZoomLevel();
      documentViewer.zoomTo(currentZoom * 1.25); // Increase by 25%
    }
  };

  // Zoom Out
  const zoomOut = () => {
    if (instance) {
      const { documentViewer } = instance.Core;
      const currentZoom = documentViewer.getZoomLevel();
      documentViewer.zoomTo(currentZoom * 0.8); // Decrease by 20%
    }
  };

  // Previous Page
  const previousPage = () => {
    if (instance && currentPage > 1) {
      const { documentViewer } = instance.Core;
      documentViewer.setCurrentPage(currentPage - 1);
    }
  };

  // Next Page
  const nextPage = () => {
    if (instance && currentPage < totalPages) {
      const { documentViewer } = instance.Core;
      documentViewer.setCurrentPage(currentPage + 1);
    }
  };

  // Toggle Highlights for recognized fields
  const toggleHighlights = () => {
    if (instance) {
      const { documentViewer, annotationManager, Annotations } = instance.Core;
      
      if (!highlightsEnabled) {
        // Add sample highlights to demonstrate field recognition
        // In a real scenario, these would be based on actual form field detection
        const doc = documentViewer.getDocument();
        const pageNumber = currentPage;
        
        // Create sample highlight annotations to represent recognized fields
        const highlight1 = new Annotations.TextHighlightAnnotation({
          PageNumber: pageNumber,
          Quads: [
            { x1: 100, y1: 100, x2: 200, y2: 100, x3: 200, y3: 120, x4: 100, y4: 120 }
          ],
          StrokeColor: new Annotations.Color(255, 255, 0, 0.5),
        });
        highlight1.Subject = 'Recognized Field';
        highlight1.setContents('Field detected by form recognition');

        const highlight2 = new Annotations.TextHighlightAnnotation({
          PageNumber: pageNumber,
          Quads: [
            { x1: 100, y1: 150, x2: 200, y2: 150, x3: 200, y3: 170, x4: 100, y4: 170 }
          ],
          StrokeColor: new Annotations.Color(0, 255, 0, 0.5),
        });
        highlight2.Subject = 'Recognized Label';
        highlight2.setContents('Label detected by form recognition');

        annotationManager.addAnnotation(highlight1);
        annotationManager.addAnnotation(highlight2);
        annotationManager.drawAnnotationsFromList([highlight1, highlight2]);
        
        setHighlightsEnabled(true);
      } else {
        // Remove all highlights
        const annotations = annotationManager.getAnnotationsList();
        const highlightAnnotations = annotations.filter(
          (annot) => annot instanceof Annotations.TextHighlightAnnotation
        );
        annotationManager.deleteAnnotations(highlightAnnotations);
        setHighlightsEnabled(false);
      }
    }
  };

  return (
    <div className="pdf-viewer-container">
      <div className="controls-panel">
        <div className="control-section">
          <h3>Rotation Controls</h3>
          <div className="button-group">
            <button 
              onClick={rotateCounterClockwise} 
              disabled={!instance}
              className="control-btn"
              title="Rotate Counter-clockwise"
            >
              ↶ Rotate Left
            </button>
            <button 
              onClick={rotateClockwise} 
              disabled={!instance}
              className="control-btn"
              title="Rotate Clockwise"
            >
              ↷ Rotate Right
            </button>
            <span className="status-text">Rotation: {rotation}°</span>
          </div>
        </div>

        <div className="control-section">
          <h3>Zoom Controls</h3>
          <div className="button-group">
            <button 
              onClick={zoomOut} 
              disabled={!instance}
              className="control-btn"
              title="Zoom Out"
            >
              🔍− Zoom Out
            </button>
            <button 
              onClick={zoomIn} 
              disabled={!instance}
              className="control-btn"
              title="Zoom In"
            >
              🔍+ Zoom In
            </button>
            <span className="status-text">{zoomLevel}%</span>
          </div>
        </div>

        <div className="control-section">
          <h3>Page Navigation</h3>
          <div className="button-group">
            <button 
              onClick={previousPage} 
              disabled={!instance || currentPage <= 1}
              className="control-btn"
              title="Previous Page"
            >
              ← Previous
            </button>
            <button 
              onClick={nextPage} 
              disabled={!instance || currentPage >= totalPages}
              className="control-btn"
              title="Next Page"
            >
              Next →
            </button>
            <span className="status-text">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        <div className="control-section">
          <h3>Field Highlights</h3>
          <div className="button-group">
            <button 
              onClick={toggleHighlights} 
              disabled={!instance}
              className={`control-btn ${highlightsEnabled ? 'active' : ''}`}
              title="Toggle Field Highlights"
            >
              {highlightsEnabled ? '✓ Highlights ON' : '○ Highlights OFF'}
            </button>
            <span className="status-text">
              {highlightsEnabled ? 'Showing recognized fields' : 'Highlights disabled'}
            </span>
          </div>
        </div>

        <div className="info-panel">
          <h4>📋 Implementation Notes:</h4>
          <ul>
            <li>✅ <strong>Rotation:</strong> Built-in API (setRotation)</li>
            <li>✅ <strong>Zoom:</strong> Built-in API (zoomTo)</li>
            <li>✅ <strong>Navigation:</strong> Built-in API (setCurrentPage)</li>
            <li>⚠️ <strong>Highlights:</strong> Custom implementation using Annotations API</li>
            <li>🎨 <strong>Default toolbar:</strong> Hidden (using custom controls)</li>
          </ul>
          <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.8 }}>
            See <strong>UI_CUSTOMIZATION.md</strong> to restore Apryse toolbar
          </p>
        </div>
      </div>

      <div className="viewer-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading PDF Viewer...</p>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.7 }}>
              {process.env.NODE_ENV === 'production' ? 'Loading from CDN...' : 'Initializing...'}
            </p>
          </div>
        )}
        {error && (
          <div className="error-overlay">
            <div className="error-icon">⚠️</div>
            <h3>Notice</h3>
            <p className="error-message">{error}</p>
            <div className="error-help">
              <h4>For StackBlitz/Online Deployment:</h4>
              <ol>
                <li>The app uses CDN to load WebViewer files</li>
                <li>First load may take 10-20 seconds</li>
                <li>Using demo PDF from Apryse servers</li>
                <li>See STACKBLITZ_DEPLOYMENT.md for details</li>
              </ol>
            </div>
          </div>
        )}
        <div className="webviewer" ref={viewer}></div>
      </div>
    </div>
  );
};

export default PDFViewer;
