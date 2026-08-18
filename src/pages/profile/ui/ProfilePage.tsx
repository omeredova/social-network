import { Link } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import { getUserProfileById } from '@/entities/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { ProfileActivityTabs } from './components/ProfileActivityTabs'

interface ProfilePageProps {
  profileId: string
}

export function ProfilePage({ profileId }: ProfilePageProps) {
  const profile = getUserProfileById(profileId)

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-post-foreground">Profile not found</h1>
          <Button asChild variant="link" className="mt-4 text-post-action-link-hover">
            <Link to="/">Return to the feed</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-profile-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="overflow-hidden rounded-profile-card border-post-border bg-post-surface shadow-post-card">
          <div
            className="h-36 bg-cover bg-center sm:h-48"
            style={{ backgroundImage: `url(${profile.coverUrl})` }}
            role="img"
            aria-label="Forest landscape cover"
          />

          <CardContent className="relative px-5 pb-6 pt-0 sm:px-8 sm:pb-8">
            <div className="flex items-start justify-between gap-4">
              <Avatar className="-mt-12 size-24 border-4 border-post-surface shadow-profile-avatar sm:-mt-14 sm:size-28">
                <AvatarImage src={profile.photoUrl} alt={profile.photoAlt} className="object-cover" />
                <AvatarFallback className="bg-post-foreground text-xl font-semibold text-white">
                  {profile.name.split(' ').map((part) => part[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <Button className="mt-4 rounded-post-control bg-post-action px-4 text-post-toolbar shadow-post-action hover:bg-post-action-hover focus-visible:ring-post-focus sm:mt-5">
                <MessageCircle aria-hidden="true" />
                Message
              </Button>
            </div>

            <div className="mt-4 max-w-2xl">
              <h1 className="font-serif text-3xl leading-tight text-post-foreground sm:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-post-muted">{profile.username}</p>
              <p className="mt-4 text-sm leading-6 text-post-foreground sm:text-base">
                {profile.description}
              </p>
              <div className="mt-5 inline-flex items-baseline gap-2 border-l-2 border-profile-accent pl-3">
                <strong className="text-xl tabular-nums text-post-foreground">{profile.postsCount}</strong>
                <span className="text-sm text-post-muted">posts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProfileActivityTabs profile={profile} />
      </div>
    </main>
  )
}