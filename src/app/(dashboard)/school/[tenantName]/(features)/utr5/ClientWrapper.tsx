// ClientWrapper.tsx

'use client';

import dynamic from 'next/dynamic';

const FileProcess = dynamic(() => import('./fileProcess'), { ssr: false });

export default function ClientWrapperWrapper() {
  console.log("ClientWrapper.tsx")
  return <FileProcess />;
}
