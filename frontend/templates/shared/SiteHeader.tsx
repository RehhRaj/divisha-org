import styles from "./BasicSite.module.css";

export function SiteHeader({ section, hours, contact }: {
  section?: string;
  hours?: string;
  contact?: string;
}) {
  return (section || hours || contact) ? (
    <nav className={styles.links} aria-label="Website navigation">
      {section && <a href="#offerings">{section}</a>}
      {hours && <a href="#hours">Opening hours</a>}
      {contact && <a href="#contact">Contact</a>}
    </nav>
  ) : null;
}
