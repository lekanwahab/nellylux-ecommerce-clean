export function openWhatsAppCheckout({ items, customer }) {
  const phone = process.env.NEXT_PUBLIC_WA_PHONE;
  const brand = process.env.NEXT_PUBLIC_BRAND || "Nelly Lux";
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

  const lines = [];
  lines.push(`Hello ${brand}, I want to place an order:`);
  lines.push("");

  items.forEach((i) => {
    lines.push(`• ${i.name} x${i.qty} — ${currency}${(i.price * i.qty).toFixed(2)}`);
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  lines.push("");
  lines.push(`Total: ${currency}${total.toFixed(2)}`);
  lines.push("");
  lines.push("Customer details:");
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push(`City/State: ${customer.location}`);
  lines.push(`Delivery: ${customer.delivery}`);
  if (customer.note) lines.push(`Note: ${customer.note}`);

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${phone}?text=${text}`;
  window.open(url, "_blank");
}

