import { Link } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface MessageUserLinkProps {
  readonly profileId: string
  readonly className?: string
}

export function MessageUserLink({
  profileId,
  className,
}: MessageUserLinkProps) {
  return (
    <Button asChild variant="postAction" className={className}>
      <Link to="/messages" search={{ userId: profileId }}>
        <MessageCircle aria-hidden="true" />
        Message
      </Link>
    </Button>
  )
}