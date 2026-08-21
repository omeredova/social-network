import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { RepostedProfile } from '../model/types';

interface RepostedProfilePreviewProps {
  readonly profile: RepostedProfile
}

export function RepostedProfilePreview({
  profile,
}: RepostedProfilePreviewProps) {
  return (
    <Link
      to="/profile/$profileId"
      params={{ profileId: profile.id }}
      className="relative z-20 mt-1 flex gap-4 rounded-post-control border border-post-border p-4 transition-colors hover:bg-post-toolbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-post-focus"
      aria-label={`Open ${profile.name}'s profile`}
    >
      <Avatar className="size-14 shrink-0">
        <AvatarImage src={profile.photoUrl} alt={`Portrait of ${profile.name}`} />
        <AvatarFallback className="bg-post-foreground text-sm font-semibold text-white">
          {profile.name.split(' ').map((name) => name[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-semibold text-post-foreground">{profile.name}</p>
        <p className="text-sm text-post-muted">
          @{profile.username.replace(/^@/, '')}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-5 text-post-foreground">
          {profile.description}
        </p>
      </div>
    </Link>
  )
}