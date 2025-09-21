import React, { useMemo, useState } from 'react';
import { useCartContext } from '../hooks/useCart.jsx';
import { UI } from '../constants';
import Button from '../components/ui/Button';
import '../styles/Checkout.css';
import { checkout as apiCheckout } from '../api/cart';
import SuccessModal from '../components/ui/SuccessModal.jsx';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
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
    zipCode: z.string().trim().min(3, 'Zip code is required'),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
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

  async function onSubmit(values) {
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
            <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
              <div className="field">
                <input className="checkout-input" placeholder="Name" {...register('name')} />
                {errors.name?.message ? <p className="error-text">{errors.name.message}</p> : null}
              </div>
              <div className="field">
                <input className="checkout-input" placeholder="Surname" {...register('surname')} />
                {errors.surname?.message ? <p className="error-text">{errors.surname.message}</p> : null}
              </div>
              <div className="field field-span2">
                <div className="input-with-icon">
                  <span className="left-icon"><img src={Envelope} alt="Email" /></span>
                  <input className="checkout-input has-icon" placeholder="Email" type="email" {...register('email')} />
                </div>
                {errors.email?.message ? <p className="error-text">{errors.email.message}</p> : null}
              </div>
              <div className="field">
                <input className="checkout-input" placeholder="Address" {...register('address')} />
                {errors.address?.message ? <p className="error-text">{errors.address.message}</p> : null}
              </div>
              <div className="field">
                <input className="checkout-input" placeholder="Zip code" {...register('zipCode')} />
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

          <div className="cart-footer">
            <div className="row">
              <span>Items subtotal</span>
              <span>$ {subtotal}</span>
            </div>
            <div className="row">
              <span>Delivery</span>
              <span>$ {items.length ? delivery : 0}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>$ {total}</span>
            </div>
            <Button className="btn btn-primary btn-cart-checkout" disabled={submitting || isSubmitting} onClick={handleSubmit(onSubmit)}>Pay</Button>
          </div>
        </div>
      </div>

      <SuccessModal open={success} onClose={() => setSuccess(false)} onContinue={() => { setSuccess(false); navigate('/products'); }} />
    </div>
  );
}


