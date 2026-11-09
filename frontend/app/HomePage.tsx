
import Link from "next/link";

// ============================================================
// 1. HOW IT WORKS
// ============================================================

const steps = [
  {
    number: "01",
    title: "Choose a business",
    text: "Select a website designed for your business type.",
  },
  {
    number: "02",
    title: "Add your content",
    text: "Add your business name, services, contact details, and announcements.",
  },
  {
    number: "03",
    title: "Publish your website",
    text: "Create a responsive website for mobile, tablet, and desktop.",
  },
];

// ============================================================
// 2. BUSINESS TYPES
// These match Django BUSINESS_TYPES keys.
// ============================================================

const businessTypes = [
  {
    icon: "🎓",
    title: "Schools & Education",
    tag: "EDUCATION",
    text: "Admissions, notices, facilities, and school information.",
    href: "https://edu.divisha.org",
    showcase: "/showcase/edu",
  },
  {
    icon: "🏢",
    title: "Housing Societies",
    tag: "COMMUNITY",
    text: "Community information, amenities, updates, and contacts.",
    href: "https://society.divisha.org",
    showcase: "/showcase/society",
  },
  {
    icon: "✈",
    title: "Tours & Travel",
    tag: "TRAVEL",
    text: "Destinations, tour packages, itineraries, and enquiries.",
    href: "https://tour.divisha.org",
    showcase: "/showcase/tour",
  },
  {
    icon: "🍽",
    title: "Restaurants",
    tag: "RESTAURANT",
    text: "Menus, dining experiences, restaurant details, and enquiries.",
    href: "https://restau.divisha.org",
    showcase: "/showcase/restau",
  },
  {
    icon: "✂",
    title: "Beauty & Salon",
    tag: "SALON",
    text: "Beauty services, styling, appointments, and salon information.",
    href: "https://salon.divisha.org",
    showcase: "/showcase/salon",
  },
];

// ============================================================
// 3. HOMEPAGE
// ============================================================

export default function HomePage() {
  return (
    <main className="site-shell">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="topbar">

     

        <Link
          className="brand"
          href="/"
          aria-label="Divisha Business OS home"
        >
          <span className="brand-mark">D</span>

          <span>
            Divisha
            <span className="brand-light">
              Business OS
            </span>
          </span>
        </Link>

        <nav
          className="nav-links"
          aria-label="Main navigation"
        >
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <a
          className="nav-cta"
          href="#solutions"
        >
          Explore solutions ↗
        </a>

      </header>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        className="hero"
        id="platform"
      >

        <div className="hero-copy">

          <p className="eyebrow">
            ● DIVISHA BUSINESS OS
          </p>

          <h1>
            Your business.
            <br />
            <span>Your website.</span>
            <br />
            One smart platform.
          </h1>

          <p className="hero-description">
            Divisha Business OS helps different
            kinds of businesses create clear,
            modern websites.

            Start with the basics and expand
            your digital business when needed.
          </p>

          <div className="hero-actions">

            <a
              className="button-primary"
              href="#solutions"
            >
              Explore solutions ↗
            </a>

            <a
              className="button-text"
              href="#how-it-works"
            >
              See how it works ↓
            </a>

          </div>

          <p className="hero-note">

            <strong>
              One platform, many possibilities
            </strong>

            <br />

            <span>
              Designed for different kinds
              of businesses
            </span>

          </p>

        </div>

        {/* =================================================
            CSS WEBSITE ILLUSTRATION
        ================================================= */}

        <div
          className="hero-visual"
          role="img"
          aria-label="Illustration of a responsive business website on desktop and mobile"
        >

          <div className="browser-window">

            <div className="browser-bar">
              <i />
              <i />
              <i />
              <span>
                yourbusiness.example
              </span>
            </div>

            <div className="browser-content">

              <div className="mock-logo" />
              <div className="mock-title" />
              <div className="mock-line" />
              <div className="mock-line short" />
              <div className="mock-button" />

              <div className="mock-cards">
                <i />
                <i />
                <i />
              </div>

            </div>

          </div>

          <div className="phone-window">
            <div className="phone-speaker" />
            <div className="phone-block" />
            <div className="phone-line" />
            <div className="phone-line short" />
            <div className="phone-button" />
          </div>

          <div className="floating-note">
            ✓ Works on mobile and desktop
          </div>

        </div>

      </section>

      {/* =====================================================
          PLATFORM HIGHLIGHTS
      ===================================================== */}

      <section
        className="trust-strip"
        aria-label="Platform highlights"
      >

        <div>
          <b>Flexible by design</b>
          <span>Adapt to your business</span>
        </div>

        <div>
          <b>Responsive websites</b>
          <span>Look good on every screen</span>
        </div>

        <div>
          <b>Built to grow</b>
          <span>Start simple, expand later</span>
        </div>

      </section>

      {/* =====================================================
          BUSINESS SOLUTIONS
      ===================================================== */}

      <section
        className="solutions section-wrap"
        id="solutions"
      >

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              START WITH YOUR INDUSTRY
            </p>

            <h2>
              A strong online start
              <br />
              <span>
                for your business.
              </span>
            </h2>

          </div>

          <p>
            Choose a starting point.
            Build your website around the
            information your customers need.
          </p>

        </div>

        <div className="solution-grid">

          {businessTypes.map((business) => (

            <article
              className="solution-card"
              key={business.href}
            >

              <div className="solution-card-top">

                <span className="solution-icon">
                  {business.icon}
                </span>

                <span className="solution-tag">
                  {business.tag}
                </span>

              </div>

              <h3>
                {business.title}
              </h3>

              <p>
                {business.text}
              </p>

              <Link href={business.showcase}>Preview templates ↗</Link>
              <a href={business.href}>
                View live demo ↗
              </a>

            </article>

          ))}

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="solutions section-wrap" aria-label="Workflow demos">
        <h2>Explore a workflow</h2>
        <ul>
          <li><Link href="/demos/society">Society maintenance</Link></li>
          <li><Link href="/demos/school">School facilities</Link></li>
          <li><Link href="/demos/travel">Travel enquiries</Link></li>
        </ul>
      </section>

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="how-inner">

          <p className="eyebrow">
            CLEAR FROM DAY ONE
          </p>

          <h2>
            From idea to online.
            <br />
            <span>
              One step at a time.
            </span>
          </h2>

          <div className="steps-grid">

            {steps.map((step) => (

              <article
                className="step"
                key={step.number}
              >

                <span className="step-number">
                  {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>

              </article>

            ))}

          </div>

          <a
            className="button-primary"
            href="#solutions"
          >
            Find your starting point ↗
          </a>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <Link
          className="brand footer-brand"
          href="/"
        >

          <span className="brand-mark">
            D
          </span>

          <span>
            Divisha
            <span className="brand-light">
              Business OS
            </span>
          </span>

        </Link>

        <p>
          A flexible foundation for
          business websites and management systems.
        </p>

        <span className="copyright">
          © 2026 Divisha Business OS
        </span>

      </footer>

    </main>
  );
}
