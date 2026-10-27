'use client';

import React, { useState } from 'react';

import FileSelector from './components/file-selector';


import UploadProgressBar from './components/upload-progress-bar';
import UploadCompleteMessage from './components/upload-complete-message';
import ReportTable from './components/report';
import ExportReportButton from './components/export-button';

import { processFileUpload } from './components/utils/process-file-upload';
import { parseCompactFile, parseUTRFile } from './components/utils/parsers';




export default function FileUploadFlow() {
  // State to manage progress & completion for both files
  const [compactUploading, setCompactUploading] = useState(false);
  const [compactUploaded, setCompactUploaded] = useState(false);
  const [utrUploading, setUtrUploading] = useState(false);
  const [utrUploaded, setUtrUploaded] = useState(false);

  // You might also have a state here for the parsed data for ReportTable

  // Handler for compact file upload
  const handleFileCompact = async (file: File): Promise<void> => {      
    try {
      setCompactUploading(true);   
      // setCompactUploaded(false);

      await processFileUpload(file, 'Compact', parseCompactFile);

      console.log(" file red   ")

      setCompactUploaded(false);
    } catch (error) {
      console.error('Error uploading Compact file:', error);
      setCompactUploaded(false);
      // optionally show error to user here
    } finally {
      setCompactUploading(false);
    }


  };

  // Handler for UTR file upload
  const handleFileUTR = async (file: File): Promise<void> => {
    
    // try {
    //   setUtrUploading(true);
    //   setUtrUploaded(false);

    //   await processFileUpload(file, 'UTR', parseUTRFile);

    //   setUtrUploaded(true);
    // } catch (error) {
    //   console.error('Error uploading UTR file:', error);
    //   setUtrUploaded(false);
    //   // optionally show error to user here
    // } finally {
    //   setUtrUploading(false);
    // }

  };

  return (
    <div>
      <h1>Excel Upload Report</h1>

      {/* Compact file upload */}
      <FileSelector label="Upload comp file :   " onFileSelect={handleFileCompact} />
      
      
      
      {/* <UploadProgressBar isUploading={true} /> */}
      <UploadProgressBar isUploading={compactUploading} />
      {/* {compactUploaded && <UploadCompleteMessage fileType="Compact" />} */}

      {/* UTR file upload */}
      <FileSelector label="Upload UTR file :    " onFileSelect={handleFileUTR} />
      {/* <UploadProgressBar isUploading={utrUploading} /> */}
      {/* {utrUploaded && <UploadCompleteMessage fileType="UTR" />} */}

      {/* Results and actions */}
      {/* <ReportTable /> */}
      {/* <ExportReportButton /> */}
    </div>
  );
}
