import { useRef, useState } from 'react';
import { Camera, MapPin, Smile, UserRound } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { Input } from '@/shared/ui/input';
import { useAuthUser } from '@/features/auth';
import { useCreatePost } from '../model/useCreatePost';

const postOptions = [
  { label: 'Add photo', icon: Camera },
  { label: 'Add emoji', icon: Smile },
]

const optionButtonClassName =
  'size-9 rounded-post-control bg-post-toolbar text-post-foreground shadow-post-control hover:bg-post-toolbar-hover hover:text-post-foreground focus-visible:ring-post-focus'

export function CreatePost() {
  const [text, setText] = useState('')
  const [location, setLocation] = useState('')
  const [isLocationVisible, setIsLocationVisible] = useState(false)
  const { user, isLoading: isAuthLoading } = useAuthUser()
  const createPostMutation = useCreatePost()
  const textAreaReference = useRef<HTMLTextAreaElement>(null)

  function insertMention(): void {
    const textArea = textAreaReference.current
    const selectionStart = textArea?.selectionStart ?? text.length
    const selectionEnd = textArea?.selectionEnd ?? selectionStart
    const prefix = selectionStart > 0 && !/\s$/.test(text.slice(0, selectionStart)) ? ' @' : '@'
    const nextText = `${text.slice(0, selectionStart)}${prefix}${text.slice(selectionEnd)}`
    const nextCursorPosition = selectionStart + prefix.length

    setText(nextText)
    textArea?.focus()
    requestAnimationFrame(() => {
      textArea?.setSelectionRange(nextCursorPosition, nextCursorPosition)
    })
  }

  async function handleSubmit(): Promise<void> {
    const content = text.trim()

    if (!user || !content) return

    await createPostMutation.mutateAsync({
      authorId: user.uid,
      content,
      imageUrl: '',
      ...(location.trim() ? { location: location.trim() } : {}),
    })
    setText('')
    setLocation('')
    setIsLocationVisible(false)
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
          ref={textAreaReference}
          value={text}
          onChange={(event) => { setText(event.target.value) }}
          placeholder="Write something…"
          aria-label="Post text"
          rows={3}
          className="min-h-20 resize-none rounded-none border-0 bg-post-surface px-4 py-3 text-sm leading-6 text-post-muted shadow-none placeholder:text-post-muted focus-visible:ring-0"
        />

        {isLocationVisible ? (
          <div className="border-t border-post-border px-4 py-3">
            <label
              htmlFor="post-location"
              className="mb-1.5 block text-sm font-medium text-post-foreground"
            >
              Location
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-post-muted" aria-hidden="true" />
              <Input
                id="post-location"
                value={location}
                onChange={(event) => { setLocation(event.target.value) }}
                placeholder="Where are you?"
                maxLength={100}
                autoFocus
              />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-13 items-center justify-between gap-3 bg-post-toolbar p-2">
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Tag people"
              aria-label="Tag people"
              className={optionButtonClassName}
              onClick={insertMention}
            >
              <UserRound className="size-4" strokeWidth={1.8} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={isLocationVisible ? 'Remove location' : 'Add location'}
              aria-label={isLocationVisible ? 'Remove location' : 'Add location'}
              aria-expanded={isLocationVisible}
              className={optionButtonClassName}
              onClick={() => {
                if (isLocationVisible) setLocation('')
                setIsLocationVisible((visible) => !visible)
              }}
            >
              <MapPin className="size-4" strokeWidth={1.8} />
            </Button>
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
            variant="postAction"
            disabled={
              !text.trim() ||
              !user ||
              isAuthLoading ||
              createPostMutation.isPending
            }
            size="sm"
            className="px-3"
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
