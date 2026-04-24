export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
