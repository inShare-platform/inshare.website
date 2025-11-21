import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';


  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();


const Pdfviewer = () => {

  const [pageNumber , setPageNumber] = useState()


  function onDocumentLoadSuccess(data:any) {
    console.log('document is loaded :' , data)
  }

  return (
    <div>
      <Document file={`/angular_mastery_roadmap.pdf`} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  )
}

export default Pdfviewer