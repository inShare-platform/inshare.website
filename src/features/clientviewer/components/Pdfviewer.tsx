import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use the worker version that matches react-pdf's bundled pdfjs version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfviewerProps {
  fileUrl?: string;
}

const Pdfviewer = ({ fileUrl }: PdfviewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use the provided URL or fall back to the local file
  const pdfUrl = fileUrl || '/angular_mastery_roadmap.pdf';

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
    console.log('document is loaded, total pages:', numPages);
  }

  function onDocumentLoadError(error: Error) {
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
    console.error('PDF load error:', error);
  }

  return (
    <div style={{ padding: '20px' }}>
      {loading && <p>Loading PDF...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <Document 
        file={pdfUrl} 
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div>Loading PDF document...</div>}
      >
        <Page 
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      
      {numPages && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button 
            disabled={pageNumber <= 1} 
            onClick={() => setPageNumber(pageNumber - 1)}
            style={{ padding: '8px 16px', marginRight: '10px' }}
          >
            Previous
          </button>
          <button 
            disabled={pageNumber >= numPages} 
            onClick={() => setPageNumber(pageNumber + 1)}
            style={{ padding: '8px 16px' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Pdfviewer
