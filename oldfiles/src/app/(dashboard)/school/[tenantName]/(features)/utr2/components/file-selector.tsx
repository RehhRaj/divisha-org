// export default function FileSelector() {
//   return (
//     <div>
//       <h2>Select a file</h2>
//       <input type="file" 
//       // onChange={}
//       ></input>
      
//     </div>
//   );
// }


'use client';
import React from 'react';

// reuseable  file selector   &      dynmic ke liye use type
type FileSelectorProps = {  
  label?: string;                               
  onFileSelect: (file: File) => Promise<void>;  // for promise
};

export default function FileSelector({  label, onFileSelect }: FileSelectorProps) {  // destructure type too  label, onFileSelect 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
        {label && <label>{label}<input type="file" onChange={handleChange} /></label>} 
            
    </div>
  );
}
