import { LoginForm } from '@/features/auth/login/ui/LoginForm'
import { Link } from '@tanstack/react-router'
import { AuthPageLayout } from './AuthPageLayout'

export function LoginPage() {
  return (
    <AuthPageLayout
      footer={
        <>
          Don't have an account?{' '}
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
