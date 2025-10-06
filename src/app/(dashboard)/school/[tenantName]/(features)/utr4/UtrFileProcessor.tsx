"use client";

import React, { useState, useEffect } from "react";

import FileSelector from "./components/files-selector";
import { useFileUploader } from "./hooks/useFileUploader";

export default function UtrFileProcessor() {
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelection = useFileUploader((files) => {
    setSelectedFiles(files);
  });

  
  useEffect(() => {
    if (selectedFiles.length === 0) return;

    setLoading(true);

    const worker = new Worker(
      new URL("./logic/processUtrFile.worker.ts", import.meta.url)
    );

    worker.postMessage({ files: selectedFiles });

    worker.onmessage = (event: MessageEvent<string[][]>) => {
      setParsedData(event.data);
      setLoading(false);
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, [selectedFiles]);

  return (
    <div>
      <h2>Upload UTR File</h2>

      <FileSelector label="Choose file" onFileSelect={handleFileSelection} />

      {loading && <p>Processing file...</p>}

      {parsedData.length > 0 && (
        <div>
          <h3>Preview (first 5 rows):</h3>
          <table>
            <tbody>
              {parsedData.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
