"use client";
import dynamic from "next/dynamic";

const Pen = dynamic(() => import("./UtrFileProcessor"), { ssr: false });

export default function ClientWrapper() {
  return <Pen />;
}
