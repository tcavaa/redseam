import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye } from '../components/ui';
import AvatarUploader from '../components/auth/AvatarUploader.jsx';
import { useFilePreview } from '../hooks/useFilePreview';
import { register as registerRequest } from '../api/auth';
import { ROUTES } from '../constants';

const schema = z
  .object({
    username: z.string().trim().min(3, 'Min 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(3, 'Min 3 characters'),
    confirmPassword: z.string().min(3, 'Min 3 characters'),
    avatar: z
      .any()
      .refine(
        (fileList) => {
          if (!fileList || fileList.length === 0) return true; // optional
          const file = fileList[0];
          return file.size <= 1024 * 1024; // <= 1MB
        },
        { message: 'Image must be 1MB or smaller' }
      )
      .refine(
        (fileList) => {
          if (!fileList || fileList.length === 0) return true; // optional
          const file = fileList[0];
          return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
        },
        { message: 'Only JPG, PNG, WebP, or GIF images are allowed' }
      )
      .optional(),
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
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const [apiError, setApiError] = useState('');

  const avatarFile = watch('avatar');
  const avatarPreview = useFilePreview(avatarFile);

  const avatarRegister = register('avatar', {
    validate: fileList => {
      if (!fileList || fileList.length === 0) return true;
      const file = fileList[0];
      return file.size <= 1024 * 1024 || 'Image must be 1MB or smaller';
    },
  });

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
      navigate(ROUTES.PRODUCTS);
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
      <div className="auth-panel auth-panel-register">
        <h1 className="auth-title">Registration</h1>
        <AvatarUploader
          fileList={avatarFile}
          registerProps={avatarRegister}
          onRemove={() => { setValue('avatar', null); clearErrors('avatar'); }}
          error={errors.avatar?.message}
        />
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
            rightIcon={<span role="img" aria-label="toggle"><img src={Eye} alt="Eye" /></span>}
            onRightIconClick={() => setShowPassword(s => !s)}
          />
          <Input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            label="Confirm password"
            register={register}
            error={errors.confirmPassword?.message}
            required
            rightIcon={<span role="img" aria-label="toggle"><img src={Eye} alt="Eye" /></span>}
            onRightIconClick={() => setShowConfirm(s => !s)}
          />
          <Button className="btn btn-primary btn-auth" type="submit" disabled={isSubmitting}>Register</Button>
          <p className="auth-alt">Already member? <Link to={ROUTES.LOGIN}>Log in</Link></p>
        </form>
      </div>
    </div>
  );
}


