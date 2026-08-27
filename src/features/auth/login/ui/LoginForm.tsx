import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  validateAuthCredentials,
  type AuthFieldErrors,
} from '../../model/authCredentials';
import { AuthCredentialsFields } from '../../ui/AuthCredentialsFields';
import { AuthFormCard } from '../../ui/AuthFormCard';
import { getLoginError } from '../model/getLoginError';
import { useLogin } from '../model/useLogin';

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [validationErrors, setValidationErrors] = useState<AuthFieldErrors>({})

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    loginMutation.reset()
    setValidationErrors({})

    const result = validateAuthCredentials(new FormData(event.currentTarget))

    if (!result.credentials) {
      setValidationErrors(result.errors)
      return
    }

    try {
      await loginMutation.mutateAsync(result.credentials)
    } catch {
      return
    }

    await navigate({ to: '/' })
  }

  const responseError = loginMutation.isError
    ? getLoginError(loginMutation.error)
    : null
  const fieldErrors = {
    ...validationErrors,
    ...responseError?.fieldErrors,
  }

  return (
    <AuthFormCard
      title="Login to your account"
      description="Enter your email and password to access your account"
      errorMessage={responseError?.message ?? null}
      isPending={loginMutation.isPending}
      submitLabel="Login"
      pendingLabel="Logging in…"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <AuthCredentialsFields
        idPrefix="login"
        passwordAutoComplete="current-password"
        errors={fieldErrors}
      />
    </AuthFormCard>
  )
}