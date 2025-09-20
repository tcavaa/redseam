import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { register as registerRequest } from '../api/auth';

const schema = z
  .object({
    username: z.string().min(3, 'Min 3 characters'),
    email: z.string().min(3, 'Min 3 characters').email('Invalid email'),
    password: z.string().min(3, 'Min 3 characters'),
    confirmPassword: z.string().min(3, 'Min 3 characters'),
    avatar: z.any().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const [apiError, setApiError] = useState('');

  const avatarFile = watch('avatar');

const avatarPreview = useMemo(() => {
  if (!avatarFile || avatarFile.length === 0) return null;
  const file = avatarFile[0];
  if (!(file instanceof File)) return null;
  return URL.createObjectURL(file);
}, [avatarFile]);

useEffect(() => {
  return () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  };
}, [avatarPreview]);

  async function onSubmit(values) {
    setApiError('');
    try {
      await registerRequest({
        username: values.username,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
        avatar: Array.isArray(values.avatar) ? values.avatar[0] : values.avatar,
      });
      navigate('/products');
    } catch (err) {
      const message = err?.message || 'Registration failed';
      setApiError(message);
      const fieldErrors = err?.errors || {};
      Object.entries(fieldErrors).forEach(([key, msgs]) => {
        const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
        const map = {
          password_confirmation: 'confirmPassword',
        };
        const formKey = map[key] || key;
        if (['username', 'email', 'password', 'confirmPassword', 'avatar'].includes(formKey)) {
          setError(formKey, { type: 'server', message: msg });
        }
      });
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-hero" />
      <div className="auth-panel">
        <h1 className="auth-title">Registration</h1>
        <div className="avatar-upload">
          <div className="avatar" style={avatarPreview ? { backgroundImage: `url(${avatarPreview})` } : {}} />
          <label className="avatar-actions">
            <input type="file" accept="image/*" {...register('avatar')} hidden />
            <span>Upload new</span>
          </label>
          {avatarPreview && (
    <button
      type="button"
      className="link"
      onClick={() => setValue('avatar', null)}
    >
      Remove
    </button>
  )}
        </div>
        {apiError ? <p className="error-text" style={{ marginBottom: 8 }}>{apiError}</p> : null}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input name="username" label="Username" register={register} error={errors.username?.message} required />
          <Input name="email" label="Email" register={register} error={errors.email?.message} required />
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            register={register}
            error={errors.password?.message}
            required
            rightIcon={<span role="img" aria-label="toggle">👁️</span>}
            onRightIconClick={() => setShowPassword(s => !s)}
          />
          <Input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            label="Confirm password"
            register={register}
            error={errors.confirmPassword?.message}
            required
            rightIcon={<span role="img" aria-label="toggle">👁️</span>}
            onRightIconClick={() => setShowConfirm(s => !s)}
          />
          <Button type="submit" disabled={isSubmitting}>Register</Button>
          <p className="auth-alt">Already member? <a href="/login">Log in</a></p>
        </form>
      </div>
    </div>
  );
}


