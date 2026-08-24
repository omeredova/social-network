import { Link } from '@tanstack/react-router';
import { MessageCircle, Repeat2 } from 'lucide-react';
import { useUserProfile } from '@/entities/user';
import { useAuthUser } from '@/features/auth';
import { useRepostProfile } from '@/features/repost-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb';
import { ProfileActivityTabs } from './components/ProfileActivityTabs';

interface ProfilePageProps {
  profileId: string
}

const profileActionButtonClassName =
  'rounded-post-control border border-post-action bg-post-action px-4 text-post-toolbar shadow-post-action transition-all hover:-translate-y-0.5 hover:border-post-action-hover hover:bg-post-action-hover hover:text-post-toolbar hover:shadow-profile-avatar focus-visible:ring-post-focus'

export function ProfilePage({ profileId }: ProfilePageProps) {
  const { data: profile, isLoading, isError } = useUserProfile(profileId)
  const { user } = useAuthUser()
  const repostProfile = useRepostProfile()

  if (isLoading) {
    return (
      <p role="status" className="p-10 text-sm text-post-muted">
        Loading profile…
      </p>
    )
  }

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-post-foreground">
            {isError ? 'Unable to load profile' : 'Profile not found'}
          </h1>
          <Button
            asChild
            variant="link"
            className="mt-4 text-post-action-link-hover"
          >
            <Link to="/">Return to the feed</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <PageBreadcrumb
            items={[
            { label: 'Feed', href: '/' },
            { label: profile.name },
          ]}
        />

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
                <AvatarImage
                  src={profile.photoUrl}
                  alt={profile.photoAlt}
                  className="object-cover"
                />
                <AvatarFallback className="bg-post-foreground text-xl font-semibold text-white">
                  {profile.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 flex flex-wrap justify-end gap-2 sm:mt-5">
                {user && user.uid !== profile.id && (
                  <Button
                    type="button"
                    className={profileActionButtonClassName}
                    disabled={repostProfile.isPending}
                    onClick={() => {
                      repostProfile.mutate({
                        profileId: profile.id,
                        userId: user.uid,
                      })
                    }}
                  >
                    <Repeat2 aria-hidden="true" />
                    {repostProfile.isPending ? 'Reposting…' : 'Repost'}
                  </Button>
                )}
                <Button className={profileActionButtonClassName}>
                  <MessageCircle aria-hidden="true" />
                  Message
                </Button>
              </div>
            </div>

            <div className="mt-4 max-w-2xl">
              <h1 className="font-serif text-3xl leading-tight text-post-foreground sm:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-post-muted">
                {profile.username}
              </p>
              <p className="mt-4 text-sm leading-6 text-post-foreground sm:text-base">
                {profile.description}
              </p>
              {repostProfile.isError && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {repostProfile.error.message}
                </p>
              )}
              {repostProfile.isSuccess && (
                <p role="status" className="mt-3 text-sm text-post-muted">
                  Profile reposted.
                </p>
              )}
              <div className="mt-5 inline-flex items-baseline gap-2 border-l-2 border-profile-accent pl-3">
                <strong className="text-xl tabular-nums text-post-foreground">
                  {profile.postsCount}
                </strong>
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
