"use client";

export function useFileUploader(
  onValidFiles: (files: File[]) => void
) {
  return (file: File) => {
    // ✅ Wrap single file into array
    if (file) {
      onValidFiles([file]);
    }
  };
}
