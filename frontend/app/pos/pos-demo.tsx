"use client";

import { useEffect, useState } from "react";
import styles from "./pos.module.css";

type Item = { id: string; name: string; price_paise: number; available: boolean };
type Line = Pick<Item, "id" | "name" | "price_paise"> & { quantity: number };
type Payment = { mode: "Cash" | "UPI"; amount: number };
type Receipt = { id: string; location: string; lines: Line[]; discount: number; payments: Payment[] };
type DemoState = {
  cart: Record<string, number>;
  location: string;
  receipt: Receipt | null;
  history: Receipt[];
  kitchenSent: Record<string, number>;
};
export type PosConfig = { tenant: string; title: string; menu: Item[]; tables: string[] };

const empty: DemoState = { cart: {}, location: "Takeaway", receipt: null, history: [], kitchenSent: {} };
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const money = (paise: number) => currency.format(paise / 100);
const subtotal = (lines: Line[]) => lines.reduce((total, line) => total + line.price_paise * line.quantity, 0);
const paid = (receipt: Receipt) => receipt.payments.reduce((total, payment) => total + payment.amount, 0);
const due = (receipt: Receipt) => subtotal(receipt.lines) - receipt.discount - paid(receipt);

function parseMoney(value: string) {
  return /^\d{1,7}(?:\.\d{1,2})?$/.test(value) ? Math.round(Number(value) * 100) : NaN;
}

function restore(key: string): DemoState {
  const value = JSON.parse(localStorage.getItem(key) ?? "null") as DemoState | null;
  if (!value || !value.cart || typeof value.location !== "string") return empty;
  const history = value.history ?? [];
  if (!Array.isArray(history) || history.some((bill) => !bill) || [...history, value.receipt].some((receipt) => receipt && (
    typeof receipt.id !== "string" || typeof receipt.location !== "string" ||
    !Array.isArray(receipt.lines) || !receipt.lines.length ||
    receipt.lines.some((line) => !line || typeof line.name !== "string" ||
      !Number.isSafeInteger(line.price_paise) || line.price_paise < 0 ||
      !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) ||
    !Number.isSafeInteger(receipt.discount) || receipt.discount < 0 ||
    !Array.isArray(receipt.payments) || receipt.payments.some((payment) =>
      !payment || !Number.isSafeInteger(payment.amount) || payment.amount <= 0 ||
      (payment.mode !== "Cash" && payment.mode !== "UPI")) ||
    !Number.isSafeInteger(due(receipt)) || due(receipt) < 0
  ))) return empty;
  return { ...value, history, kitchenSent: value.kitchenSent ?? {}, receipt: value.receipt ?? null };
}

