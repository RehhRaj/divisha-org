import type { PageData } from "@/types/page";
import styles from "./RestaurantTemplate.module.css";

export default function RestaurantTemplate({ data }: { data: PageData }) {
  const dishes = [
    { name: "Smoked Paneer Tikka", description: "Charcoal-kissed cottage cheese, mint chutney", price: "₹420", icon: "✦" },
    { name: "Truffle Mushroom Risotto", description: "Slow-cooked arborio rice, parmesan, herbs", price: "₹690", icon: "✧" },
    { name: "Royal Dum Biryani", description: "Fragrant basmati, saffron, house spices", price: "₹540", icon: "✦" },
  ];
  const isDemo = data.page_type === "demo";
  return (
    <main className={styles.page}>
      <div className={styles.topline}>AN EVENING WORTH REMEMBERING <span>✳</span> FINE DINING · TIMELESS FLAVOURS</div>
      <header className={styles.header}>
        <a href="#home" className={styles.brand}><span className={styles.brandMark}>✳</span><span>{data.title}<small>DINING & HOSPITALITY</small></span></a>
        <nav className={styles.nav} aria-label="Restaurant navigation"><a href="#story">Our Story</a><a href="#menu">The Menu</a><a href="#experience">Experience</a></nav>
        <a href="#contact" className={styles.headerButton}>ENQUIRE ABOUT A TABLE <span>↗</span></a>
      </header>
      <section id="home" className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.line}></span> WELCOME TO THE TABLE</div>
          <h1>Food that<br/><em>stays with</em><br/>you.</h1>
          <p>{data.message}. Discover a place where thoughtful flavours and warm hospitality meet.</p>
          <a className={styles.goldButton} href="#menu">EXPLORE THE MENU <span>↗</span></a>
          <div className={styles.heroFooter}><span>01 / THE EXPERIENCE</span><span>SCROLL TO DISCOVER ↓</span></div>
        </div>
        <div className={styles.heroVisual} role="img" aria-label="Elegant plated fine dining meal">
          <div className={styles.imageBadge}><span>EST.</span><strong>2026</strong><span>CRAFTED WITH CARE</span></div>
        </div>
      </section>
      <section id="story" className={styles.story}>
        <div className={styles.storyIndex}>01 — OUR PHILOSOPHY</div>
        <div className={styles.storyBody}><p className={styles.kicker}>A LITTLE MORE THAN A MEAL</p><h2>Good food.<br/><em>Great company.</em></h2><p>We believe the best evenings are unhurried. Fresh ingredients, soulful recipes, and a table that always feels welcoming.</p></div>
        <div className={styles.storyAccent}>✳</div>
      </section>
      <section id="menu" className={styles.menu}>
        <div className={styles.sectionHeading}><div><p className={styles.kicker}>02 — FROM OUR KITCHEN</p><h2>Signature <em>plates.</em></h2></div><span>THE HOUSE FAVOURITES / SAMPLE MENU</span></div>
        <div className={styles.menuGrid}>
          {dishes.map((dish, i) => <article className={styles.dish} key={dish.name}><div className={styles.dishNumber}>0{i+1}</div><div className={styles.dishIcon}>{dish.icon}</div><h3>{dish.name}</h3><p>{dish.description}</p><div className={styles.dishBottom}><span>{dish.price}</span><span>↗</span></div></article>)}
        </div>
        <p className={styles.disclaimer}>Illustrative dishes and prices only. Replace with each restaurant’s actual menu before launch.</p>
      </section>
      <section id="experience" className={styles.experience}><div className={styles.experienceImage} role="img" aria-label="Warm restaurant interior"/><div className={styles.experienceCopy}><p className={styles.kicker}>03 — THE ATMOSPHERE</p><h2>Stay a little <em>longer.</em></h2><p>From intimate conversations to celebrations worth remembering, every detail is designed to make you feel at home.</p><a href="#contact">PLAN YOUR VISIT <span>↗</span></a></div></section>
      <section id="contact" className={styles.contact}><p className={styles.kicker}>YOUR TABLE AWAITS</p><h2>Make tonight<br/><em>memorable.</em></h2><p>For reservations or event enquiries, contact the restaurant directly.</p><div className={styles.contactNote}>Online booking is not connected yet — this section is a visual demo.</div></section>
      <footer className={styles.footer}><span>✳ {data.title}</span><span>{isDemo ? "DIVISHA · RESTAURANT DEMO" : "POWERED BY DIVISHA"}</span><a href="#home">BACK TO TOP ↑</a></footer>
    </main>
  );
}
