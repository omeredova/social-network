import { createFileRoute } from '@tanstack/react-router';
import { ProfileRoute } from '@/pages/profile';

export const Route = createFileRoute('/profile/$profileId')({
    component: ProfileRoute,
})