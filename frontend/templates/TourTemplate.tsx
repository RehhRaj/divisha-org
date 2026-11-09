import Link from "next/link";

import styles from "./TourTemplate.module.css";


export type TourPageData = {
  page_type: string;
  business_type: string | null;
  tenant: string | null;
  title: string;
  message: string;
  template: string | null;
};

const trips = [
  { icon: "🏔️", name: "Himalayan Escape", place: "Manali · Shimla", days: "5 days", description: "Mountain mornings, scenic drives and memorable stays." },
  { icon: "🌊", name: "Coastal Getaway", place: "Goa", days: "4 days", description: "Sunlit beaches, local flavors and easygoing adventures." },
  { icon: "🌴", name: "Tropical Retreat", place: "Kerala", days: "6 days", description: "Backwaters, lush landscapes and relaxing experiences." },
];

export default function TourTemplate({ data }: { data: TourPageData }) {
  const businessName = data.title || "Discover Your Next Journey";
  const isDemo = data.page_type === "demo";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container + " " + styles.nav}>
          <a href="#home" className={styles.brand} aria-label={`${businessName} home`}>
            <span className={styles.brandIcon}>✈</span>
            <span>{businessName}</span>
          </a>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <a href="#destinations">Destinations</a>
            <a href="#why-us">Why travel with us</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className={styles.navCta} href="#contact">Plan a trip <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className={styles.hero} id="home">
        <div className={styles.container + " " + styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{isDemo ? "✦ DIVISHA TRAVEL DEMO" : "✦ YOUR NEXT ADVENTURE STARTS HERE"}</span>
            <h1>Go further.<br /><em>Feel more.</em><br />Travel better.</h1>
            <p>{data.message || "Discover beautiful places and unforgettable experiences."} Explore inspiring journeys designed for curious travelers.</p>
            <div className={styles.heroActions}>
              <a href="#destinations" className={styles.primaryButton}>Explore destinations <span aria-hidden="true">→</span></a>
              <a href="#why-us" className={styles.secondaryButton}>Discover our approach <span aria-hidden="true">↗</span></a>
            </div>
            <div className={styles.heroFootnote}>✧ Thoughtful journeys &nbsp;·&nbsp; ✧ Memorable experiences</div>
          </div>
          <div className={styles.heroVisual} role="img" aria-label="Illustrated mountain and lakeside travel destination">
            <div className={styles.sun} />
            <div className={styles.mountainBack} />
            <div className={styles.mountainFront} />
            <div className={styles.lake} />
            <div className={styles.visualLabel}><span>EXPLORE MORE</span><strong>The world awaits.</strong></div>
            <div className={styles.floatingStamp}>✈<small>LET'S GO</small></div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="destinations">
        <div className={styles.container}>
          <div className={styles.sectionTop}><div><span className={styles.sectionKicker}>CURATED EXPERIENCES</span><h2>Where will you <em>go next?</em></h2></div><p>From peaceful mountain escapes to sunny shores, find a journey that feels like yours.</p></div>
          <div className={styles.tripGrid}>
            {trips.map((trip, index) => (
              <article className={styles.tripCard} key={trip.name}>
                <div className={`${styles.tripArtwork} ${styles[`tripArtwork${index}`]}`}><span aria-hidden="true">{trip.icon}</span><div className={styles.duration}>{trip.days}</div></div>
                <div className={styles.tripBody}><span className={styles.tripLocation}>↗ {trip.place}</span><h3>{trip.name}</h3><p>{trip.description}</p><a href="#contact" aria-label={`Enquire about ${trip.name}`}>Enquire about this trip <span aria-hidden="true">→</span></a></div>
              </article>
            ))}
          </div>
          <p className={styles.disclaimer}>Sample itineraries for design demonstration. Packages, pricing and availability are not yet configured.</p>
        </div>
      </section>

      <section className={styles.benefits} id="why-us"><div className={styles.container + " " + styles.benefitGrid}><div><span className={styles.sectionKicker}>WHY TRAVEL WITH US</span><h2>Every journey<br /><em>has a story.</em></h2><p>We believe the best travel experiences make space for discovery, connection and unforgettable moments.</p></div><div className={styles.benefitItems}><div><span>01 /</span><div><h3>Thoughtfully planned</h3><p>Discover experiences designed around the joy of exploration.</p></div></div><div><span>02 /</span><div><h3>Places worth remembering</h3><p>From iconic views to hidden corners, travel with curiosity.</p></div></div><div><span>03 /</span><div><h3>Your journey, your pace</h3><p>Find inspiration for adventures that fit your style.</p></div></div></div></div></section>

      <section className={styles.contactSection} id="contact"><div className={styles.container + " " + styles.contactPanel}><div><span className={styles.sectionKicker}>LET'S MAKE MEMORIES</span><h2>Ready for your<br /><em>next adventure?</em></h2><p>We’re preparing more ways to help you plan your perfect getaway. For now, explore our sample destinations above.</p></div><a href="#destinations" className={styles.primaryButton}>Explore trips <span aria-hidden="true">→</span></a></div></section>

      <footer className={styles.footer}><div className={styles.container + " " + styles.footerRow}><span>✈ {businessName}</span><span>Travel website powered by <Link href="https://divisha.org/">Divisha</Link></span></div></footer>
    </main>
  );
}
