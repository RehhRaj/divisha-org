import Link from "next/link";
import styles from "./SocietyTemplate.module.css";

type SocietyPageData = {
  page_type: string;
  business_type: string | null;
  tenant: string | null;
  title: string;
  message: string;
  template: string | null;
};

const amenities = [
  { icon: "🌳", title: "Green Spaces", description: "Landscaped areas for a calmer, greener everyday life." },
  { icon: "🛡️", title: "Community Safety", description: "A dedicated place for important safety updates and guidance." },
  { icon: "🏋️", title: "Shared Facilities", description: "Keep residents informed about common facilities and their use." },
  { icon: "🤝", title: "Resident Connect", description: "Make it easier for neighbors and the management team to connect." },
];

const steps = [
  { number: "01", title: "Raise a request", detail: "Residents submit a maintenance concern through the portal." },
  { number: "02", title: "Track progress", detail: "Management acknowledges, assigns and updates the request." },
  { number: "03", title: "Close with feedback", detail: "Residents confirm resolution and share their experience." },
];

export default function SocietyTemplate({ data }: { data: SocietyPageData }) {
  const name = data.title || "Our Residential Community";
  const isDemo = data.page_type === "demo";

  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.nav}`}>
          <a href="#top" className={styles.brand} aria-label={`${name} home`}>
            <span className={styles.brandMark} aria-hidden="true">⌂</span>
            <span className={styles.brandText}><strong>{name}</strong><small>COMMUNITY PORTAL</small></span>
          </a>
          <nav className={styles.navLinks} aria-label="Main navigation">
            <a href="#about">About</a><a href="#amenities">Amenities</a><a href="#updates">Updates</a><a href="#complaints">Complaints</a>
          </nav>
          <a className={styles.navButton} href="#complaints">Resident services <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span className={styles.statusDot} /> {isDemo ? "DIVISHA · SOCIETY DEMO" : "WELCOME TO YOUR COMMUNITY"}</span>
            <h1>Better living.<br /><em>Stronger</em><br />community.</h1>
            <p className={styles.lead}>{data.message || "Your neighborhood, connected."} A welcoming digital home for residents, facilities, updates and everyday support.</p>
            <div className={styles.heroActions}><a className={styles.primaryButton} href="#about">Explore our community <span aria-hidden="true">→</span></a><a className={styles.textButton} href="#complaints">Resident services ↗</a></div>
            <div className={styles.heroNote}>Thoughtful spaces. Connected neighbors. Easier everyday living.</div>
          </div>
          <div className={styles.visual} role="img" aria-label="Stylized illustration of a modern residential society with apartment towers, gardens and trees">
            <div className={styles.skyGlow} /><div className={styles.cloudOne} /><div className={styles.cloudTwo} />
            <div className={styles.buildingBack}><div className={styles.windows}>{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div>
            <div className={styles.buildingMain}><div className={styles.windows}>{Array.from({length:20},(_,i)=><i key={i}/>)}</div></div>
            <div className={styles.buildingSide}><div className={styles.windows}>{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div>
            <div className={styles.lawn}/><div className={styles.path}/><div className={`${styles.tree} ${styles.treeOne}`}/><div className={`${styles.tree} ${styles.treeTwo}`}/>
            <div className={styles.visualCard}><span>WELCOME HOME</span><strong>A place to belong.</strong><small>Community comes first.</small></div>
          </div>
        </div>
      </section>

      <section className={styles.intro} id="about"><div className={`${styles.container} ${styles.introGrid}`}><div><span className={styles.kicker}>A BETTER WAY TO CONNECT</span><h2>Everything your<br /><em>community needs.</em></h2></div><div><p>From important announcements to day-to-day maintenance, a society portal helps residents and management stay on the same page.</p><p className={styles.muted}>Built to bring clarity, convenience and transparency to residential community life.</p></div></div></section>

      <section className={styles.amenities} id="amenities"><div className={styles.container}><div className={styles.sectionHeading}><div><span className={styles.kicker}>COMMUNITY HIGHLIGHTS</span><h2>Life feels better <em>together.</em></h2></div><p>Discover the spaces and services that make a neighborhood feel like home.</p></div><div className={styles.amenityGrid}>{amenities.map(item=><article className={styles.amenityCard} key={item.title}><span className={styles.amenityIcon} aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div><p className={styles.sampleNote}>Illustrative facilities only. Actual amenities will be configured for each society.</p></div></section>

      <section className={styles.updates} id="updates"><div className={`${styles.container} ${styles.updatesGrid}`}><div><span className={styles.kicker}>NOTICE BOARD</span><h2>Stay in the <em>know.</em></h2><p>One clear place for notices, maintenance information and community communication.</p><a href="#complaints" className={styles.inlineLink}>Explore resident services <span aria-hidden="true">→</span></a></div><div className={styles.noticePanel}><div className={styles.noticeHeader}><strong>Community updates</strong><span>PREVIEW</span></div><div className={styles.noticeItem}><span className={styles.noticeIcon}>📢</span><div><strong>Society announcements</strong><p>Publish important notices in one convenient place.</p></div></div><div className={styles.noticeItem}><span className={styles.noticeIcon}>🔧</span><div><strong>Maintenance updates</strong><p>Keep residents informed about ongoing work.</p></div></div><div className={styles.noticeItem}><span className={styles.noticeIcon}>📅</span><div><strong>Community events</strong><p>Share upcoming meetings and activities.</p></div></div><div className={styles.noticeFooter}>Sample content · Live notices are not connected yet</div></div></div></section>

      <section className={styles.complaints} id="complaints"><div className={styles.container}><div className={styles.sectionHeading}><div><span className={styles.kicker}>RESIDENT SUPPORT</span><h2>Maintenance made <em>simpler.</em></h2></div><p>A clear process for reporting issues and following their progress—designed for residents and management alike.</p></div><div className={styles.stepGrid}>{steps.map(step=><article className={styles.stepCard} key={step.number}><span className={styles.stepNumber}>{step.number}</span><h3>{step.title}</h3><p>{step.detail}</p></article>)}</div><div className={styles.complaintNote}><span aria-hidden="true">ⓘ</span><p><strong>Coming next:</strong> Complaint submission, login, tracking and feedback will be connected when the complaint management module is ready. No live complaint form is active on this page.</p></div></div></section>

      <section className={styles.cta}><div className={`${styles.container} ${styles.ctaInner}`}><div><span className={styles.kicker}>YOUR COMMUNITY, ONE PLACE</span><h2>A more connected<br /><em>place to call home.</em></h2><p>Explore the community portal experience built for modern residential societies.</p></div><a href="#top" className={styles.primaryButton}>Back to top <span aria-hidden="true">↑</span></a></div></section>

      <footer className={styles.footer}><div className={`${styles.container} ${styles.footerInner}`}><div><strong>⌂ {name}</strong><span>Community website experience</span></div><span>Powered by <Link href="https://divisha.org/">Divisha</Link></span></div></footer>
    </main>
  );
}
