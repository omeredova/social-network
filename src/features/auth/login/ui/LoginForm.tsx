import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-center">Login to your account</CardTitle>
            <CardDescription className="text-center text-login-txt">
                Enter your username and password to access your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full">
                Login
            </Button>
        </CardFooter>
    </Card>
  )
}