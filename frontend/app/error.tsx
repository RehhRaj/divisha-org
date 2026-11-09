"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="site-shell">
      <section className="section-wrap">
        <h1>Website temporarily unavailable</h1>
        <p>Divisha could not load this website. Try again in a moment.</p>
        <button type="button" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
