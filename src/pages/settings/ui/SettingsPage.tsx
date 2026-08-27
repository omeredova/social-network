import { useUserProfile, type EditableUserProfile } from '@/entities/user'
import { useAuthUser } from '@/features/auth'
import { UpdateProfileForm } from '@/features/update-profile'
import { Card, CardContent } from '@/shared/ui/card'
import { PageBreadcrumb } from '@/shared/ui/page-breadcrumb'
import { PageContainer } from '@/shared/ui/page-container'
import { StatusMessage } from '@/shared/ui/status-message'
import { observer } from 'mobx-react-lite'

export function SettingsPage() {
  return <ObservedSettingsPage />
}

const ObservedSettingsPage = observer(function ObservedSettingsPage() {
  const { user, isLoading } = useAuthUser()

  return (
    <PageContainer>
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
              defaultName={user.displayName}
              defaultPhotoUrl={user.photoURL}
            />
          ) : (
            <StatusMessage role={!isLoading ? 'alert' : undefined}>
              {isLoading
                ? 'Loading your account…'
                : 'Please log in to update your profile.'}
            </StatusMessage>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
})

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

  if (isPending) return <StatusMessage>Loading profile…</StatusMessage>
  if (isError)
    return (
      <StatusMessage tone="destructive">
        Unable to load your profile.
      </StatusMessage>
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
