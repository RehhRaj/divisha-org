import styles from "./BasicSite.module.css";

export function SiteFooter({ loginUrl }: { loginUrl: string }) {
  return (
    <footer className={styles.links}>
      <a href={loginUrl}>Tenant Login</a>
    </footer>
  );
}
