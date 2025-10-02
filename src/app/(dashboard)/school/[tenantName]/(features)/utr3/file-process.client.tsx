
// FileUploadFlow 
'use client';
 import FileSelector  from './components/file-selector '      //"module";
import { handleFile } from './components/utils/fileHandlers'
export default function FileUploadFlow() {



    return (
        <div>
          <h1>hello </h1>
         <FileSelector  label = "Choose Com file "   onFileSelect = { handleFile  }   />
         </div>        
        )        
}