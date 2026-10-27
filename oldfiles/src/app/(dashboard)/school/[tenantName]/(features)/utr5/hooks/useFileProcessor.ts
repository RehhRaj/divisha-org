// utr5/hooks/useFileProcessor.ts
import { useState } from 'react';
import type { ParsedFiles } from '../types';

export function useFileProcessor() {

  console.log( "  utr3/hooks/useFileProcessor.ts ")

  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<ParsedFiles>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setFiles((prev) => {
      const newFiles = [...prev, file];
      processFile(file, newFiles.length - 1);
      return newFiles;
    });
  };

  const processFile = (file: File, index: number) => {
    setLoading(true);

    const worker = new Worker(
      new URL('../logic/fileProcessor.worker.ts', import.meta.url)
    );

    worker.postMessage({ file });

    worker.onmessage = (e) => {
      const data = e.data;
      setParsedData((prev) => {
        const newData = [...prev];
        newData[index] = data;
        return newData;
      });
      setLoading(false);
      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error('Worker error:', err);
      setLoading(false);
      worker.terminate();
    };
  };

  return { files, parsedData, loading, handleFileSelect };
}
