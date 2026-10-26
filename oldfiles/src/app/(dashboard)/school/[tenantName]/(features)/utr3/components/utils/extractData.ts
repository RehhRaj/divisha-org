// utils/extractData.ts
// your actual data extraction code in this file 

export interface ExtractedData {
  headers: string[];
  data: string[][];
}

/**
 * Simulate extracting rows from a file.
 * In real usage, you would pass in parsed content (CSV/Excel/etc.)
 */
export const extractData = (fileName: string): ExtractedData => {
  // Example: differentiate based on filename (optional)
  if (fileName.toLowerCase().includes('filea')) {
    return {
      headers: ['ID', 'Name', 'Amount', 'Date'],
      data: [
        ['1', 'Alice', '1200', '2025-07-01'],
        ['2', 'Bob', '850', '2025-07-03'],
        ['3', 'Charlie', '450', '2025-07-05'],
      ],
    };
  }


  if (fileName.toLowerCase().includes('fileb')) {
    return {
      headers: ['TxnID', 'User', 'Value', 'Timestamp'],
      data: [
        ['TXN01', 'Alice', '1200', '2025-07-01T08:30:00Z'],
        ['TXN02', 'Bob', '850', '2025-07-03T09:00:00Z'],
        ['TXN03', 'Charlie', '450', '2025-07-05T11:15:00Z'],
      ],
    };
  }

  // Default mock
  return {
    headers: ['Col1', 'Col2', 'Col3'],
    data: [
      ['A1', 'B1', 'C1'],
      ['A2', 'B2', 'C2'],
      ['A3', 'B3', 'C3'],
    ],
  };
};
