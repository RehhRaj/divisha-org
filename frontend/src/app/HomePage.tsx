import Image from "next/image";

const features = [
  { number: "01", title: "Choose a business", text: "Start with a website direction that fits your school, housing society, travel business, or service." },
  { number: "02", title: "Add your content", text: "Bring your name, pages, contact details, services, and announcements into one place." },
  { number: "03", title: "Publish your website", text: "A responsive website experience designed to work smoothly on desktop, tablet, and mobile." },
];

const industries = [
  { icon: "▤", title: "Schools & education", text: "Admissions, notices, facilities and school information.", tag: "EDUCATION" },
  { icon: "⌂", title: "Housing societies", text: "Community information, amenities, updates and contacts.", tag: "COMMUNITY" },
  { icon: "✈", title: "Tours & travel", text: "Destinations, tour packages, itineraries and enquiries.", tag: "TRAVEL" },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Business OS home"><span className="brand-mark">b<span>o</span></span><span>Business<span className="brand-light">OS</span></span></a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#platform">Platform</a><a href="#solutions">Solutions</a><a href="#how-it-works">How it works</a>
        </nav>
        <a className="nav-cta" href="#solutions">Explore solutions <span>↗</span></a>
      </header>

      <section className="hero" id="platform">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A simpler way to go digital</div>
          <h1>Your business.<br /><span>Your website.</span><br />One smart platform.</h1>
          <p className="hero-description">Business OS helps businesses get online with a clear, modern website experience—built around your type of business and ready to grow with you.</p>
          <div className="hero-actions"><a className="button-primary" href="#solutions">Explore solutions <span>↗</span></a><a className="button-text" href="#how-it-works">See how it works <span>↓</span></a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>✦</span><span>⌂</span><span>▤</span></div><div><strong>One platform, many possibilities</strong><small>Designed for different kinds of businesses</small></div></div>
        </div>
        <div className="hero-visual"><div className="visual-glow" /><div className="hero-image-frame"><Image src="/business-os-hero.png" alt="Business OS website experience shown on a laptop and mobile phone" fill priority sizes="(max-width: 900px) 100vw, 58vw" className="hero-image" /></div><div className="floating-note"><span className="note-icon">✓</span><span><strong>Made for every screen</strong><small>Desktop · Tablet · Mobile</small></span></div><div className="visual-caption">ONE PLATFORM <span>·</span> MANY BUSINESS TYPES</div></div>
      </section>

      <section className="trust-strip" aria-label="Platform highlights"><div><span className="strip-icon">◈</span><span><strong>Flexible by design</strong><small>Adapt to your business</small></span></div><div><span className="strip-icon">▣</span><span><strong>Responsive websites</strong><small>Look great on any screen</small></span></div><div><span className="strip-icon">↗</span><span><strong>Built to grow</strong><small>Start simple, expand later</small></span></div></section>

      <section className="solutions section-wrap" id="solutions"><div className="section-heading"><div><div className="eyebrow">START WITH YOUR INDUSTRY</div><h2>A strong online start<br /><span>for every kind of business.</span></h2></div><p>Choose a starting point. Your website experience can be shaped around the information your customers and community need most.</p></div><div className="solution-grid">{industries.map((item) => <article className="solution-card" key={item.title}><div className="solution-card-top"><span className="solution-icon">{item.icon}</span><span className="solution-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><a href="#how-it-works" aria-label={`Learn about ${item.title}`}>Explore solution <span>↗</span></a></article>)}</div></section>

      <section className="how-section" id="how-it-works"><div className="how-inner"><div className="eyebrow">CLEAR FROM DAY ONE</div><h2>From idea to online.<br /><span>Without the complexity.</span></h2><div className="steps-grid">{features.map((feature) => <article className="step" key={feature.number}><span className="step-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div><a className="button-primary" href="#solutions">Find your starting point <span>↗</span></a></div></section>

      <footer className="footer"><a className="brand footer-brand" href="/"><span className="brand-mark">b<span>o</span></span><span>Business<span className="brand-light">OS</span></span></a><p>A flexible foundation for business websites.</p><span className="copyright">© {new Date().getFullYear()} Business OS</span></footer>
    </main>
  );
}
