import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye } from '../components/ui';
import { login } from '../api/auth';
import { ROUTES } from '../constants';

const schema = z.object({
  email: z.string().min(3, 'Email must be at least 3 characters').email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setApiError('');
    try {
      await login(values);
      navigate(ROUTES.PRODUCTS);
    } catch (err) {
      setApiError('Email and/or password is incorrect');
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-hero" />
      <div className="auth-panel">
        <h1 className="auth-title">Log in</h1>
        {apiError ? <p className="error-text" style={{ marginBottom: 8 }}>{apiError}</p> : null}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input
            name="email"
            label="Email"
            register={register}
            error={errors.email?.message}
            required
          />
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            register={register}
            error={errors.password?.message}
            required
            rightIcon={<span role="img" aria-label="toggle"><img src={Eye} alt="Eye" /></span>}
            onRightIconClick={() => setShowPassword(s => !s)}
          />
          <Button className="btn btn-primary btn-auth" type="submit" disabled={isSubmitting}>
            Log in
          </Button>
          <p className="auth-alt">Not a member? <a href={ROUTES.REGISTER}>Register</a></p>
        </form>
      </div>
    </div>
  );
}


