// utils/fileHelpers.ts
import * as XLSX from "xlsx";
import { detectHeaderInfo } from "./detectHeader";


// ✅ Helper: Get sheet range from '!ref'
function getSheetRange(sheet: XLSX.WorkSheet): XLSX.Range {
  const ref = sheet["!ref"];
  if (!ref) throw new Error("Sheet does not contain a valid range (!ref).");
  return XLSX.utils.decode_range(ref);
}

// 📄 Main function to parse Excel file
export default function fileHelpers(file: File): Promise<(string | number | boolean | Date | null)[][]> {

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

        // ✅ Step 3: Access first sheet Name dynamically
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        if (!sheet || !sheet["!ref"]) {
          reject(new Error(`Sheet "${firstSheetName}" not found or invalid.`));
          return;
        }

        // ✅ Step 4: Detect header row count and data start
        const range = getSheetRange(sheet);
        const { singleRecordRowSpan, dataStartRow } = detectHeaderInfo(sheet, range);




        // ✅ Step 5 --first prt  : Extract heder / coloumn list as 2D array






        // ✅ Step 5   -- second prt : Extract full sheet as 2D array
        const fullFileRawData: (string | number | boolean | Date | null)[][] = [];

        for (let i = range.s.r; i <= range.e.r; i++) {
          const row: (string | number | boolean | Date | null)[] = [];

          for (let j = range.s.c; j <= range.e.c; j++) {

            const cellRef = XLSX.utils.encode_cell({ r: i, c: j });

            const cell = sheet[cellRef];

            const cellValue = (() => {
              if (!cell) return "";
              switch (cell.t) {
                case "s": // string
                case "str":
                  return cell.v as string;
                case "n": // number
                  return cell.v as number;
                case "b": // boolean
                  return cell.v ? true : false;
                case "d": // date
                  return new Date(cell.v as string | number);
                default:
                  return "";
              }
            })();






            row.push(cellValue);
          }
          fullFileRawData.push(row);
        }


        // console.log(' rawData   ' , rawData)

        // ✅ Step 6: Skip metadata rows (before actual header)


        const cleanedRowData = fullFileRawData.slice(dataStartRow ?? singleRecordRowSpan); //slice shllow copy nullish coalescing operator (??)  dataStartRow if it's not null or undefined, otherwise use singleRecordRowSpan
        const cleanedHeadersData = fullFileRawData.slice(dataStartRow - 3, singleRecordRowSpan); //slice shllow copy nullish coalescing operator (??)  dataStartRow if it's not null or undefined, otherwise use singleRecordRowSpan



        // console.log('dataStartRow   = ' , dataStartRow , "      singleRecordRowSpan    = " , singleRecordRowSpan)

        // ✅ Step 7: Split headers and data



        const result: (string | number | boolean | Date | null)[][] = [];
        for (let row = 0; row < cleanedRowData.length; row += singleRecordRowSpan) {

          const dt: (string | number | boolean | Date | null)[] = [];
          const rowLength = cleanedRowData[row].length

          for (let col = 0; col < rowLength; col++) {

            const d0 = cleanedRowData[row]?.[col] ?? "";
            // const d1 = cleanedRowData[row+1]??[col] ?? null; // safe access + fallback
            // const d1 = cleanedRowData[row + 1]?.[col] ?? "";
            const d1 = (row + 1 < cleanedRowData.length) ? (cleanedRowData[row + 1]?.[col] ?? "") : "" ; // if lst row out of rnge


            dt.push(d0)
            dt.push(d1)
          }
          result.push(dt);

        }
        console.log("   filehelper . ts file   result ", result)

        // after building `result`
        console.log("filehelper.ts file result", result);
        resolve(result);  // <-- resolve the Promise with the result

        return;  // stop execution here




        // ✅ Step 8: Merge multi-row headers into single row

//         const mergedHeaders: string[] = [];
// for (let col = 0; col < fullFileRawData[0].length; col++) {
//   let header = "";
//   for (let r = headerStart; r < singleRecordRowSpan; r++) {
//     const part = fullFileRawData[r]?.[col] ?? "";
//     if (part) header = header ? `${header} ${part}` : part;
//   }
//   mergedHeaders.push(header.trim());
// }




        // ✅ Step 9: dataRows   into  json  Map data rows to JSON



      } catch (error) {
        reject(error instanceof Error ? error : new Error("Unknown error occurred while parsing the Excel file."));
      }

    }

    // ❌ Step 10: File read error
    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    }


    // ✅ Step 11: Start reading file
    reader.readAsArrayBuffer(file);
  });
}
