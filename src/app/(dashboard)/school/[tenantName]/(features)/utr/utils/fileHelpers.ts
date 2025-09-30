
// utils/fileHelpers.ts

type RowData = {
  [key: string]: string | number | null;
};

export default function fileHelpers(file: File, isTwoRowFormat: boolean): Promise<RowData[]> {
  return new Promise((resolve) => {
    const dummyData: RowData[] = [
      { Name: "Alice", Score: 95, Country: "USA" },
      { Name: "Bob", Score: 88, Country: "Canada" },
      { Name: "Charlie", Score: 78, Country: "UK" }
    ];

    // You can log the format flag
    console.log("isTwoRowFormat =", isTwoRowFormat);

    resolve(dummyData);
  });
}
