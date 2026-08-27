import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreatePost } from './CreatePost'

const mutateAsync = vi.fn<() => Promise<string>>()

vi.mock('../model/useCreatePost', () => ({
  useCreatePost: () => ({
    mutateAsync,
    isPending: false,
    isError: false,
  }),
}))

afterEach(cleanup)

describe('CreatePost', () => {
  beforeEach(() => {
    mutateAsync.mockReset()
    mutateAsync.mockResolvedValue('post-1')
  })

  it('adds a trimmed optional location to a new post', async () => {
    const user = userEvent.setup()
    render(<CreatePost authorId="user-1" isAuthLoading={false} />)

    await user.type(screen.getByLabelText('Post text'), 'A sunny day')
    await user.click(screen.getByRole('button', { name: 'Add location' }))
    await user.type(screen.getByLabelText('Location'), '  Minsk  ')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(mutateAsync).toHaveBeenCalledWith({
      authorId: 'user-1',
      content: 'A sunny day',
      imageUrl: '',
      location: 'Minsk',
    })
    expect(screen.queryByLabelText('Location')).not.toBeInTheDocument()
  })

  it('does not store a location when none is provided', async () => {
    const user = userEvent.setup()
    render(<CreatePost authorId="user-1" isAuthLoading={false} />)

    await user.type(screen.getByLabelText('Post text'), 'No location')
    await user.click(screen.getByRole('button', { name: 'Post' }))

    expect(mutateAsync).toHaveBeenCalledWith({
      authorId: 'user-1',
      content: 'No location',
      imageUrl: '',
    })
  })

  it('inserts an @ when the tag people option is selected', async () => {
    const user = userEvent.setup()
    render(<CreatePost authorId="user-1" isAuthLoading={false} />)

    await user.type(screen.getByLabelText('Post text'), 'Hello')
    await user.click(screen.getByRole('button', { name: 'Tag people' }))

    expect(screen.getByLabelText('Post text')).toHaveValue('Hello @')
    expect(screen.getByLabelText('Post text')).toHaveFocus()
  })
})
