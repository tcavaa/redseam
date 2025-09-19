import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { login } from '../api/auth';

const schema = z.object({
  email: z.string().min(3, 'Email must be at least 3 characters').email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    await login(values);
    // TODO: navigate to products
  }

  return (
    <div className="auth-layout">
      <div className="auth-hero" />
      <div className="auth-panel">
        <h1 className="auth-title">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input
            name="email"
            label="Email"
            placeholder="Enter your email"
            register={register}
            error={errors.email?.message}
            required
          />
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            register={register}
            error={errors.password?.message}
            required
            rightIcon={<span role="img" aria-label="toggle">👁️</span>}
            onRightIconClick={() => setShowPassword(s => !s)}
          />
          <Button type="submit" disabled={isSubmitting}>
            Log in
          </Button>
          <p className="auth-alt">Not a member? <a href="/register">Register</a></p>
        </form>
      </div>
    </div>
  );
}


