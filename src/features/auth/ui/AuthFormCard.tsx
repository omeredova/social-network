import type { ReactNode, SyntheticEvent } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  errorMessage: string | null;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export function AuthFormCard({
  title,
  description,
  children,
  errorMessage,
  isPending,
  submitLabel,
  pendingLabel,
  onSubmit,
}: AuthFormCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <form noValidate onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center text-login-txt">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">{children}</div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}