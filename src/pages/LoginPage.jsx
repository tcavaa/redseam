import React, { useCallback, Suspense, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye } from '../components/ui';
import { useAuth } from '../hooks/useAuth.jsx';
import { ROUTES } from '../constants';
import Loading from '../components/ui/Loading';
import { useToggle } from '../hooks/useToggle';

const AuthLayout = React.lazy(() => import('../components/layout/AuthLayout.jsx'));

const schema = z.object({
  email: z.string().min(3, 'Email must be at least 3 characters').email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { value: showPassword, toggle: togglePassword } = useToggle(false);
  const [apiError, setApiError] = React.useState('');
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = useCallback(async (values) => {
    setApiError('');
    try {
      await login(values);
      startTransition(() => {
        navigate(ROUTES.PRODUCTS);
      });
    } catch (err) {
      setApiError('Email and/or password is incorrect');
    }
  }, [login, navigate, startTransition]);

  return (
    <Suspense fallback={<Loading label="Loading page..." />}>
      <AuthLayout
        title="Log in"
        footer={<p className="auth-alt">Not a member? <Link to={ROUTES.REGISTER}>Register</Link></p>}
      >
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
            rightIcon={<span role="img" aria-label="toggle"><img src={Eye} alt={showPassword ? 'Hide password' : 'Show password'} /></span>}
            onRightIconClick={togglePassword}
          />
          <Button className="btn btn-primary btn-auth" type="submit" disabled={isSubmitting || isPending}>
            Log in
          </Button>
        </form>
      </AuthLayout>
    </Suspense>
  );
}


