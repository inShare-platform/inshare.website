import Pdfviewer from "./components/Pdfviewer"

const ClientViewerLayout = () => {
  const pdfUrl = "https://public.958fc1aab9fd90435f616b39dd67920a.r2.cloudflarestorage.com/1763792950002-83n2vx-html_tags_cheatsheet.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=a37781e2c0fc8afd2af94ffd74df45eb%2F20251122%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20251122T075545Z&X-Amz-Expires=3600&X-Amz-Signature=63c8bd903d8f19eb935cee347a689b2b1302b9876e63502f26eb59df48d47dee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
  
  return (
    <div>
      <Pdfviewer fileUrl={pdfUrl} />
    </div>
  )
}

export default ClientViewerLayout
