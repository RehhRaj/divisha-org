// Step 4: Utilities (Optional but Future-proof)
// utils/fileUtils.ts
// utils/fileUtils.ts
import type { ParsedFile, ParsedRow, CellValue } from '../types';

export function detectFileType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext && ['csv', 'txt', 'xlsx', 'xls'].includes(ext)) return ext;
  return 'unknown';
}

export function detectHeader(rows: ParsedFile): number {
  if (!rows.length) return -1;

  const firstRow: ParsedRow = rows[0];
  const allStrings = firstRow.every(
    (cell: CellValue) => typeof cell === 'string' && cell.trim() !== ''
  );

  return allStrings ? 0 : -1; // header at row 0, otherwise not detected
}

export function detectDataStart(rows: ParsedFile): number {
  if (!rows.length) return -1;

  return rows.findIndex((row: ParsedRow) =>
    row.some((cell: CellValue) => {
      if (typeof cell === 'number') return true;
      if (typeof cell === 'string') return !isNaN(Number(cell)) && cell.trim() !== '';
      return false;
    })
  );
}
