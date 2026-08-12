import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '@/pages/login/ui/RegisterPage';

export const Route = createFileRoute('/account/register')({
    component: RegisterPage,
})
