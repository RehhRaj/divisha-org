import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell">
      <section className="section-wrap">
        <h1>Website or page not found</h1>
        <p>Check the website address or open the Divisha homepage.</p>
        <Link href="https://divisha.org/">Divisha homepage</Link>
      </section>
    </main>
  );
}
