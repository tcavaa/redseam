import React, { useMemo, useState } from 'react';
import { useCartContext } from '../hooks/useCart.jsx';
import Button from '../components/ui/Button';
import '../styles/Checkout.css';
import { checkout as apiCheckout } from '../api/cart';
import SuccessModal from '../components/ui/SuccessModal.jsx';

export default function CheckoutPage() {
  const { items, subtotal, increment, decrement, remove, refresh } = useCartContext();
  const delivery = items.length ? 5 : 0;
  const total = subtotal + delivery;

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: storedUser?.email || '',
    address: '',
    zipCode: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiCheckout({
        email: form.email,
        name: form.name,
        surname: form.surname,
        zipCode: form.zipCode,
        address: form.address,
      });
      setSuccess(true);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-form">
          <div className="panel">
            <h3>Order details</h3>
            <form onSubmit={onSubmit} className="form-grid">
              <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
              <input name="surname" placeholder="Surname" value={form.surname} onChange={onChange} required />
              <input name="email" placeholder="Email" value={form.email} onChange={onChange} type="email" required />
              <input name="address" placeholder="Address" value={form.address} onChange={onChange} required />
              <input name="zipCode" placeholder="Zip code" value={form.zipCode} onChange={onChange} required />
              <div className="spacer" />
            </form>
          </div>
        </div>

        <div className="checkout-summary">
          <ul className="summary-list">
            {items.map(item => (
              <li key={item.id} className="summary-item">
                <div className="thumb"><img src={item.cover_image || item.image} alt={item.name} /></div>
                <div className="info">
                  <div className="name">{item.name}</div>
                  <div className="attrs">
                    {item.color ? <span>{item.color}</span> : null}
                    {item.size ? <span>{item.size}</span> : null}
                  </div>
                  <div className="qty">
                    <button onClick={() => decrement(item.id, item.quantity || 1)}>−</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increment(item.id, item.quantity || 1)}>+</button>
                  </div>
                </div>
                <div className="price">${item.price}</div>
                <button className="remove" onClick={() => remove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <div className="totals">
            <div className="row"><span>Items subtotal</span><span>${subtotal}</span></div>
            <div className="row"><span>Delivery</span><span>${delivery}</span></div>
            <div className="row total"><span>Total</span><span>${total}</span></div>
            <Button disabled={submitting} onClick={onSubmit}>Pay</Button>
          </div>
        </div>
      </div>

      <SuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        onContinue={() => setSuccess(false)}
      />
    </div>
  );
}


