import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Business OS — Your business. Your website.",
  description: "A flexible platform to help different kinds of businesses build a modern online presence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
