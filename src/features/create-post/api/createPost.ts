import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/shared/config/firebase';

export interface CreatePostInput {
  readonly authorId: string
  readonly content: string
  readonly imageUrl: string
}

export async function createPost(input: CreatePostInput): Promise<string> {
  const post = await addDoc(collection(firestore, 'posts'), {
    authorId: input.authorId,
    content: input.content,
    imageUrl: input.imageUrl,
    createdAt: serverTimestamp(),
    likesCount: 0,
    commentsCount: 0,
    repostsCount: 0,
  })

  return post.id
}