import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/cn';
import type { AuthFieldErrors } from '../model/authCredentials';

interface AuthCredentialsFieldsProps {
  idPrefix: 'login' | 'register';
  passwordAutoComplete: 'current-password' | 'new-password';
  errors: AuthFieldErrors;
}

export function AuthCredentialsFields({
  idPrefix,
  passwordAutoComplete,
  errors,
}: AuthCredentialsFieldsProps) {
  const emailErrorId = `${idPrefix}-email-error`
  const passwordErrorId = `${idPrefix}-password-error`

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="m@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? emailErrorId : undefined}
          className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
        />
        {errors.email ? (
          <p id={emailErrorId} className="text-sm text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-password`}>Password</Label>
        <Input
          id={`${idPrefix}-password`}
          name="password"
          type="password"
          autoComplete={passwordAutoComplete}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? passwordErrorId : undefined}
          className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
        />
        {errors.password ? (
          <p id={passwordErrorId} className="text-sm text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>
    </>
  )
}