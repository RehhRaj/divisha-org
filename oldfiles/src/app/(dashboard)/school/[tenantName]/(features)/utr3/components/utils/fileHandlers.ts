import { detectFileType } from './detectFileType';
import { ParsedFileData } from './types';



import { extractData } from './extractData';




export const FileHandlers = async (file: File): Promise<ParsedFileData | null> => {
  // if (!file) return null;



  const type = detectFileType(file.name);


  if (!["xlsx", "xls"].includes(type)) return null; // if (type !== "xlsx" && type !== "xls")   return null; 








  /*  await file.text()
  const text = await file.text();//✅ file.text() is a built-in method provided by the File API in the browser. It's used to read the contents of a file as plain text — for example, when you upload a .csv, .txt, or even .json file using an <input type="file" />
*/
  const fileName = file.name;
  console.log(fileName)
  const { headers, data } = extractData(fileName); // ← Using mock

  console.log(headers, data)
  return {
    fileName,
    type: 'mock',
    headers,
    data,
  };

  // it returns proper dt 
};
