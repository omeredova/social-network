import { describe, expect, it } from 'vitest'
import { getProfileFromForm } from './getProfileFromForm'

function createValidFormData(): FormData {
  const formData = new FormData()
  formData.set('name', ' Maya Brooks ')
  formData.set('username', 'mayab')
  formData.set('photoUrl', 'https://example.com/photo.jpg')
  formData.set('coverUrl', 'https://example.com/cover.jpg')
  formData.set('description', ' Product designer ')
  return formData
}

describe('getProfileFromForm', () => {
  it('trims profile values and adds the username prefix', () => {
    expect(getProfileFromForm(createValidFormData())).toEqual({
      name: 'Maya Brooks',
      username: '@mayab',
      photoUrl: 'https://example.com/photo.jpg',
      coverUrl: 'https://example.com/cover.jpg',
      description: 'Product designer',
    })
  })

  it('does not duplicate an existing username prefix', () => {
    const formData = createValidFormData()
    formData.set('username', '@mayab')

    expect(getProfileFromForm(formData)?.username).toBe('@mayab')
  })

  it('rejects an incomplete profile', () => {
    const formData = createValidFormData()
    formData.set('description', '  ')

    expect(getProfileFromForm(formData)).toBeNull()
  })
})