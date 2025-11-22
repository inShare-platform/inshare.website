import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PdfViewer() {
  const defaultLayout = defaultLayoutPlugin();
  const searchPluginInstance = searchPlugin({
    enableShortcuts:true,
    keyword: [{
      keyword: 'Angular',
      matchCase: true,
      wholeWords: true,
    }]
    
  });

  return (
    <div style={{ height: "100vh" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl="/angular_mastery_roadmap.pdf"
          plugins={[defaultLayout, searchPluginInstance]}
        />
      </Worker>
    </div>
  );
}
