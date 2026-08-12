import { RegisterForm } from '@/features/auth/login/ui/RegisterForm'
import { Link } from '@tanstack/react-router'
import { AuthPageLayout } from './AuthPageLayout'

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