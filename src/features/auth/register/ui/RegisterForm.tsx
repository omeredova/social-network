import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  validateAuthCredentials,
  validatePasswordConfirmation,
  type AuthFieldErrors,
} from '../../model/authCredentials';
import { AuthCredentialsFields } from '../../ui/AuthCredentialsFields';
import { AuthFormCard } from '../../ui/AuthFormCard';
import { getRegistrationError } from '../model/getRegistrationError';
import { useRegister } from '../model/useRegister';

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [validationErrors, setValidationErrors] = useState<AuthFieldErrors>({})

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    registerMutation.reset()
    setValidationErrors({})

    const formData = new FormData(event.currentTarget)
    const result = validateAuthCredentials(formData)
    const passwordConfirmationError = validatePasswordConfirmation(formData)

    if (!result.credentials || passwordConfirmationError) {
      setValidationErrors({
        ...result.errors,
        ...(passwordConfirmationError
          ? { passwordConfirmation: passwordConfirmationError }
          : {}),
      })
      return
    }

    try {
      await registerMutation.mutateAsync(result.credentials)
    } catch {
      return
    }

    await navigate({ to: '/' })
  }

  const responseError = registerMutation.isError
    ? getRegistrationError(registerMutation.error)
    : null
  const fieldErrors = {
    ...validationErrors,
    ...responseError?.fieldErrors,
  }
  const confirmationErrorId = 'register-password-confirmation-error'

  return (
    <AuthFormCard
      title="Register your account"
      description="Create your account in less than a minute"
      errorMessage={responseError?.message ?? null}
      isPending={registerMutation.isPending}
      submitLabel="Register"
      pendingLabel="Creating account…"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <AuthCredentialsFields
        idPrefix="register"
        passwordAutoComplete="new-password"
        errors={fieldErrors}
      />
      <div className="grid gap-2">
        <Label htmlFor="register-password-confirmation">Confirm password</Label>
        <Input
          id="register-password-confirmation"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors.passwordConfirmation)}
          aria-describedby={
            fieldErrors.passwordConfirmation ? confirmationErrorId : undefined
          }
          className={
            fieldErrors.passwordConfirmation
              ? 'border-destructive focus-visible:ring-destructive'
              : undefined
          }
        />
        {fieldErrors.passwordConfirmation ? (
          <p id={confirmationErrorId} className="text-sm text-destructive">
            {fieldErrors.passwordConfirmation}
          </p>
        ) : null}
      </div>
    </AuthFormCard>
  )
}