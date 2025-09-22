import React from 'react';

export default function OrderTotals({ subtotal, delivery, onCheckout, disabled }) {
  const total = subtotal + (delivery || 0);
  return (
    <div className="cart-footer">
      <div className="row"><span>Items subtotal</span><span>$ {subtotal}</span></div>
      <div className="row"><span>Delivery</span><span>$ {delivery}</span></div>
      <div className="total"><span>Total</span><span>$ {total}</span></div>
      {onCheckout ? <button className="btn btn-primary btn-cart-checkout" disabled={disabled} onClick={onCheckout}>Go to checkout</button> : null}
    </div>
  );
}


