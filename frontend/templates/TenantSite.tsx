import styles from "./TenantSite.module.css";

export interface PublishedTenantSite {
  title: string;
  description: string;
  template: string;
  presentation?: { layout: string; palette: string } | null;
}

const layouts = {
  classic: styles.classic,
  split: styles.split,
  editorial: styles.editorial,
  card: styles.card,
  banner: styles.banner,
};

export function TenantSite({
  page,
  loginUrl,
}: {
  page: PublishedTenantSite;
  loginUrl: string;
}) {
  const layout = page.presentation?.layout ?? "classic";
  const palette = page.presentation?.palette ??
    (page.template === "education-classic" ? "forest" : "terracotta");
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
