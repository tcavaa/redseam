import React, { useMemo, useState } from 'react';
import { useCartContext } from '../hooks/useCart.jsx';
import { UI } from '../constants';
import Button from '../components/ui/Button';
import '../styles/Checkout.css';
import { checkout as apiCheckout } from '../api/cart';
import SuccessModal from '../components/ui/SuccessModal.jsx';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
import OrderTotals from '../components/cart/OrderTotals.jsx';
import { Envelope } from '../components/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CheckoutPage() {
  const { items, subtotal, increment, decrement, remove, refresh } = useCartContext();
  const navigate = useNavigate();
  const delivery = items.length ? UI.DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  const schema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    surname: z.string().trim().min(1, 'Surname is required'),
    email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
    address: z.string().trim().min(1, 'Address is required'),
    zipCode: z
      .string()
      .trim()
      .min(1, 'Zip code is required')
      .regex(/^\d+$/, 'Zip code must be numbers only'),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      surname: '',
      email: storedUser?.email || '',
      address: '',
      zipCode: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [topError, setTopError] = useState('');

  async function onSubmit(values) {
    if (items.length === 0) {
      setTopError('Cart empty — nothing to checkout.');
      return;
    }
    setSubmitting(true);
    try {
      await apiCheckout({
        email: values.email,
        name: values.name,
        surname: values.surname,
        zipCode: values.zipCode,
        address: values.address,
      });
      setSuccess(true);
      await refresh();
      // Clear the form – keep email prefilled from stored user
      reset({ name: '', surname: '', email: storedUser?.email || '', address: '', zipCode: '' });
      setTopError('');
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
            {topError ? <p className="error-text" style={{ marginTop: 8 }}>{topError}</p> : null}
            <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
              <div className="field">
                <input className={`checkout-input ${errors.name ? 'input-error' : ''}`} placeholder="Name" {...register('name')} />
                {errors.name?.message ? <p className="error-text">{errors.name.message}</p> : null}
              </div>
              <div className="field">
                <input className={`checkout-input ${errors.surname ? 'input-error' : ''}`} placeholder="Surname" {...register('surname')} />
                {errors.surname?.message ? <p className="error-text">{errors.surname.message}</p> : null}
              </div>
              <div className="field field-span2">
                <div className="input-with-icon">
                  <span className="left-icon"><img src={Envelope} alt="Email" /></span>
                  <input className={`checkout-input has-icon ${errors.email ? 'input-error' : ''}`} placeholder="Email" type="email" {...register('email')} />
                </div>
                {errors.email?.message ? <p className="error-text">{errors.email.message}</p> : null}
              </div>
              <div className="field">
                <input className={`checkout-input ${errors.address ? 'input-error' : ''}`} placeholder="Address" {...register('address')} />
                {errors.address?.message ? <p className="error-text">{errors.address.message}</p> : null}
              </div>
              <div className="field">
                <input
                  className={`checkout-input ${errors.zipCode ? 'input-error' : ''}`}
                  placeholder="Zip code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onKeyDown={(e) => {
                    if (["e","E","+","-","."] .includes(e.key)) e.preventDefault();
                  }}
                  {...register('zipCode')}
                />
                {errors.zipCode?.message ? <p className="error-text">{errors.zipCode.message}</p> : null}
              </div>
              <div className="spacer" />
            </form>
          </div>
        </div>

        <div className="checkout-summary">
          <ul className="summary-list">
          {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>

          <OrderTotals
            subtotal={subtotal}
            delivery={delivery}
          />
          <Button className="btn btn-primary btn-cart-checkout" disabled={submitting || isSubmitting} onClick={handleSubmit(onSubmit)}>Pay</Button>
        </div>
      </div>

      <SuccessModal open={success} onClose={() => setSuccess(false)} onContinue={() => { setSuccess(false); navigate('/products'); }} />
    </div>
  );
}


