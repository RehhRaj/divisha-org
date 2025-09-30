
// utils/fileHelpers.ts


import { format } from 'path';
import * as XLSX from 'xlsx';
type RowData = {
  [key: string]: string | number | null;
};

export default function fileHelpers(file: File, isTwoRowFormat: boolean): Promise<RowData[]> {

  
  // return new Promise((resolve) => {
 return new Promise((resolve, reject) => {
// reader    object


 const reader = new FileReader();

 // Fired as the file starts to load
 reader.onprogress = (event) =>{console.log("hi")}

 // Fired when the file is successfully read
reader.onload = (event) => { console.log("hi")}

// Fired when the file is successfully read
reader.onload = (event) => {  console.log("hi")}


// Fired if an error occurs during reading
reader.onerror = (event) => {console.log("hi")}

// Fired when reading ends (success or error)
reader.onloadend = () => {console.log("hi") }



    
   
const dummyDt = [
  {
    "Name": "Alice",
    "Email": "alice@example.com",
    "Age": 28,
    "Country": "USA"
  },
  {
    "Name": "Bob",
    "Email": "bob@example.com",
    "Age": 34,
    "Country": "UK"
  },
  {
    "Name": "Charlie",
    "Email": "charlie@example.com",
    "Age": 25,
    "Country": "Canada"
  },
  {
    "Name": "Diana",
    "Email": "diana@example.com",
    "Age": 30,
    "Country": "Australia"
  }
];

    resolve(dummyDt);
  });
}
