// frontend/src/app/(dashboard)/school/[tenantName]/(features)/utr2/components/utils/process-file-upload.ts
export async function processFileUpload(
  file: File,
  label: string,
  customParser: (content: string) => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const contents = reader.result as string;
        console.log(`${label} file contents:`, contents);

        // Call the specific parser logic
        await customParser(contents);

        resolve();
      } catch (err) {
        console.error(`Error processing ${label} file:`, err);
        reject(err);
      }
    };

    reader.onerror = () => {
      console.error(`FileReader error for ${label}:`, reader.error);
      reject(reader.error);
    };

    reader.readAsArrayBuffer (file); // or .readAsText / .readAsArrayBuffer / .readAsBinaryString if needed
  });
}
