// frontend/src/app/(dashboard)/school/[tenantName]/(features)/utr5/components/files-selector.tsx
"use client";

type FileSelectorProps = {
  label: string;
  onFileSelect: (file: File) => void;
};

export default function FileSelector({ label, onFileSelect }: FileSelectorProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mb-4">
      <label >{label}</label>
      <input type="file" onChange={handleChange} className="border p-2" />
    </div>
  );
}
