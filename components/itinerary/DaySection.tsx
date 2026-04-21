'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BlockList } from './BlockList'
import type { Block, Section } from '@/types/app'

interface DaySectionProps {
  section: Section & { blocks: Block[] }
  tripId: string
  defaultOpen?: boolean
}

const sectionTypeLabel: Record<string, string> = {
  hotels: 'Hotels',
  flights: 'Flights',
  transit: 'Transport',
  textOnly: 'Notes',
  normal: '',
}

export function DaySection({ section, tripId, defaultOpen = false }: DaySectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  const label = section.date
    ? format(new Date(section.date + 'T00:00:00'), 'EEE, MMM d')
    : sectionTypeLabel[section.type] || section.heading

  const blockCount = section.blocks?.length ?? 0

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          {open ? (
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="font-semibold text-sm">{section.heading}</span>
          {section.date && (
            <span className="text-xs text-muted-foreground hidden sm:inline">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {blockCount > 0 && (
            <span className="text-xs text-muted-foreground">{blockCount} items</span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t">
          <BlockList blocks={section.blocks ?? []} tripId={tripId} sectionId={section.id} />
        </div>
      )}
    </div>
  )
}
