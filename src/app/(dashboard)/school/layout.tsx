import type { Metadata } from "next";


export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-8 text-gray-800 bg-green-500 not-last-of-type:">
      {children}
    </section>
  )
}
