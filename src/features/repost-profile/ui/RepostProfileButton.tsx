import { Repeat2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { StatusMessage } from '@/shared/ui/status-message'
import { useRepostProfile } from '../model/useRepostProfile'

interface RepostProfileButtonProps {
  readonly profileId: string
  readonly userId: string
  readonly className?: string
}

export function RepostProfileButton({
  profileId,
  userId,
  className,
}: RepostProfileButtonProps) {
  const repostProfile = useRepostProfile()

  return (
    <div>
      <Button
        type="button"
        variant="postAction"
        className={className}
        disabled={repostProfile.isPending}
        onClick={() => {
          repostProfile.mutate({ profileId, userId })
        }}
      >
        <Repeat2 aria-hidden="true" />
        {repostProfile.isPending ? 'Reposting…' : 'Repost'}
      </Button>
      {repostProfile.isError ? (
        <StatusMessage tone="destructive" className="mt-3">
          {repostProfile.error.message}
        </StatusMessage>
      ) : null}
      {repostProfile.isSuccess ? (
        <StatusMessage className="mt-3">Profile reposted.</StatusMessage>
      ) : null}
    </div>
  )
}
