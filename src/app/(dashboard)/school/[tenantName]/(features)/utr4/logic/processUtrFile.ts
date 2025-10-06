// logic/processUtrFile.ts
import * as XLSX from 'xlsx';

self.onmessage = async (e) => {
  const { files } = e.data;

  const allData = [];

  for (const file of files) {
    const fileData = await readFile(file);
    allData.push(...fileData);
  }

  self.postMessage(allData); // array of arrays
};

function readFile(file: File): Promise<any[][]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // array of arrays
      resolve(json);
    };

    reader.readAsArrayBuffer(file);
  });
}
