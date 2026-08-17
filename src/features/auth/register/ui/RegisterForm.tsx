import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function RegisterForm() {
  return (
    <Card className="w-full max-w-sm">
      <form>
        <CardHeader>
          <CardTitle className="text-center">Register your account</CardTitle>
          <CardDescription className="text-center text-login-txt">
            Create your account in less than a minute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="register-name">Full name</Label>
              <Input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password-confirmation">
                Confirm password
              </Label>
              <Input
                id="register-password-confirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" variant="outline" className="w-full">
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}