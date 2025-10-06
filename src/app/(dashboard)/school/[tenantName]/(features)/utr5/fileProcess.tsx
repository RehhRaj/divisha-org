// utr5/filePprocess.tsx


'use client';
import FileSelector from './components/files-selector';
import { useFileProcessor } from './hooks/useFileProcessor';

export default function FileUploadFlow() {

  console.log("utr5/filePprocess.tsx")
  
  const { files, parsedData, loading, handleFileSelect } = useFileProcessor();

  return (
    <div>
      <FileSelector label="Upload File A" onFileSelect={handleFileSelect} />
      {files.length > 0 && (
        <FileSelector label="Upload File B" onFileSelect={handleFileSelect} />
      )}
      {loading && <p>Processing...</p>}
      {parsedData.length > 0 && (
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      )}
    </div>
  );
}
