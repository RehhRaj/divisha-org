// utr5/types.ts

console.log("utr5/types.ts")


// Represents a single cell in a parsed file
export type CellValue = string | number | boolean | null;

// A single file's parsed data (rows × columns)
export type ParsedFile = CellValue[][];

// Multiple files
export type ParsedFiles = ParsedFile[];


// A row = array of cells
export type ParsedRow = CellValue[];



