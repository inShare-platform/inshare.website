import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker for Vite with compatible version
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
} catch (error) {
  // Use a stable CDN version that's compatible with most react-pdf versions
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

interface PdfViewerProps {
  file?: string;
  className?: string;
}

const Pdfviewer: React.FC<PdfViewerProps> = ({ 
  file = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
  className = "" 
}) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setError('Failed to load PDF document');
    setLoading(false);
    console.error('PDF load error:', error);
  }, []);

  const onDocumentLoadProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
    if (total > 0) {
      setLoading(true);
    }
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages || 1, prev + 1));
  }, [numPages]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(3.0, prev + 0.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const containerStyle: React.CSSProperties = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const pageInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '500',
  };

  const zoomControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const pageInputStyle: React.CSSProperties = {
    width: '60px',
    padding: '4px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '14px',
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Navigation Controls */}
      <div style={controlsStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            style={pageNumber <= 1 ? disabledButtonStyle : buttonStyle}
          >
            Previous
          </button>
          
          <div style={pageInfoStyle}>
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              style={pageInputStyle}
            />
            <span>of {numPages || '?'}</span>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            style={pageNumber >= (numPages || 1) ? disabledButtonStyle : buttonStyle}
          >
            Next
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={zoomControlsStyle}>
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            style={scale <= 0.5 ? disabledButtonStyle : buttonStyle}
          >
            Zoom Out
          </button>
          
          <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            disabled={scale >= 3.0}
            style={scale >= 3.0 ? disabledButtonStyle : buttonStyle}
          >
            Zoom In
          </button>
          
          <button
            onClick={resetZoom}
            style={buttonStyle}
          >
            Reset
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        {error && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            padding: '40px',
            fontSize: '16px'
          }}>
            {error}
            <br />
            <small>Check console for more details</small>
          </div>
        )}
        
        {loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading PDF...
          </div>
        )}
        
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onLoadProgress={onDocumentLoadProgress}
          loading={
            <div style={{ textAlign: 'center', padding: '40px' }}>
              Loading document...
            </div>
          }
          error={
            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
              Failed to load PDF
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading page...
              </div>
            }
          />
        </Document>
      </div>

      {/* Page count display */}
      {numPages && (
        <div style={{ 
          marginTop: '15px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          Total Pages: {numPages}
        </div>
      )}
    </div>
  );
};

export default Pdfviewer;
