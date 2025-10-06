// ClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

export default function ClientWrapper() {


const Xyxy= dynamic(() => import('./file-process.client'), {
  ssr: false,
});




  return <Xyxy />;
}
