export const normalizeColor = c => (c ? String(c).trim().toLowerCase() : '');
export const normalizeSize = s => (s ? String(s).trim().toUpperCase() : '');

export function isSameVariant(a, b) {
  return (
    a.id === b.id &&
    normalizeColor(a.color) === normalizeColor(b.color) &&
    normalizeSize(a.size) === normalizeSize(b.size)
  );
}


