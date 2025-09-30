// utils/fileHelpers.ts
import * as XLSX from "xlsx";
import { detectHeaderInfo } from "./detectHeader";

type RowData = { [key: string]: string | number | boolean | null };

// ✅ Helper: Get sheet range from '!ref'
function getSheetRange(sheet: XLSX.WorkSheet): XLSX.Range {
  const ref = sheet["!ref"];
  if (!ref) throw new Error("Sheet does not contain a valid range (!ref).");
  return XLSX.utils.decode_range(ref);
}

// 📄 Main function to parse Excel file
export default function fileHelpers(file: File): Promise<RowData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // ✅ Step 1: File is loaded
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        if (!buffer) {
          reject(new Error("File is empty or unreadable."));
          return;
        }

        // ✅ Step 2: Parse workbook from ArrayBuffer
        const workbook = XLSX.read(buffer, { type: "array" });

        // ✅ Step 3: Access first sheet dynamically
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        if (!sheet || !sheet["!ref"]) {
          reject(new Error(`Sheet "${firstSheetName}" not found or invalid.`));
          return;
        }

        // ✅ Step 4: Detect header row count and data start
        const range = getSheetRange(sheet);
        const { singleRecordRowSpan, dataStartRow } = detectHeaderInfo(sheet, range);

        // ✅ Step 5: Extract full sheet as 2D array
        const rawData: (string | number | boolean | null)[][] = [];
        for (let i = range.s.r; i <= range.e.r; i++) {
          const row: (string | number | boolean | null)[] = [];
          for (let j = range.s.c; j <= range.e.c; j++) {
            const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
            const cell = sheet[cellRef];
            row.push(cell ? cell.v : null);
          }
          rawData.push(row);
        }

        // ✅ Step 6: Skip metadata rows (before actual header)
        // UTR example → actual table starts at row 4 ("Sr.No.")
        const cleanedData = rawData.slice(dataStartRow ?? singleRecordRowSpan);

        // ✅ Step 7: Split headers and data
        const headerRows = cleanedData.slice(0, singleRecordRowSpan);
        const dataRows = cleanedData.slice(singleRecordRowSpan);

        // ✅ Step 8: Merge multi-row headers into single row
        const maxCols = Math.max(...headerRows.map((r) => r.length));
        const headers: string[] = [];

        for (let col = 0; col < maxCols; col++) {
          const parts: string[] = [];
          for (let row = 0; row < headerRows.length; row++) {
            const cell = headerRows[row][col];
            if (cell !== null && cell !== "") {
              parts.push(String(cell).trim());
            }
          }
          const merged = parts.join(" ").replace(/\s+/g, " ").trim();
          headers.push(merged || `Column_${col + 1}`);
        }

        // ✅ Step 9: Map data rows to JSON
        const json: RowData[] = dataRows.map((row) => {
          const rowObj: RowData = {};
          headers.forEach((key, i) => {
            rowObj[key] = row[i] ?? null;
          });
          return rowObj;
        });

        resolve(json);
      } catch (error) {
        reject(error);
      }
    };

    // ❌ Step 10: File read error
    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    // ✅ Step 11: Start reading file
    reader.readAsArrayBuffer(file);
  });
}