export function PosDemo({ config }: { config: PosConfig }) {
  const key = `divisha:pos-demo:v1:${config.tenant}`;
  const [state, setState] = useState<DemoState | null>(null);
  const [discountText, setDiscountText] = useState("");
  const [paymentText, setPaymentText] = useState("");
  const [ticket, setTicket] = useState<{ location: string; lines: Line[]; note: string } | null>(null);
  const [note, setNote] = useState("");
  const [opening, setOpening] = useState("0");
  const [counted, setCounted] = useState("");
  const [reprint, setReprint] = useState<Receipt | null>(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      setState(restore(key));
    } catch {
      setState(empty);
    }
  }, [key]);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      setStorageError(true);
    }
  }, [key, state]);

  if (!state) return <main className={styles.pos}>Loading POS demo…</main>;

  const lines = config.menu.flatMap(({ id, name, price_paise, available }) => {
    const quantity = state.cart[id];
    return available && Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 99
      ? [{ id, name, price_paise, quantity }]
      : [];
  });
  const total = subtotal(lines);
  const discount = parseMoney(discountText || "0");
  const paymentAmount = parseMoney(paymentText);
  const receipt = state.receipt;
  const sales = receipt ? [...state.history, receipt] : state.history;
  const cash = sales.flatMap((bill) => bill.payments)
    .filter((payment) => payment.mode === "Cash")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const upi = sales.reduce((sum, bill) => sum + paid(bill), 0) - cash;
  const expected = parseMoney(opening) + cash;
  const kitchenLines = lines.flatMap((line) => {
    const quantity = line.quantity - (state.kitchenSent[line.id] || 0);
    return quantity > 0 ? [{ ...line, quantity }] : [];
  });
  const preview = reprint ?? receipt;

  function changeQuantity(id: string, delta: number) {
    setState((current) => {
      if (!current || current.receipt) return current;
      const previous = current.cart[id];
      const quantity = Number.isSafeInteger(previous) && previous >= 0 && previous <= 99 ? previous : 0;
      return { ...current, cart: { ...current.cart, [id]: Math.min(99, Math.max(current.kitchenSent[id] || 0, quantity + delta)) } };
    });
  }

  function issue() {
    const id = `DEMO-${crypto.randomUUID()}`;
    setState((current) => current && !current.receipt
      ? { ...current, receipt: { id, lines, location: state?.location ?? "Takeaway", discount, payments: [] } }
      : current);
  }

  function recordPayment(mode: Payment["mode"]) {
    setState((current) => {
      if (!current?.receipt || !(paymentAmount > 0 && paymentAmount <= due(current.receipt))) return current;
      const updated = { ...current.receipt, payments: [...current.receipt.payments, { mode, amount: paymentAmount }] };
      return { ...current, receipt: updated };
    });
    setPaymentText("");
  }

  return (
    <main className={styles.pos}>
      <header>
        <h1>{config.title} POS</h1>
        <p>DEMO · Sample bills and payments</p>
        {storageError && <p role="status">Browser storage unavailable. Reloading may clear this sale.</p>}
      </header>
      {preview ? <>
        <article className={styles.receipt}>
          <h2>DEMO receipt</h2>
          <p>{config.title} · {preview.location}</p>
          <p>{preview.id}</p>
          <ul>{preview.lines.map((line) =>
            <li key={line.id}>{line.quantity} × {line.name} · {money(line.price_paise)} each</li>)}</ul>
          <p>Discount {money(preview.discount)}</p>
          <p><strong>Total {money(subtotal(preview.lines) - preview.discount)}</strong></p>
          {preview.payments.map((payment, index) =>
            <p key={index}>{payment.mode} sample payment {money(payment.amount)}</p>)}
          <p>Balance due {money(due(preview))}</p>
        </article>
        <div className={styles.controls}>
          {receipt && !reprint && due(receipt) > 0 && <>
            <label>Sample payment amount <input inputMode="decimal" value={paymentText} onChange={(event) => setPaymentText(event.target.value)} /></label>
            <button disabled={!(paymentAmount > 0 && paymentAmount <= due(receipt))} onClick={() => recordPayment("Cash")}>Record cash</button>
            <button disabled={!(paymentAmount > 0 && paymentAmount <= due(receipt))} onClick={() => recordPayment("UPI")}>Record sample UPI</button>
          </>}
          <button onClick={() => window.print()}>Print receipt</button>
          {reprint ? <button onClick={() => setReprint(null)}>Back to POS</button> :
            <button onClick={() => {
              setState((current) => current?.receipt ? { ...empty, history: [...current.history, current.receipt] } : current);
              setDiscountText("");
              setPaymentText("");
              setTicket(null);
              setNote("");
            }}>New sale</button>}
        </div>
      </> : <div className={styles.columns}>
        <section>
          <h2>Menu</h2>
          <label>Order location <select disabled={Object.keys(state.kitchenSent).length > 0} value={state.location} onChange={(event) => {
            const location = event.target.value;
            setState((current) => current && { ...current, location });
          }}>
            {["Takeaway", ...config.tables].map((location) => <option key={location}>{location}</option>)}
          </select></label>
          <ul>{config.menu.map((item) =>
            <li key={item.id}>
              <button disabled={!item.available} onClick={() => changeQuantity(item.id, 1)}>
                {item.name} · {money(item.price_paise)}{!item.available && " · Sold out"}
              </button>
            </li>)}</ul>
        </section>
        <section>
          <h2>Cart</h2>
          {lines.length === 0 && <p>Select a menu item.</p>}
          <ul>{lines.map((line) =>
            <li key={line.id}>{line.quantity} × {line.name} · {money(line.quantity * line.price_paise)}{" "}
              <button aria-label={`Remove one ${line.name}`} onClick={() => changeQuantity(line.id, -1)}>−</button>
            </li>)}</ul>
          {state.location !== "Takeaway" && <div>
            <label>Kitchen note <input maxLength={120} value={note} onChange={(event) => setNote(event.target.value)} /></label>
            <button disabled={!kitchenLines.length} onClick={() => {
              setTicket({ location: state.location, lines: kitchenLines, note });
              setState((current) => current && { ...current, kitchenSent: Object.fromEntries(lines.map((line) => [line.id, line.quantity])) });
              setNote("");
            }}>Send new items to kitchen</button>
            {ticket && <div>
              <h3>Latest KOT · {ticket.location}</h3>
              <ul>{ticket.lines.map((line) => <li key={line.id}>{line.quantity} × {line.name}</li>)}</ul>
              {ticket.note && <p>{ticket.note}</p>}
            </div>}
          </div>}
          <p>Subtotal {money(total)}</p>
          <label>Discount <input inputMode="decimal" value={discountText} onChange={(event) => setDiscountText(event.target.value)} /></label>
          <p>Payable {discount >= 0 && discount <= total ? money(total - discount) : "Check discount amount"}</p>
          <button disabled={!lines.length || !(discount >= 0 && discount <= total)} onClick={issue}>Issue demo bill</button>
        </section>
      </div>}
      <section className={styles.closing}>
        <h2>Demo cash closing</h2>
        <p>Cash {money(cash)} · UPI {money(upi)} · Due {money(sales.reduce((sum, bill) => sum + due(bill), 0))}</p>
        <label>Opening cash <input inputMode="decimal" value={opening} onChange={(event) => setOpening(event.target.value)} /></label>{" "}
        <label>Counted cash <input inputMode="decimal" value={counted} onChange={(event) => setCounted(event.target.value)} /></label>
        <p>Expected drawer {Number.isFinite(expected) ? money(expected) : "Check opening cash"}</p>
        {Number.isFinite(parseMoney(counted) - expected) && <p>Variance {money(parseMoney(counted) - expected)}</p>}
        {!!state.history.length && <ul>{state.history.map((bill) =>
          <li key={bill.id}><button onClick={() => setReprint(bill)}>Reprint {bill.id}</button></li>)}</ul>}
        <button onClick={() => {
          if (!window.confirm("Clear all sample bills and the current cart on this browser?")) return;
          setState(empty);
          setReprint(null);
          setTicket(null);
          setNote("");
          setDiscountText("");
          setPaymentText("");
          setOpening("0");
          setCounted("");
        }}>Reset demo data</button>
      </section>
    </main>
  );
}
