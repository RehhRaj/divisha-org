import styles from "./BusinessLanding.module.css";

export type BusinessLandingData = {
  page_type: "business_landing";
  business_type: string;
  template: "business_landing";
  title: string;
  headline: string;
  message: string;
  eyebrow: string;
  demo_url: string;
  preview?: { src: string; alt: string; caption: string; label: string };
  currency: string;
  plans: { id: string; name: string; price: number; period: string }[];
  features: { label: string; plans: string[]; planned?: boolean }[];
  details_step: string;
  whatsapp_number?: string | null;
};

export default function BusinessLanding({ data }: { data: BusinessLandingData }) {
  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: data.currency,
    maximumFractionDigits: 2,
  });
  const chat = data.whatsapp_number && /^[1-9]\d{7,14}$/.test(data.whatsapp_number)
    ? `https://wa.me/${data.whatsapp_number}?text=${encodeURIComponent(`Hi, I would like to learn more about ${data.title}.`)}`
    : null;

  return <div className={styles.landing}>
    <header className={styles.header}>
      <div className={`${styles.wrap} ${styles.bar}`}>
        <a className={styles.brand} href="/">{data.title}</a>
        <nav className={styles.actions} aria-label="Main navigation">
          <a href="#setup">How it works</a>
          <a href="#features">Features</a>
          <a href="#plans">Plans</a>
          <a className={styles.button} href={data.demo_url}>View Live Demo</a>
        </nav>
      </div>
    </header>
    <main>
      <section className={styles.hero}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div>
            <p className={styles.eyebrow}>{data.eyebrow}</p>
            <h1>{data.headline}</h1>
            <p className={styles.intro}>{data.message}</p>
            <div className={styles.actions}>
              <a className={styles.button} href={data.demo_url}>View Live Demo</a>
              <a className={styles.secondary} href="#plans">See Plans</a>
            </div>
          </div>
          {data.preview && <figure className={styles.frame}>
            <div className={styles.chrome}>{data.preview.label}</div>
            <img src={data.preview.src} alt={data.preview.alt} width={900} height={600} />
            <figcaption>{data.preview.caption}</figcaption>
          </figure>}
        </div>
      </section>
      <section className={`${styles.wrap} ${styles.band}`} id="setup">
        <h2>Go live in three steps</h2>
        <ol className={styles.steps}>
          <li><strong>Choose a layout</strong><p>Browse the <a href="/preview/">template preview</a> to find a starting design.</p></li>
          <li><strong>Add your details</strong><p>{data.details_step}</p></li>
          <li><strong>Review and publish</strong><p>Check the site on mobile and desktop before sharing it.</p></li>
        </ol>
      </section>
      <section className={styles.soft} id="features">
        <div className={`${styles.wrap} ${styles.band}`}>
          <h2>Choose the tools you need</h2>
          <ul className={styles.features}>{data.features.map(feature => {
            const free = data.plans.some(plan => plan.price === 0 && feature.plans.includes(plan.id));
            return <li key={feature.label}>
              <span>{feature.label}</span>
              <span className={free ? styles.free : styles.paid}>{free ? "Free for all" : "Paid"}{feature.planned && " · Planned"}</span>
            </li>;
          })}</ul>
        </div>
      </section>
      <section className={`${styles.wrap} ${styles.band}`} id="plans">
        <h2>Compare plans</h2>
        <p>Sample prices and proposed inclusions.</p>
        <div className={styles.scroll} role="region" aria-label="Plan comparison" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Feature</th>{data.plans.map(plan =>
              <th scope="col" key={plan.id}>{plan.name}<small>{money.format(plan.price)} {plan.period}</small></th>,
            )}</tr></thead>
            <tbody>{data.features.map(feature =>
              <tr key={feature.label}><th scope="row">{feature.label}</th>{data.plans.map(plan =>
                <td key={plan.id}>{feature.plans.includes(plan.id) ? feature.planned ? "Planned" : "Included" : "—"}</td>,
              )}</tr>,
            )}</tbody>
          </table>
        </div>
      </section>
      <section className={styles.soft} id="contact"><div className={`${styles.wrap} ${styles.band}`}>
        <h2>See {data.title} in action</h2>
        <div className={styles.actions}>
          <a className={styles.button} href={data.demo_url}>View Live Demo</a>
          {chat && <a className={styles.secondary} href={chat}>WhatsApp Enquiry</a>}
        </div>
      </div></section>
    </main>
    <footer className={styles.footer}><div className={styles.wrap}><a href="https://divisha.org/">Divisha</a> · {data.title}</div></footer>
  </div>;
}
