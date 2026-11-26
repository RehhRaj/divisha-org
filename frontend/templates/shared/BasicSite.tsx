import type { ReactNode } from "react";
import type { TenantSiteProps } from "../types";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import styles from "./BasicSite.module.css";

const layouts = {
  classic: styles.classic,
  split: styles.split,
  editorial: styles.editorial,
  card: styles.card,
  banner: styles.banner,
};

export function BasicSite({ page, loginUrl, section }: TenantSiteProps & {
  section?: { title: string; content: ReactNode };
}) {
  const layout = page.presentation?.layout ?? "classic";
  const palette = page.presentation?.palette ??
    (page.template === "education-classic" ? "forest" : "terracotta");
  const layoutClass = Object.hasOwn(layouts, layout)
    ? layouts[layout as keyof typeof layouts]
    : layouts.classic;

  return (
    <main className={`${styles.site} ${layoutClass}`} data-palette={palette}>
      <SiteHeader section={section?.title} hours={page.hours} contact={page.contact} />
      <article className={styles.content}>
        <header><h1>{page.title}</h1></header>
        <div className={styles.details}><p>{page.description}</p></div>
      </article>
      {section && (
        <section id="offerings" className={styles.section}>
          <h2>{section.title}</h2>
          {section.content}
        </section>
      )}
      {page.hours && (
        <section id="hours" className={styles.section}>
          <h2>Opening hours</h2>
          <p>{page.hours}</p>
        </section>
      )}
      {page.contact && (
        <section id="contact" className={styles.section}>
          <h2>Contact</h2>
          <p>
            {page.contact.split(/\r?\n/).map((text, index) => {
              const line = text.trim();
              const phone = line.replace(/[ ().-]/g, "");
              const href = /^\+?\d{7,15}$/.test(phone) ? `tel:${phone}`
                : /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(line) ? `mailto:${line}`
                : undefined;
              return <span key={index}>{index > 0 && <br />}{href ? <a href={href}>{line}</a> : line}</span>;
            })}
          </p>
        </section>
      )}
      <SiteFooter loginUrl={loginUrl} />
    </main>
  );
}
