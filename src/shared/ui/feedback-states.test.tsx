import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NotFoundState } from './not-found-state'
import { StatusMessage } from './status-message'

describe('StatusMessage', () => {
  it('announces regular status updates', () => {
    render(<StatusMessage>Loading profile…</StatusMessage>)

    expect(screen.getByRole('status')).toHaveTextContent('Loading profile…')
  })

  it('announces destructive messages as alerts', () => {
    render(
      <StatusMessage tone="destructive">Unable to load profile.</StatusMessage>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to load profile.',
    )
  })
})

describe('NotFoundState', () => {
  it('renders its title, description, and action', () => {
    render(
      <NotFoundState
        title="Post not found"
        description="The post may have been removed."
        action={<a href="/">Return to the feed</a>}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Post not found' }),
    ).toBeInTheDocument()
    expect(screen.getByText('The post may have been removed.')).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'Return to the feed' }),
    ).toHaveAttribute('href', '/')
  })
})
