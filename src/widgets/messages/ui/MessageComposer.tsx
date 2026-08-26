import type { ComponentProps } from 'react';
import { Send } from 'lucide-react';
import type { EchoConnectionStatus } from '@/features/chat';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface MessageComposerProps {
  readonly participantName: string
  readonly draft: string
  readonly status: EchoConnectionStatus
  readonly onDraftChange: (draft: string) => void
  readonly onSubmit: ComponentProps<'form'>['onSubmit']
  readonly onKeyDown: ComponentProps<'textarea'>['onKeyDown']
}

export function MessageComposer({
  participantName,
  draft,
  status,
  onDraftChange,
  onSubmit,
  onKeyDown,
}: MessageComposerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 border-t border-post-border bg-white p-3 sm:p-4"
    >
      <Textarea
        value={draft}
        onChange={(event) => {
          onDraftChange(event.target.value)
        }}
        onKeyDown={onKeyDown}
        placeholder={`Message ${participantName}`}
        aria-label="Message"
        autoComplete="off"
        rows={1}
        className="max-h-32 min-h-9 resize-none overflow-y-auto whitespace-pre-wrap"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!draft.trim() || status !== 'connected'}
        aria-label="Send message"
      >
        <Send aria-hidden="true" />
      </Button>
    </form>
  )
}