"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Offering } from "../types";
import styles from "./RestaurantOrder.module.css";

type CartState = Record<string, number>;
type MenuItem = { id: string; title: string; paise: number };
type CartContext = {
  menu: MenuItem[];
  quantities: CartState;
  change: (id: string, delta: number) => void;
  title: string;
  phone: string;
  currency: string;
  mode: string;
};
const Cart = createContext<CartContext | null>(null);

export function RestaurantOrder({
  siteId, title, phone, currency, table, menu, children,
}: {
  siteId: string;
  title: string;
  phone: string;
  currency: string;
  table: { id: string; label: string } | null;
  menu: Offering[];
  children: ReactNode;
}) {
  const storageKey = "divisha:order:" + JSON.stringify([siteId, table?.id]);
  const [saved, setSaved] = useState<CartState | null>(null);
  const available = menu.flatMap(({ id, title: name, discount_price, price }) => {
    const amount = discount_price ?? price;
    if (typeof amount !== "number" || amount < 0 || amount > 10000000) return [];
    const paise = Math.round(amount * 100);
    return Number.isSafeInteger(paise) ? [{ id, title: name, paise }] : [];
  });

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      setSaved(Object.fromEntries(Object.entries(raw ?? {}).filter((entry): entry is [string, number] => {
        const [, count] = entry;
        return typeof count === "number" && Number.isInteger(count) && count >= 1 && count <= 99;
      })));
    } catch {
      setSaved({});
    }
  }, [storageKey]);

  useEffect(() => {
    if (saved === null) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch {
      // A blocked storage area still permits an in-memory order.
    }
  }, [storageKey, saved]);

  function change(id: string, delta: number) {
    setSaved((current) => {
      if (current === null) return current;
      const prior = Object.hasOwn(current, id) ? current[id] : 0;
      const quantity = Math.min(99, Math.max(0, prior + delta));
      const updated = { ...current, [id]: quantity };
      if (quantity === 0) delete updated[id];
      return updated;
    });
  }

  return <Cart.Provider value={saved === null ? null : {
    menu: available,
    quantities: saved,
    change,
    title,
    phone,
    currency,
    mode: table ? `Dine-in · ${table.label}` : "Takeaway",
  }}>{children}</Cart.Provider>;
}

function quantityFor(cart: CartContext, id: string) {
  return Object.hasOwn(cart.quantities, id) ? cart.quantities[id] : 0;
}

export function AddToOrder({ id }: { id: string }) {
  const cart = useContext(Cart);
  const item = cart?.menu.find((entry) => entry.id === id);
  if (!cart || !item) return null;
  const quantity = quantityFor(cart, id);
  if (!quantity) return <button type="button" className={styles.add} onClick={() => cart.change(id, 1)} aria-label={`Add ${item.title}`}>Add</button>;

  return <span role="group" className={styles.stepper} aria-label={item.title}>
    <button type="button" aria-label={`Remove one ${item.title}`} onClick={() => cart.change(id, -1)}>−</button>
    <span aria-live="polite">{quantity}</span>
    <button type="button" disabled={quantity >= 99} aria-label={`Add one ${item.title}`} onClick={() => cart.change(id, 1)}>+</button>
  </span>;
}

export function OrderCart() {
  const cart = useContext(Cart);
  const [note, setNote] = useState("");
  if (!cart) return null;
  const lines = cart.menu.map((item) => ({ ...item, quantity: quantityFor(cart, item.id) })).filter((item) => item.quantity);
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.paise * item.quantity, 0);
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: cart.currency });
  const format = (paise: number) => money.format(paise / 100);
  const message = [
    `Order for ${cart.title}`,
    cart.mode,
    "",
    ...lines.map((item) => `${item.quantity} × ${item.title} · ${format(item.paise * item.quantity)}`),
    `Estimated total: ${format(total)}`,
    ...(note.trim() ? [`Note: ${note.trim()}`] : []),
    "Please confirm availability, final total and payment details.",
  ].join("\n");

  return <section className={styles.cart} id="order-cart" aria-labelledby="order-title">
    <h2 id="order-title">Your order</h2>
    <p>{cart.mode}</p>
    {count > 0 ? <>
      <ul>{lines.map((item) => <li key={item.id}>
        <span>{item.title} · {format(item.paise * item.quantity)}</span>
        <AddToOrder id={item.id} />
      </li>)}</ul>
      <p><strong>Estimated total {format(total)}</strong></p>
      <label>Order note<textarea maxLength={200} value={note} onChange={(event) => setNote(event.target.value)} /></label>
      <a className={styles.checkout} href={`https://wa.me/${cart.phone}?text=${encodeURIComponent(message)}`}>Order on WhatsApp</a>
      <p>Review and send the message in WhatsApp. Pay the restaurant directly after confirmation.</p>
      <a className={styles.summary} href="#order-cart">View cart · {count} · {format(total)}</a>
    </> : <p>Add a menu item to start your order.</p>}
  </section>;
}
