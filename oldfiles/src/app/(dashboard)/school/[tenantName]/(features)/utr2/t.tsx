// 'use client';

// import { handleCompactFile } from './components/utils/handle-compact-file';
// // import { handleUtrFile } from './utils/handle-utr-file';

// export default function FileUploadFlow() {

//   // COMPACT FILE handler
//   const handleFileCompact = async (file: File): Promise<void> => {
//     try {
     
//      // Call your external logic here
//       await handleCompactFile(file);  // <- Move logic into this file

     
//     } catch (error) {
//       console.error('Error processing compact file:', error);
//     } finally {
//       setIsUploadingCompact(false);
//     }
//   };


//   // UTR FILE handler
//   const handleFileUTR = async (file: File): Promise<void> => {
//     try {
      
//  await handleUTRFile(file);  // <- Move logic into this file

      
//     } catch (error) {
//       console.error('Error processing UTR file:', error);
//     } finally {
//       setIsUploadingUTR(false);
//     }
//   };




//   return (
//     <div>
//       <h1>Excel Upload Report</h1>

//       {/* COMPACT File Upload Flow */}
//       <FileSelector label="Upload comp file" onFileSelect={handleFileCompact} />
      
//       <FileSelector label="Upload UTR file" onFileSelect={handleFileUTR} />
      
      
//     </div>
//   );
// }
