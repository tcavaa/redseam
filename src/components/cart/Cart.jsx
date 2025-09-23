import React, { useEffect } from 'react';
import { useCartContext } from '../../hooks/useCart.jsx';
import CartItem from './CartItem';
import { EmptyCart } from '../ui';
import '../../styles/Cart.css';
import Button from '../ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderTotals from './OrderTotals.jsx';
import { UI } from '../../constants';
import { ROUTES } from '../../constants';
import Loading from '../ui/Loading.jsx';

export default function Cart() {
  const { items, totalQuantity, open, setOpen, subtotal, loading } = useCartContext();
  const navigate = useNavigate();
  const location = useLocation();
  const delivery = items.length ? UI.DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
    {open ? <div className="cart-backdrop" onClick={() => setOpen(false)} /> : null}
    <aside className={`cart-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal>
      <div className="cart-header">
        <h2>Shopping cart ({totalQuantity})</h2>
        <button className="close" onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="cart-body">
        {loading ? (
          <div className="cart-empty"><Loading /></div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <img src={EmptyCart} alt="Empty cart" />
            <h2>Ooops!</h2>
            <p>You’ve got nothing in your cart just yet...</p>
            <Button className="btn btn-primary btn-cart" onClick={() => setOpen(false)}>Start shopping</Button>
          </div>
        ) : (
          <ul className="cart-list">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
      { items.length > 0 && (
        <OrderTotals
          subtotal={subtotal}
          delivery={delivery}
          onCheckout={() => { setOpen(false); navigate(ROUTES.CHECKOUT); }}
        />
      )}
      
    </aside>
    </>
  );
}

