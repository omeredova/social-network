import { useState, type SyntheticEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { EditableUserProfile } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { getProfileFromForm } from '../model/getProfileFromForm'
import { useUpdateUserProfile } from '../model/useUpdateUserProfile'

interface UpdateProfileFormProps {
  profileId: string
  profile: EditableUserProfile
}

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'photoUrl', label: 'Profile photo URL', type: 'url' },
  { name: 'coverUrl', label: 'Cover image URL', type: 'url' },
] as const

export function UpdateProfileForm({
  profileId,
  profile,
}: UpdateProfileFormProps) {
  const navigate = useNavigate()
  const updateMutation = useUpdateUserProfile()
  const [validationError, setValidationError] = useState<string | null>(null)

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    setValidationError(null)
    updateMutation.reset()

    const formData = new FormData(event.currentTarget)
    const updatedProfile = getProfileFromForm(formData)

    if (!updatedProfile) {
      setValidationError('Please complete every profile field.')
      return
    }

    try {
      await updateMutation.mutateAsync({ profileId, profile: updatedProfile })
      await navigate({ to: '/profile/$profileId', params: { profileId } })
    } catch {
      // The mutation error is rendered below the form.
    }
  }

  return (
    <form className="grid gap-5" onSubmit={(event) => void handleSubmit(event)}>
      {fields.map((field) => (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={`profile-${field.name}`}>{field.label}</Label>
          <Input
            id={`profile-${field.name}`}
            name={field.name}
            type={field.type}
            defaultValue={profile[field.name]}
            required
          />
        </div>
      ))}

      <div className="grid gap-2">
        <Label htmlFor="profile-description">Description</Label>
        <Textarea
          id="profile-description"
          name="description"
          defaultValue={profile.description}
          rows={5}
          required
        />
      </div>

      {validationError || updateMutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {validationError ?? 'Unable to save your profile. Please try again.'}
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void navigate({ to: '/profile/$profileId', params: { profileId } })
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving…' : 'Save profile'}
        </Button>
      </div>
    </form>
  )
}
