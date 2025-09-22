export function colorNameToHex(name) {
  if (!name) return '#e6e6e6';
  const n = String(name).trim().toLowerCase();
  const map = {
    black: '#000000',
    white: '#f0efeb',
    'navy blue': '#1f2a44',
    navy: '#001f3f',
    blue: '#1976d2',
    green: '#2e7d32',
    red: '#d32f2f',
    yellow: '#fbc02d',
    beige: '#f5f0e1',
    brown: '#8d6e63',
    purple: '#7b1fa2',
    peach: '#ffe5b4',
    lavender: '#c3b1e1',
    pink: '#ec407a',
    'baby pink': '#f1d9df',
    orange: '#fb8c00',
    gray: '#9e9e9e',
    grey: '#9e9e9e',
  };
  return map[n] || (CSS.supports('color', name) ? name : '#e6e6e6');
}

export function mapImagesAndColors(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length && typeof product.images[0] === 'object') {
    return product.images.map(it => ({
      url: it.url || it.src || it.image || it,
      color: it.color || { name: it.color_name, hex: it.color_hex },
    }));
  }
  if (Array.isArray(product.images) && Array.isArray(product.available_colors) && product.available_colors.length) {
    const imgs = product.images;
    const cols = product.available_colors;
    const len = Math.min(imgs.length, cols.length);
    const list = [];
    for (let i = 0; i < len; i++) list.push({ url: imgs[i], color: { name: cols[i], hex: colorNameToHex(cols[i]) } });
    return list;
  }
  const imgs = product.images || (product.cover_image ? [product.cover_image] : []);
  return imgs.map((url, idx) => ({ url, color: { name: `Image ${idx + 1}`, hex: '#eee' } }));
}


