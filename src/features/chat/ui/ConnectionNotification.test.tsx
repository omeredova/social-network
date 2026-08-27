import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ConnectionNotification } from './ConnectionNotification'

afterEach(cleanup)

describe('ConnectionNotification', () => {
  it('shows a fixed notification while connecting', () => {
    render(<ConnectionNotification status="connecting" />)

    const notification = screen.getByRole('status')
    expect(notification).toHaveTextContent('Connecting to chat')
    expect(notification).toHaveClass('fixed')
  })

  it('hides after connecting', () => {
    const { container } = render(
      <ConnectionNotification status="connected" />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
