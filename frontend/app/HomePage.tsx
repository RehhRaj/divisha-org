// HomePage.tsx
// This is the public Business OS homepage.
// The two arrays below contain the page's sample content.
// To change the words or add a business type, edit these arrays.

const steps = [
  {
    number: "01",
    title: "Choose a business",
    text: "Start with a website that fits your school, housing society, or travel business.",
  },
  {
    number: "02",
    title: "Add your content",
    text: "Add your business name, services, contact details, and announcements.",
  },
  {
    number: "03",
    title: "Publish your website",
    text: "Give visitors a website that works on phones, tablets, and computers.",
  },
];

const businessTypes = [
  {
    icon: "▤",
    title: "Schools & education",
    tag: "EDUCATION",
    text: "Admissions, notices, facilities, and school information.",
  },
  {
    icon: "⌂",
    title: "Housing societies",
    tag: "COMMUNITY",
    text: "Community information, amenities, updates, and contacts.",
  },
  {
    icon: "✈",
    title: "Tours & travel",
    tag: "TRAVEL",
    text: "Destinations, tour packages, itineraries, and enquiries.",
  },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Business OS home">
          <span className="brand-mark">bo</span>
          <span>Business<span className="brand-light">OS</span></span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <a className="nav-cta" href="#solutions">Explore solutions ↗</a>
      </header>

      <section className="hero" id="platform">
        <div className="hero-copy">
          <p className="eyebrow">● A SIMPLER WAY TO GO DIGITAL</p>
          <h1>Your business.<br /><span>Your website.</span><br />One smart platform.</h1>
          <p className="hero-description">
            Business OS helps different kinds of businesses create a clear,
            modern website. Start with the basics and add more when needed.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#solutions">Explore solutions ↗</a>
            <a className="button-text" href="#how-it-works">See how it works ↓</a>
          </div>

          <p className="hero-note"><strong>One platform, many possibilities</strong><br />
            <span>Designed for different kinds of businesses</span>
          </p>
        </div>

        {/* Simple CSS illustration instead of a missing image file. */}
        <div className="hero-visual" aria-label="Illustration of a business website on a computer">
          <div className="browser-window">
            <div className="browser-bar"><i /><i /><i /><span>yourbusiness.example</span></div>
            <div className="browser-content">
              <div className="mock-logo" />
              <div className="mock-title" />
              <div className="mock-line" />
              <div className="mock-line short" />
              <div className="mock-button" />
              <div className="mock-cards"><i /><i /><i /></div>
            </div>
          </div>
          <div className="phone-window"><div className="phone-speaker" /><div className="phone-block" /><div className="phone-line" /><div className="phone-line short" /><div className="phone-button" /></div>
          <div className="floating-note">✓ Works on mobile and desktop</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Platform highlights">
        <div><b>Flexible by design</b><span>Adapt to your business</span></div>
        <div><b>Responsive websites</b><span>Look good on every screen</span></div>
        <div><b>Built to grow</b><span>Start simple, expand later</span></div>
      </section>

      <section className="solutions section-wrap" id="solutions">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START WITH YOUR INDUSTRY</p>
            <h2>A strong online start<br /><span>for your business.</span></h2>
          </div>
          <p>Choose a starting point. You can shape the website around the information your customers need.</p>
        </div>

        <div className="solution-grid">
          {businessTypes.map((business) => (
            <article className="solution-card" key={business.title}>
              <div className="solution-card-top">
                <span className="solution-icon">{business.icon}</span>
                <span className="solution-tag">{business.tag}</span>
              </div>
              <h3>{business.title}</h3>
              <p>{business.text}</p>
              <a href="#how-it-works">Explore solution ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-inner">
          <p className="eyebrow">CLEAR FROM DAY ONE</p>
          <h2>From idea to online.<br /><span>One step at a time.</span></h2>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <a className="button-primary" href="#solutions">Find your starting point ↗</a>
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-mark">bo</span>
          <span>Business<span className="brand-light">OS</span></span>
        </a>
        <p>A flexible foundation for business websites.</p>

  

     
        {/* <span className="copyright">© {new Date().getFullYear()} Business OS</span> */}
      
      
      </footer>
    </main>
  );
}
