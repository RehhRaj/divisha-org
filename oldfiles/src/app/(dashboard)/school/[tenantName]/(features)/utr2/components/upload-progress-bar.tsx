// ...../utr2/components/upload-progress-bar.tsx


// components/upload-progress-bar.tsx



// export default function UploadProgressBar() {

//   return (
//     <div>
//       <p>Uploading...</p>
//       <progress value={30} max={100} />
//     </div>
//   );
// }


type UploadProgressBarProps = {
  isUploading: boolean;
}

export default function UploadProgressBar({ isUploading }: UploadProgressBarProps) {
  if (!isUploading) return null; // Only show progress bar when uploading is true

  return (
    <div>
      <p>Uploading...</p>
      <progress value={30} max={100} />
    </div>
  );
}