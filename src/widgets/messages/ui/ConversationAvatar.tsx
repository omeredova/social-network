import type { MessageSender } from '@/entities/message';
import { getInitials } from '@/shared/lib/getInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface ConversationAvatarProps {
  readonly participant: MessageSender
  readonly className?: string
}

export function ConversationAvatar({
  participant,
  className,
}: ConversationAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={participant.photoUrl} alt={participant.name} />
      <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
    </Avatar>
  )
}