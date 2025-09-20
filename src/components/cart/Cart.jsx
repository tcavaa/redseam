import React from 'react';
import { useCartContext } from '../../hooks/useCart.jsx';
import CartItem from './CartItem';
import '../../styles/Cart.css';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, open, setOpen, subtotal, loading } = useCartContext();
  const navigate = useNavigate();
  const delivery = 5;
  const total = subtotal + (items.length ? delivery : 0);

  return (
    <aside className={`cart-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal>
      <div className="cart-header">
        <h2>Shopping cart ({items.length})</h2>
        <button className="close" onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="cart-body">
        {loading ? (
          <div className="cart-empty">Loading...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <p>Uh-oh, you've got nothing in your cart just yet!</p>
            <Button onClick={() => setOpen(false)}>Start shopping</Button>
          </div>
        ) : (
          <ul className="cart-list">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
      <div className="cart-footer">
        <div className="row">
          <span>Items subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="row">
          <span>Delivery</span>
          <span>${items.length ? delivery : 0}</span>
        </div>
        <div className="total">
          <span>Total</span>
          <span>${total}</span>
        </div>
        <Button onClick={() => { setOpen(false); navigate('/checkout'); }}>Go to checkout</Button>
      </div>
    </aside>
  );
}

