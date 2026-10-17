export interface Product {
  name: string;
  price: number; // in dollars
}

/** Converts "$29.99" / "Total: $32.39" to cents (integer) to avoid float errors. */
export function toCents(text: string): number {
  const m = text.match(/(\d+(?:\.\d+)?)/);
  if (!m) throw new Error(`No amount found in "${text}"`);
  return Math.round(parseFloat(m[1]) * 100);
}
