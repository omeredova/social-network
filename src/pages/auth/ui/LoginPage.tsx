import { Link } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/login';
import { AuthPageLayout } from './AuthPageLayout';

export function LoginPage() {
  return (
    <AuthPageLayout
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/account/register" className="font-bold">
            Register!
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthPageLayout>
  )
}