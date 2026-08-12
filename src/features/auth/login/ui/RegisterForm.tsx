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

export function RegisterForm() {
  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-center">Register to your account</CardTitle>
            <CardDescription className="text-center text-login-txt">
                Don't have an account? Create your account, it takes less than a minute
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name"
                            type="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Confirm Password</Label>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full">
                Register
            </Button>
        </CardFooter>
    </Card>
  )
}