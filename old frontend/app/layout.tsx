// app/layout.tsx
// The root layout wraps every page in the application.

import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Business OS — Your business. Your website.",
  description:
    "A simple platform to help different kinds of businesses build a website.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
