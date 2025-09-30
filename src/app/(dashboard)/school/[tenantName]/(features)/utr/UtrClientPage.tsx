'use client';

import React, { useState } from 'react';
import fileHelpers from  './utils/fileHelpers';

export const revalidate = 0; // disable ISR caching


function UtrClientPage() {

  // 📦 STATE SETUP
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // uploaded file
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);     // to disable input
  const [isTwoRowFormatData, setIsTwoRowFormatData] = useState<boolean | null>(null); // format choice: true/false/null
  const [submitted, setSubmitted] = useState(false); // to show confirmation after export

  type RowData = {
  [key: string]: string | number | null; // or more specific
};

const [fileDataResult, setFileDataResult] = useState<RowData[]>([]); // any[]  vs typeDeclred[] lose autocompletion and error checking.

  // 📁 HANDLE FILE UPLOAD
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    // ⏱️ Set new file and reset related state
    setSelectedFile(file);
    setFileUploaded(true);
    setIsTwoRowFormatData(null);  // reset format choice
    setSubmitted(false);          // clear submission status
  };

  // 📤 HANDLE EXPORT BUTTON CLICK
  const handleExportReport = async () => {
    
    if (!selectedFile) {
      alert('Please upload a file first.'); 
      return;
    }

    if (isTwoRowFormatData === null) {
      alert('Please select whether the file is in single row or two row format.');
      return;
    }

    // ✅ Call fileHelpers only after valid input
    // fileHelpers(selectedFile, isTwoRowFormatData);

try {
    // ✅ Await the fileHelpers function
    // const result = await fileHelpers(selectedFile, isTwoRowFormatData);
    const result = await fileHelpers(selectedFile);
    console.log('fileHelpers returned:', result); // will log 9

    // Optionally: you can use this result in your UI if needed

    // setFileDataResult(result)

    setSubmitted(true);
  } catch (error) {
    console.error('Error processing file:', error);
    alert('An error occurred while processing the file.');
  }



    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Client Component (CSR) - UTR Input</h1>

      {/* 📁 FILE INPUT FIELD */}
      <input
        id="fileUpload"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        disabled={fileUploaded} // disable after upload
        className={`mb-6 block ${
          fileUploaded ? 'bg-green-500 text-black' : 'bg-yellow-500 text-white'
        }`}
      />

      {/* ✅ SHOW FORMAT OPTIONS AFTER FILE UPLOAD */}
      {fileUploaded && (
        <div className="mb-6">
          <p className="font-medium">Is the file result format in a single row format?</p>

          {/* ☑️ RADIO FOR SINGLE ROW (false) */}
          <label className="mr-4">
            <input
              type="radio"
              name="format"
              value="false"
              checked={isTwoRowFormatData === false}
              onChange={() => setIsTwoRowFormatData(false)}
            />{' '}
            Yes (Single Row)
          </label>

          {/* ☑️ RADIO FOR TWO ROW (true) */}
          <label>
            <input
              type="radio"
              name="format"
              value="true"
              checked={isTwoRowFormatData === true}
              onChange={() => setIsTwoRowFormatData(true)}
            />{' '}
            No (Two Row Format   commit 14)
          </label>
        </div>
      )}

      {/* 📤 EXPORT BUTTON */}
      <button
        onClick={handleExportReport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Export Report
      </button>

      {/* 📋 FILE NAME DISPLAY */}
      {selectedFile && (
        <p className="mt-4 text-red-600">
          Uploaded File: <strong>{selectedFile.name}</strong>
        </p>
      )}

      {/* ✅ SUCCESS MESSAGE AFTER EXPORT */}
      {submitted && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">
            ✅ File and format submitted! You selected{' '}
            <strong>{isTwoRowFormatData ? 'Two Row' : 'Single Row'}</strong> format.
          </p>
        </div>
      )}

      {/* 🔍 PLACEHOLDER FOR REPORT DATA */}
      <div className="mt-6">
        <h2 className="text-md font-semibold">Report file data</h2>
        {/* You can show extracted data here if fileHelpers returns any */}
        {fileDataResult.length > 0 && (
  <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-x-auto">
    {JSON.stringify(fileDataResult, null, 2)}
  </pre>
)}

        
      </div>
    </div>
  );
}

export default UtrClientPage;
