import styles from "./TenantSite.module.css";

// eh TypeScript ko batata hai ki page object mein kaun-kaun sa data aayega:
export interface PublishedTenantSite {
  title: string;
  description: string;
  template: string;
  presentation?: { layout: string; palette: string } | null;
}

// Yeh ek dictionary/object hai jo backend se aane wale 
// layout ke naam (jaise "split" ya "card") 
// ko CSS file ki actual class (styles.split, styles.card) se jorta hai.
const layouts = {
  classic: styles.classic,
  split: styles.split,
  editorial: styles.editorial,
  card: styles.card,
  banner: styles.banner,
};


// Yeh component do props leta hai: page (site ka data) aur loginUrl (login page ka link)
export function TenantSite({
  page,
  loginUrl,
}: {
  page: PublishedTenantSite;
  loginUrl: string;
}) {

  // Default Layout:
  const layout = page.presentation?.layout ?? "classic";


  
  const palette = page.presentation?.palette ??
    (page.template === "education-classic" ? "forest" : "terracotta");


    // Safe Class Selection:  Object.hasOwn(layouts, layout) check karta hai ki jo layout naam aaya hai woh hamari layouts list mein maujood hai ya nahi. Agar koi galat naam aa jaye, toh site tootne ki bajay safely layouts.classic lag jata hai.
    
  const layoutClass = Object.hasOwn(layouts, layout)
    ? layouts[layout as keyof typeof layouts]
    : layouts.classic;

  return (
    <main className={`${styles.site} ${layoutClass}`} data-palette={palette}>
      <article className={styles.content}>
        <header><h1>{page.title}</h1></header>
        <div className={styles.details}>
          <p>{page.description}</p>
          <nav aria-label="Tenant access"><a href={loginUrl}>Tenant Login</a></nav>
        </div>
      </article>
    </main>
  );
}
