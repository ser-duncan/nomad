'use client'

import { useState } from 'react'
import { CheckCircle2Icon, CircleIcon, ChevronDownIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Block, ChecklistItem, ChecklistStatus } from '@/types/app'

const statusConfig: Record<ChecklistStatus, { label: string; className: string }> = {
  book_now: { label: 'Book Now', className: 'bg-red-100 text-red-700' },
  waiting: { label: 'Waiting', className: 'bg-yellow-100 text-yellow-700' },
  done: { label: 'Done', className: 'bg-green-100 text-green-700' },
}

interface ChecklistBlockProps {
  block: Block & { checklist_items?: ChecklistItem[] }
}

export function ChecklistBlock({ block }: ChecklistBlockProps) {
  const items = block.checklist_items ?? []

  return (
    <li className="px-4 py-3 space-y-2">
      {block.note_text && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {block.note_text}
        </p>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <ChecklistItemRow key={item.id} item={item} />
        ))}
      </ul>
    </li>
  )
}

function ChecklistItemRow({ item }: { item: ChecklistItem }) {
  const [expanded, setExpanded] = useState(false)
  const statusInfo = item.status ? statusConfig[item.status] : null

  return (
    <li className="space-y-1">
      <div className="flex items-start gap-2">
        {item.checked ? (
          <CheckCircle2Icon className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
        ) : (
          <CircleIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
              {item.text}
            </span>
            {statusInfo && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            )}
            {item.due_label && (
              <span className="text-[10px] text-muted-foreground">{item.due_label}</span>
            )}
          </div>
        </div>
        {(item.steps?.length || item.links?.length) ? (
          <button onClick={() => setExpanded((v) => !v)} className="shrink-0">
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        ) : null}
      </div>

      {expanded && (
        <div className="ml-6 space-y-1">
          {item.steps?.map((step, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {i + 1}. {step}
            </p>
          ))}
          {item.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-blue-600 underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </li>
  )
}
