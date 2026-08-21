import { doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/shared/config/firebase';

export interface RepostPostInput {
  readonly postId: string
  readonly userId: string
}

interface RepostSource {
  readonly authorId: string
  readonly content: string
  readonly imageUrl: string
  readonly originalPostId?: string
  readonly originalAuthorId?: string
}

function getRepostSource(value: unknown): RepostSource | null {
  if (!value || typeof value !== 'object') return null
  const post = value as Record<string, unknown>

  if (
    typeof post.authorId !== 'string' ||
    typeof post.content !== 'string' ||
    typeof post.imageUrl !== 'string' ||
    (post.originalPostId !== undefined &&
      typeof post.originalPostId !== 'string') ||
    (post.originalAuthorId !== undefined &&
      typeof post.originalAuthorId !== 'string')
  ) {
    return null
  }

  return {
    authorId: post.authorId,
    content: post.content,
    imageUrl: post.imageUrl,
    ...(typeof post.originalPostId === 'string'
      ? { originalPostId: post.originalPostId }
      : {}),
    ...(typeof post.originalAuthorId === 'string'
      ? { originalAuthorId: post.originalAuthorId }
      : {}),
  }
}

export async function repostPost(input: RepostPostInput): Promise<string> {
  if (firebaseAuth.currentUser?.uid !== input.userId) {
    throw new Error('You must be signed in to repost.')
  }

  const sourceReference = doc(firestore, 'posts', input.postId)
  let repostId = ''

  await runTransaction(firestore, async (transaction) => {
    const sourceSnapshot = await transaction.get(sourceReference)
    const source = getRepostSource(sourceSnapshot.data())

    if (!source) throw new Error('The post is unavailable.')
    const originalPostId = source.originalPostId ?? input.postId
    const originalAuthorId = source.originalAuthorId ?? source.authorId

    if (originalAuthorId === input.userId || source.authorId === input.userId) {
      throw new Error('You cannot repost your own post.')
    }

    repostId = `repost-${input.userId}-${originalPostId}`
    const repostReference = doc(firestore, 'posts', repostId)
    const existingRepost = await transaction.get(repostReference)

    if (existingRepost.exists()) {
      throw new Error('You have already reposted this post.')
    }

    transaction.set(repostReference, {
      authorId: input.userId,
      content: source.content,
      imageUrl: source.imageUrl,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      originalPostId,
      originalAuthorId,
    })
    transaction.update(doc(firestore, 'posts', originalPostId), {
      repostsCount: increment(1),
    })
  })

  return repostId
}
