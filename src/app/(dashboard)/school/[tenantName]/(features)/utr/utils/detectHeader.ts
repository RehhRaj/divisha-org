import * as XLSX from 'xlsx';

// For TypeScript / Next.js
// import * as XLSX from "xlsx/dist/xlsx.full.min.js";


/**
 * Detects data split in  how many rows exist and where data starts,
 * using heuristic logic without relying on known keywords.
 */
export function detectHeaderInfo(
  sheet: XLSX.WorkSheet,
  range: XLSX.Range
): { singleRecordRowSpan: number; dataStartRow: number } {
  const MAX_SCAN_ROWS = 20;

  // Helper function to safely get cell values
  const getCellValue = (r: number, c: number): number | null => {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    const val = sheet[cellRef]?.v;
    return typeof val === 'number' ? val : Number(val) || null;
  };

  for (let i = range.s.r; i <= range.s.r + MAX_SCAN_ROWS; i++) {
    for (let j = range.s.c; j <= range.e.c; j++) {
      const val0 = getCellValue(i + 0, j);
      const val1 = getCellValue(i + 1, j);
      const val2 = getCellValue(i + 2, j);
      const val3 = getCellValue(i + 3, j);
      const val4 = getCellValue(i + 4, j);
      const val5 = getCellValue(i + 5, j);

      // Skip if any value is null or not a number
      if (
        val0 === null || val1 === null || val2 === null ||
        val3 === null || val4 === null || val5 === null
      ) {
        continue;
      }

      // Sequence detection logic
      const cond1 = val0 === val1 - 1 && val1 === val2 - 1;
      const cond2 = val0 === val2 - 1 && val2 === val4 - 1;
      const cond3 = val0 === val3 - 1 && val3 === val5 - 1;

     

      if (cond1 || cond2 || cond3) {
        console.log(cond1, cond2, cond3)
        const dataStartRow = i;

        let singleRecordRowSpan = 0;

if (cond1) {
  singleRecordRowSpan = 1;
} else if (cond2) {
  singleRecordRowSpan = 2;
} else if (cond3) {
  singleRecordRowSpan = 3;
}


        console.log("✅ Detected data start row:", dataStartRow,   "    heder row  count  ", singleRecordRowSpan , "   nd  coloumn is " ,j);
// Now you can return it or use it:

return { singleRecordRowSpan, dataStartRow };

        
      
      }
    }
  }

  // If no sequence found
  throw new Error("❌ Unable to detect header and data rows.");
}
