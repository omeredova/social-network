import type { EditableUserProfile } from '@/entities/user';

export function getProfileFromForm(
  formData: FormData,
): EditableUserProfile | null {
  const name = getTrimmedValue(formData, 'name')
  const usernameValue = getTrimmedValue(formData, 'username')
  const photoUrl = getTrimmedValue(formData, 'photoUrl')
  const coverUrl = getTrimmedValue(formData, 'coverUrl')
  const description = getTrimmedValue(formData, 'description')

  if (!name || !usernameValue || !photoUrl || !coverUrl || !description)
    return null

  return {
    name,
    username: usernameValue.startsWith('@')
      ? usernameValue
      : `@${usernameValue}`,
    photoUrl,
    coverUrl,
    description,
  }
}

function getTrimmedValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}