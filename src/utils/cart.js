// Utility helpers for cart management (JavaScript port inspired by TS version)

export const STORAGE_KEYS = {
  CART_ITEMS: 'CART_ITEMS',
};

// Compare two cart items by attributes relevant for grouping (e.g., color + size)
export function areItemAttributesEqual(itemA, itemB) {
  const colorA = (itemA?.color || '').toString();
  const colorB = (itemB?.color || '').toString();
  const sizeA = (itemA?.size || '').toString();
  const sizeB = (itemB?.size || '').toString();
  return itemA.id === itemB.id && colorA === colorB && sizeA === sizeB;
}

// Find an item by product id + attributes
export function findCartItem(items, productId, { color, size }) {
  return items.find(
    it => it.id === productId && (it.color || '') === (color || '') && (it.size || '') === (size || ''),
  );
}

// Calculate subtotal (sum of price * quantity)
export function calculateCartSubtotal(items) {
  return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
}

// Calculate total quantity
export function calculateTotalCartQuantity(items) {
  return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
}

// Convert attributes to order payload shape
export function createOrderAttributes({ color, size }) {
  const obj = {};
  if (color) obj.color = color;
  if (size) obj.size = size;
  return obj;
}

