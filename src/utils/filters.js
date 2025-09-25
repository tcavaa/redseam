export function sanitizeNumberInput(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function isPriceRangeInvalid(fromStr, toStr) {
  if (!fromStr || !toStr) return false;
  const from = Number(fromStr);
  const to = Number(toStr);
  if (Number.isNaN(from) || Number.isNaN(to)) return true;
  return from > to;
}


