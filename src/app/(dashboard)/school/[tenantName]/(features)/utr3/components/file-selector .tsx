
'use client';
import React from 'react';

type FileSelectorProps = {  
  label?: string;    
  onFileSelect:  (file: File) => Promise<void>;  // for promise    onFileSelect :  arrow Function               
};

export default function FileSelector( {label, onFileSelect}:FileSelectorProps){
    
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { 

    const file = e.target.files?.[0];
    if(file){
      console.log(" you hve selected file")
      onFileSelect(file);   // jumping back up into the parent function 'handleFile'  of frontend/src/app/(dashboard)/school/[tenantName]/(features)/utr3/file-process.client.tsx
    }
   }

  
  return (
        <>
        <label>{label} <input type="file"   onChange={handleFileChange}/></label>
    </>
    )    
}