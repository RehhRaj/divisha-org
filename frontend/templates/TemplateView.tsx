import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CTA, Offering, SitePage } from "./types";
import { families } from "./registry";
import s from "./TemplateView.module.css";

function allowedHref(href: string) {
  if (/^#[a-z][a-z0-9-]*$/i.test(href) || /^\/(?![\\/])[^\\\s]*$/.test(href)) return href;
  try {
    const url = new URL(href);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function Cta({ cta, secondary = false }: { cta: CTA; secondary?: boolean }) {
  const href = allowedHref(cta.link);
  if (!href) return null;
  return <a className={secondary ? s.secondary : s.button} href={href}
    target={cta.open_in_new_tab ? "_blank" : undefined} rel={cta.open_in_new_tab ? "noopener noreferrer" : undefined}>
    {cta.text} <span aria-hidden="true">↗</span>
  </a>;
}

function Price({ item, currency }: { item: Offering; currency: string }) {
  if (item.price == null) return null;
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 });
  const price = item.discount_price ?? item.price;
  return <p className={s.price}>{item.price_is_from ? "From " : ""}
    {item.discount_price != null && <><del>{money.format(item.price)}</del>{" "}</>}
    {money.format(price)}{item.price_unit ? ` / ${item.price_unit.replace(/^per_/, "").replaceAll("_", " ")}` : ""}
  </p>;
}

function OfferingImage({ item, detail = false }: { item: Offering; detail?: boolean }) {
  const src = item.image_url ? allowedHref(item.image_url) : undefined;
  if (!src || src.startsWith("#")) return null;
  return (
    <img
      className={detail ? s.detailImage : s.offeringImage}
      src={src}
      alt={item.image_alt ?? item.title}
      width={352}
      height={220}
      loading={detail ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function TemplateView({ page, basePath, item }: { page: SitePage; basePath: string; item?: Offering }) {
  const family = families.get(page.template);
  const variant = family && Object.hasOwn(family.variants, page.template_variant) ? family.variants[page.template_variant] : undefined;
  if (!family || !variant) notFound();

  const query = page.page_type === "demo" && page.template_variant !== "classic" ? `?variant=${encodeURIComponent(page.template_variant)}` : "";
  const home = basePath + query;
  const theme = {
    "--accent": variant.color ?? page.theme.primary_color,
    "--surface": variant.surface ?? page.theme.secondary_color,
  } as CSSProperties;
  const displayItems = page.sections.show_items && page.items.length > 0;
  const displayContact = !!(page.contact.phone || page.contact.email || page.contact.address || page.contact.whatsapp);
  const isRestaurant = page.template === "restaurant";
  const phone = page.contact.phone?.replace(/[\s().-]/g, "");
  const callHref = isRestaurant && phone && /^\+?[0-9]{7,15}$/.test(phone) ? `tel:${phone}` : undefined;
  const destination = page.contact.address?.trim();
  const directionsHref = isRestaurant && destination
    ? `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination })}`
    : undefined;
  const classicFamily = page.template_variant === "classic" ? s[page.template] : undefined;
  const showSpotlight = page.template_variant === "classic" && page.template !== "tour" && displayItems;
  const itemsRoot = page.template === "tour" ? "packages" : "offerings";

  return <div className={[s.site, s[variant.layout], classicFamily].filter(Boolean).join(" ")} style={theme}>
    <header className={`${s.wrap} ${s.header}`}>
      <Link className={s.brand} href={home}><span aria-hidden="true">{family.mark}</span>{page.title}</Link>
      <nav aria-label="Main navigation">
        {page.navigation.header_links.filter(({ href }) =>
          (href === `#${family.sectionId}` && displayItems) ||
          (href === "#why-us" && page.sections.show_why_us) || href === "#contact"
        ).map(({ label, href }) => <a key={href} href={item ? home + href : href}>{label}</a>)}
      </nav>
      {(callHref || directionsHref) && (
        <div className={s.headerActions} role="group" aria-label="Restaurant quick actions">
          {callHref && <a className={s.callNow} href={callHref}>Call Now</a>}
          {directionsHref && <a className={s.directions} href={directionsHref}>Get Directions</a>}
        </div>
      )}
    </header>

    {page.page_type === "demo" && <nav className={`${s.wrap} ${s.variants}`} aria-label="Preview template designs">
      <span>Preview design</span>
      {page.available_variants.map(key => Object.hasOwn(family.variants, key) &&
        <Link key={key} aria-current={key === page.template_variant ? "page" : undefined}
          href={key === "classic" ? basePath : `${basePath}?variant=${encodeURIComponent(key)}`}>
          {family.variants[key].name}
        </Link>)}
    </nav>}

    <main className={s.wrap}>
      {item ? <section className={s.details}>
        <Link className={s.back} href={home + `#${family.sectionId}`}>← Back to {family.offeringLabel.toLowerCase()}</Link>
        <p className={s.kicker}>{item.subtitle}</p>
        <h1>{item.title}</h1>
        <OfferingImage item={item} detail />
        <p>{item.description}</p>
        {item.duration_label && <p><strong>Duration</strong> {item.duration_label}</p>}
        <Price item={item} currency={page.currency} />
        {!!item.inclusions?.length && <><h2>What’s included</h2><ul>{item.inclusions.map(value => <li key={value}>{value}</li>)}</ul></>}
        <p className={s.note}>{page.content.items_disclaimer}</p>
        <Cta cta={item.cta ?? { ...page.content.primary_cta, link: "#contact" }} />
      </section> : <>
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.kicker}>{family.label} / {variant.label}</p>
            <h1>{page.page_type === "tenant" ? page.title : variant.headline}</h1>
            <p>{page.content.tagline}. {page.message}</p>
            <div className={s.actions}>
              {variant.layout === "catalog" && displayItems
                ? <Cta cta={page.content.secondary_cta} />
                : <Cta cta={page.content.primary_cta} />}
              {variant.layout === "catalog"
                ? <Cta cta={page.content.primary_cta} secondary />
                : displayItems && <Cta cta={page.content.secondary_cta} secondary />}
            </div>
          </div>
          <aside className={s.art} aria-label={variant.label}>
            <span className={s.orbit} aria-hidden="true" />
            {showSpotlight ? <div className={s.spotlight}>
              <p className={s.kicker}>{family.offeringLabel}</p>
              <ol>{page.items.slice(0, 2).map(entry => <li key={entry.id}>
                <strong>{entry.title}</strong><span>{entry.duration_label ?? entry.subtitle}</span>
              </li>)}</ol>
            </div> : <span className={s.mark} aria-hidden="true">{family.mark}</span>}
            <span className={s.artText}>{variant.name} <span>/</span> {family.label}</span>
          </aside>
        </section>

        {displayItems && <section id={family.sectionId} className={s.section}>
          <p className={s.kicker}>Explore</p>
          <h2>{family.offeringLabel}</h2>
          <p className={s.note}>{page.content.items_disclaimer}</p>
          <div className={s.cards}>
            {page.items.map((offering, index) => <article className={s.card} key={offering.id}>
              <OfferingImage item={offering} />
              <span className={s.index}>0{index + 1} / {offering.duration_label ?? offering.subtitle}</span>
              <h3>{offering.title}</h3>
              <p>{offering.description}</p>
              <Price item={offering} currency={page.currency} />
              <Link className={s.detailsLink} href={`${basePath}${itemsRoot}/${encodeURIComponent(offering.slug)}/${query}`}>View details <span aria-hidden="true">↗</span></Link>
            </article>)}
          </div>
        </section>}

        {page.sections.show_why_us && <section id="why-us" className={s.section}>
          <p className={s.kicker}>About this website</p>
          <h2>What you can explore</h2>
          <p>{page.content.about_us}</p>
          <p>{family.guidance}</p>
        </section>}
        {!!page.faqs.length && <section className={s.section}>
          <h2>Frequently asked questions</h2>
          {page.faqs.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>}
      </>}
      <section id="contact" className={s.contact}>
        <p className={s.kicker}>Next step</p>
        <h2>{family.contactTitle}</h2>
        {displayContact ? <address>
          {page.contact.phone && <p><a href={`tel:${page.contact.phone.replace(/[^+\d]/g, "")}`}>{page.contact.phone}</a></p>}
          {page.contact.email && <p><a href={`mailto:${page.contact.email}`}>{page.contact.email}</a></p>}
          {page.contact.whatsapp && <p><a href={`https://wa.me/${page.contact.whatsapp.replace(/\D/g, "")}`}>Contact on WhatsApp</a></p>}
          {page.contact.address && <p>{page.contact.address}</p>}
        </address> : <p>This sample website has no contact channel configured.</p>}
      </section>
    </main>
    <footer className={`${s.wrap} ${s.footer}`}><span>{page.title}</span><span>Powered by Divisha · Sample website</span></footer>
  </div>;
}