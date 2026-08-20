import { useUserProfile, type EditableUserProfile } from '@/entities/user'
import { useAuthUser } from '@/features/auth'
import { UpdateProfileForm } from '@/features/update-profile'
import { Card, CardContent } from '@/shared/ui/card'
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb'

export function SettingsPage() {
  const { user, isLoading } = useAuthUser()

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <PageBreadcrumb
          items={[{ label: 'Feed', href: '/' }, { label: 'Settings' }]}
        />
        <Card className="rounded-profile-card border-post-border bg-post-surface shadow-post-card">
          <CardContent className="p-6 sm:p-8">
            <h1 className="font-serif text-3xl text-post-foreground sm:text-4xl">
              Edit profile
            </h1>
            <p className="mb-8 mt-2 text-sm text-post-muted">
              Update the information people see on your profile.
            </p>

            {user ? (
              <AuthenticatedProfileSettings
                profileId={user.uid}
                defaultName={user.displayName ?? ''}
                defaultPhotoUrl={user.photoURL ?? ''}
              />
            ) : (
              <p
                role={!isLoading ? 'alert' : undefined}
                className="text-sm text-post-muted"
              >
                {isLoading
                  ? 'Loading your account…'
                  : 'Please log in to update your profile.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

interface AuthenticatedProfileSettingsProps {
  profileId: string
  defaultName: string
  defaultPhotoUrl: string
}

function AuthenticatedProfileSettings({
  profileId,
  defaultName,
  defaultPhotoUrl,
}: AuthenticatedProfileSettingsProps) {
  const { data: profile, isPending, isError } = useUserProfile(profileId)

  if (isPending)
    return <p className="text-sm text-post-muted">Loading profile…</p>
  if (isError)
    return (
      <p role="alert" className="text-sm text-destructive">
        Unable to load your profile.
      </p>
    )

  const emptyProfile: EditableUserProfile = {
    name: defaultName,
    username: '',
    description: '',
    photoUrl: defaultPhotoUrl,
    coverUrl: '',
  }

  return (
    <UpdateProfileForm
      profileId={profileId}
      profile={profile ?? emptyProfile}
    />
  )
}
