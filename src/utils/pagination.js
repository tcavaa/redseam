export function parsePageFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.searchParams.get('page');
    return p ? Number(p) : undefined;
  } catch (_) {
    return undefined;
  }
}

export function buildPagination(current, total) {
  const pages = [];
  if (!total || total <= 1) return [1];
  const add = p => pages.push(p);
  add(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p++) add(p);
  if (end < total - 1) pages.push('...');
  if (total > 1) add(total);
  return pages;
}


