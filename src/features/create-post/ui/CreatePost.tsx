import { useState } from 'react';
import { Camera, MapPin, Smile, UserRound } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { useAuthUser } from '@/features/auth';
import { useCreatePost } from '../model/useCreatePost';

const postOptions = [
  { label: 'Tag people', icon: UserRound },
  { label: 'Add location', icon: MapPin },
  { label: 'Add photo', icon: Camera },
  { label: 'Add emoji', icon: Smile },
]

const optionButtonClassName =
  'size-9 rounded-post-control bg-post-toolbar text-post-foreground shadow-post-control hover:bg-post-toolbar-hover hover:text-post-foreground focus-visible:ring-post-focus'

export function CreatePost() {
  const [text, setText] = useState('')
  const { user, isLoading: isAuthLoading } = useAuthUser()
  const createPostMutation = useCreatePost()

  async function handleSubmit(): Promise<void> {
    const content = text.trim()

    if (!user || !content) return

    await createPostMutation.mutateAsync({
      authorId: user.uid,
      content,
      imageUrl: '',
    })
    setText('')
  }

  return (
    <Card className="mt-2 mb-3 overflow-hidden rounded-post-card border-post-border bg-post-surface shadow-post-card">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit()
        }}
      >
        <Textarea
          value={text}
          onChange={(event) => { setText(event.target.value) }}
          placeholder="Write something…"
          aria-label="Post text"
          rows={3}
          className="min-h-20 resize-none rounded-none border-0 bg-post-surface px-4 py-3 text-sm leading-6 text-post-muted shadow-none placeholder:text-post-muted focus-visible:ring-0"
        />

        <div className="flex min-h-13 items-center justify-between gap-3 bg-post-toolbar p-2">
          <div className="flex items-center">
            {postOptions.map(({ label, icon: Icon }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="icon"
                title={label}
                aria-label={label}
                className={optionButtonClassName}
              >
                <Icon className="size-4" strokeWidth={1.8} />
              </Button>
            ))}
          </div>
          <Button
            type="submit"
            disabled={
              !text.trim() ||
              !user ||
              isAuthLoading ||
              createPostMutation.isPending
            }
            size="sm"
            className="rounded-post-control bg-post-action px-3 text-post-toolbar shadow-post-action hover:bg-post-action-hover focus-visible:ring-post-focus"
          >
            {createPostMutation.isPending ? 'Posting…' : 'Post'}
          </Button>
        </div>

        {!isAuthLoading && !user ? (
          <p role="status" className="px-4 py-2 text-sm text-post-muted">
            Sign in to create a post.
          </p>
        ) : null}

        {createPostMutation.isError ? (
          <p role="alert" className="px-4 py-2 text-sm text-destructive">
            Unable to create the post. Please try again.
          </p>
        ) : null}
      </form>
    </Card>
  )
}