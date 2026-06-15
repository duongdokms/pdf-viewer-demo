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
    
    // Always use local files - avoids cross-domain issues
    // For StackBlitz: make sure public/webviewer/ is committed to your repo
    const webViewerPath = '/webviewer';
    
    // Use demo PDF if on StackBlitz/online IDE (sample.pdf might not be committed)
    const isOnlineIDE = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' &&
                        !window.location.hostname.startsWith('192.168.');
    
    const pdfDoc = process.env.REACT_APP_INITIAL_PDF 
      || (isOnlineIDE ? 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf' : '/sample.pdf');
    
    console.log('Environment:', isOnlineIDE ? 'Online IDE' : 'Localhost');
    console.log('WebViewer Path:', webViewerPath);
    console.log('Initial Doc:', pdfDoc);
    console.log('Checking WebViewer files at:', window.location.origin + webViewerPath);

    // Set a timeout - longer for online IDEs (first load can be slow)
    const timeoutMs = isOnlineIDE ? 45000 : 15000;
    console.log('Timeout set to:', timeoutMs / 1000, 'seconds');
    
    const timeoutId = setTimeout(() => {
      if (!webViewerInstanceRef.current) {
        console.error('WebViewer initialization timeout after', timeoutMs / 1000, 'seconds');
        console.error('Check that', window.location.origin + webViewerPath + '/core', 'is accessible');
        setIsLoading(false);
        setError(`WebViewer failed to load after ${timeoutMs / 1000} seconds. The library files may be missing or the server is slow. Try refreshing the page.`);
      }
    }, timeoutMs);

    // Initialize WebViewer with error handling
    WebViewer(
      {
        path: webViewerPath,
        initialDoc: pdfDoc,
        licenseKey: process.env.REACT_APP_APRYSE_LICENSE_KEY || 'YOUR_LICENSE_KEY_HERE',
        // Hide default toolbar and UI elements to use custom controls
        // disabledElements: [
        //   'header',
        //   'toolsHeader',
        //   'searchButton',
        //   'menuButton',
        //   'ribbons',
        //   'toggleNotesButton',
        // ],
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
      // inst.UI.disableElements(['header']); // Commented out to show toolbar

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
        console.log('Attempting to load demo PDF...');
        
        // Try loading demo PDF as fallback
        const demoPDF = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';
        inst.UI.loadDocument(demoPDF);
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
            <li>🎨 <strong>Default toolbar:</strong> Visible (Apryse toolbar shown)</li>
          </ul>
          <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.8 }}>
            See <strong>UI_CUSTOMIZATION.md</strong> for hiding toolbar options
          </p>
        </div>
      </div>

      <div className="viewer-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading PDF Viewer...</p>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.7 }}>
              {window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
                ? 'First load on StackBlitz may take 30-45 seconds. Please be patient...'
                : 'Initializing WebViewer. First load may take a few moments...'}
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
