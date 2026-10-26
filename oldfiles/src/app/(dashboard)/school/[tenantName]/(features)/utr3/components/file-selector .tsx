
// file  :- frontend/src/app/(dashboard)/school/[tenantName]/(features)/utr3/components/file-selector .tsx
'use client';
import React from 'react';

type FileSelectorProps = {
  label?: string;
  onFileSelect: (file: File) => Promise<void>;
};

export default function FileSelector({ label, onFileSelect }: FileSelectorProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <label>
      {label}
      <input type="file" onChange={handleFileChange} />
    </label>
  );
}
