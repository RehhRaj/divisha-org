// utr5/logic/parseFile.ts
import * as XLSX from 'xlsx';
import type { ParsedFile, CellValue } from '../types';

/**
 * Parses a file (CSV, TXT, XLSX, XLS) into a 2D array of CellValues.
 * @param file File object selected by the user
 * @returns ParsedFile (array of rows, each row = array of cells)
 */
export async function parseFile(file: File): Promise<ParsedFile> {

  console.log( "  utr5/logic/parseFile.ts ")
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (!fileType) throw new Error('Cannot detect file type');

  // Handle CSV or TXT
  if (fileType === 'csv' || fileType === 'txt') {
    const text = await file.text();
    const rows: ParsedFile = text
      .split(/\r?\n/) // handle both \n and \r\n
      .filter((line) => line.trim() !== '') // skip empty lines
      .map((line) =>
        line.split(',').map((cell) => {
          const trimmed = cell.trim();
          // Try to convert numbers automatically
          const num = Number(trimmed);
          return !isNaN(num) ? num : trimmed;

        }) as CellValue[]
      );
    return rows;
  }

  // Handle Excel files
  if (fileType === 'xlsx' || fileType === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // read the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Converts sheet to array-of-arrays
    const rows: ParsedFile = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // 1 = returns array of arrays
      // raw: tells  “Don’t give me the raw data (e.g. 45901 or 1315.05), give me what the user sees in Excel.”
    //   raw: false, // returns formatted values as string/number  number in  mount in form 1,10,915.00 string
      raw: true, // returns formatted values as string/number   DTE IN number issue
    }) as ParsedFile;

    console.log("type of rows  :---", typeof(rows))
    return rows;
  }

  throw new Error('Unsupported file type: ' + fileType);
}
