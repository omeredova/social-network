import { Timestamp } from 'firebase/firestore'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  mapComment,
  parseStoredComment,
  parseStoredUser,
} from './mapCommentDocument'

afterEach(() => {
  vi.useRealTimers()
})

describe('comment document parsing', () => {
  it('parses valid comment and user documents', () => {
    const createdAt = Timestamp.fromDate(new Date('2026-08-24T10:00:00Z'))

    expect(
      parseStoredComment({
        authorId: 'user-1',
        postId: 'post-1',
        content: 'Hello',
        createdAt,
        likesCount: 2,
        likeAuthor: ['user-1', 'user-2'],
      }),
    ).toEqual({
      authorId: 'user-1',
      postId: 'post-1',
      content: 'Hello',
      createdAt,
      likesCount: 2,
      likeAuthor: ['user-1', 'user-2'],
    })
    expect(
      parseStoredUser({
        name: 'Maya Brooks',
        username: '@mayab',
        photoUrl: 'https://example.com/maya.jpg',
      }),
    ).toEqual({
      name: 'Maya Brooks',
      username: '@mayab',
      photoUrl: 'https://example.com/maya.jpg',
    })
  })

  it('rejects malformed documents', () => {
    expect(
      parseStoredComment({
        authorId: 'user-1',
        postId: 'post-1',
        content: 'Hello',
        createdAt: new Date(),
      }),
    ).toBeNull()
    expect(parseStoredUser({ name: 'Maya Brooks' })).toBeNull()
  })
})

describe('mapComment', () => {
  it('normalizes the handle and maps stored data to the domain model', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-24T10:30:00Z'))

    expect(
      mapComment({
        id: 'comment-1',
        comment: {
          authorId: 'user-1',
          postId: 'post-1',
          content: 'Hello',
          createdAt: Timestamp.fromDate(new Date('2026-08-24T10:00:00Z')),
          likesCount: 1,
          likeAuthor: ['user-2'],
        },
        author: {
          name: 'Maya Brooks',
          username: '@mayab',
          photoUrl: 'https://example.com/maya.jpg',
        },
      }),
    ).toEqual({
      id: 'comment-1',
      authorId: 'user-1',
      postId: 'post-1',
      author: 'Maya Brooks',
      handle: '@mayab',
      avatarUrl: 'https://example.com/maya.jpg',
      publishedAt: '30 min',
      text: 'Hello',
      likesCount: 1,
      likeAuthor: ['user-2'],
    })
  })

  it('uses safe fallbacks when the author document is unavailable', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-24T10:00:00Z'))

    expect(
      mapComment({
        id: 'comment-1',
        comment: {
          authorId: 'missing-user',
          postId: 'post-1',
          content: 'Hello',
          createdAt: Timestamp.fromDate(new Date('2026-08-24T10:00:00Z')),
          likesCount: 0,
          likeAuthor: [],
        },
        author: null,
      }),
    ).toEqual({
      id: 'comment-1',
      authorId: 'missing-user',
      postId: 'post-1',
      author: 'Unknown user',
      handle: '@unknown',
      publishedAt: 'just now',
      text: 'Hello',
      likesCount: 0,
      likeAuthor: [],
    })
  })

  it('uses the unknown handle fallback when the stored username is empty', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-24T10:00:00Z'))

    const comment = mapComment({
      id: 'comment-1',
      comment: {
        authorId: 'user-1',
        postId: 'post-1',
        content: 'Hello',
        createdAt: Timestamp.fromDate(new Date('2026-08-24T10:00:00Z')),
        likesCount: 0,
        likeAuthor: [],
      },
      author: { name: 'Maya Brooks', username: '', photoUrl: '' },
    })

    expect(comment.handle).toBe('@unknown')
  })

  it('defaults missing legacy like fields to an empty like state', () => {
    const createdAt = Timestamp.fromDate(new Date('2026-08-24T10:00:00Z'))

    expect(
      parseStoredComment({
        authorId: 'user-1',
        postId: 'post-1',
        content: 'Legacy comment',
        createdAt,
      }),
    ).toMatchObject({ likesCount: 0, likeAuthor: [] })
  })
})
