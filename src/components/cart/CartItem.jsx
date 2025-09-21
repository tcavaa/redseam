import React from 'react';
import { useCartContext } from '../../hooks/useCart.jsx';

export default function CartItem({ item }) {
  const { increment, decrement, remove } = useCartContext();
  const qty = item.quantity || 1;
  return (
    <li className="cart-item">
      <div className="thumb"><img src={item.cover_image || item.image} alt={item.name} /></div>
      <div className="meta">
        <div className="name">{item.name}</div>
        <div className="attrs">
          {item.color ? <span>{item.color}</span> : null}
          {item.size ? <span>{item.size}</span> : null}
        </div>
        <div className="qty">
          <button onClick={() => decrement(item.id, qty)}>−</button>
          <span>{qty}</span>
          <button onClick={() => increment(item.id, qty)}>+</button>
        </div>
      </div>
      <div className="price">$ {item.price}</div>
      <button className="remove" onClick={() => remove(item.id)}>Remove</button>
    </li>
  );
}

