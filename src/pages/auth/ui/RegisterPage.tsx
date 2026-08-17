import { Link } from '@tanstack/react-router';
import { RegisterForm } from '@/features/auth/register';
import { AuthPageLayout } from './AuthPageLayout';

export function RegisterPage() {
  return (
    <AuthPageLayout
      footer={
        <>
          Already have an account?{' '}
          <Link to="/account/login" className="font-bold">
            Log In!
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthPageLayout>
  )
}