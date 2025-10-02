// file UtrClientPage.tsx    :frontend/src/app/(dashboard)/school/[tenantName]/(features)/utr/UtrClientPage.tsx

'use client';

import React, { useState } from 'react';
import fileHelpers from  './utils/fileHelpers';

export const revalidate = 0; // disable ISR caching


function UtrClientPage() {

  // 📦 STATE SETUP
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // uploaded file
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);     // to disable input 
  const [submitted, setSubmitted] = useState(false); // to show confirmation after export
  const [fileDataResult, setFileDataResult] = useState<(string | number | boolean | Date | null)[][]>([]); 

/* 
✅ Array of objects (most readable, scalable):
const [fileDataResult, setFileDataResult] = useState<RowData[]>([]);
type RowData = {
  [key: string]: string | number | null;
};
[  { name: "Alice", age: 30 },     { name: "Bob", age: 25 },  { id: 1, value: "hello", balance: 2000 }   ]
Type safety — if you try to use a field that doesn’t exist, TypeScript will warn you.


✅ 2D array, only if structure is fixed (like a CSV file):
const [data, setData] = useState<(string | number | null)[][]>([]);


❌ Avoid any[][][] unless you're intentionally working with deeply nested data.
*/  // const [fileDataResult, setFileDataResult] = useState< any[][][] >([]); // 3-dimensional array  [ [ [1, 2, 3],[s, b, g]  ] ],



  

  // 📁 HANDLE FILE UPLOAD
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    // ⏱️ Set new file and reset related state
    setSelectedFile(file);
    setFileUploaded(true);    
    setSubmitted(false);          // clear submission status
  };

  // 📤 HANDLE EXPORT BUTTON CLICK
  const handleExportReport = async () => {
    
    if (!selectedFile) {
      alert('Please upload a file first.'); 
      return;
    }

   

    // ✅ Call fileHelpers only after valid input
   
try {
    
  const result = await fileHelpers(selectedFile);

   // Optionally: you can use this result in your UI if needed

    setFileDataResult(result)
   

  } catch (error) {
    console.error('Error processing file:', error);
    alert('An error occurred while processing the file.');
  }

  // activate 2nd file upload btn


    setSubmitted(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Client Component (CSR) - UTR Input</h1>

      {/* 📁 FILE INPUT FIELD */}
    
        <div>
      {/* Hidden native input */}
      <input
        id="fileUpload"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom label acts as the button */}
      <label
        htmlFor="fileUpload"
        className="cursor-pointer px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
       Choose & upload  compact  file
      </label>

      {/* Show custom message or file name */}
      <span className="ml-3 text-gray-700">{selectedFile?.name}</span>
    </div>

    

     
       


      {selectedFile && (
        <>
        <p className="mt-4 text-red-600">
          Uploaded File: <strong>{selectedFile.name}</strong>
        </p>
         
      <button
        onClick={handleExportReport}
        
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Export Report
      </button>
      </>
      )}

      {/* ✅ SUCCESS MESSAGE AFTER EXPORT */}
      {submitted && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">
            ✅ File and format submitted! You selected{' '}
            format.
          </p>
<input
        id="fileUpload"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
       
        
      />

        </div>
      )}

      {/* 🔍 PLACEHOLDER FOR REPORT DATA */}
      <div className="mt-6">
        <h2 className="text-md font-semibold">Report file data</h2>
        {/* You can show extracted data here if fileHelpers returns any 
        */}
  
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
