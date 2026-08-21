import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface PostDeleteButtonProps {
  readonly disabled: boolean
  readonly onDelete?: (() => void) | undefined
}

export function PostDeleteButton({ disabled, onDelete }: PostDeleteButtonProps) {
  return (
    <Button type="button" variant="ghost" size="icon" title="Delete post" aria-label="Delete post" disabled={disabled} onClick={onDelete} className="absolute right-2 top-2 z-30 size-8 rounded-full text-post-muted hover:bg-post-toolbar hover:text-post-foreground focus-visible:ring-post-focus">
      <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
    </Button>
  )
}