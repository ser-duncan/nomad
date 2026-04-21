import { StickyNoteIcon } from 'lucide-react'
import type { Block } from '@/types/app'

export function NoteBlock({ block }: { block: Block }) {
  return (
    <li className="flex gap-3 px-4 py-3">
      <div className="w-12 shrink-0 flex justify-end pt-0.5">
        <StickyNoteIcon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <p className="flex-1 text-sm text-muted-foreground whitespace-pre-line">{block.note_text}</p>
    </li>
  )
}
