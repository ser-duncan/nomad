'use client'

import { useRef } from 'react'
import { DaySection } from './DaySection'
import type { Section, Block } from '@/types/app'

interface ItineraryViewProps {
  tripId: string
  sections: (Section & { blocks: Block[] })[]
}

export function ItineraryView({ tripId, sections }: ItineraryViewProps) {
  const daySections = sections.filter((s) => s.type === 'normal' && s.date)

  if (sections.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">No itinerary yet. Add your first day to get started.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 space-y-2">
      {sections.map((section, idx) => (
        <DaySection
          key={section.id}
          section={section}
          tripId={tripId}
          defaultOpen={idx < 2}
        />
      ))}
    </div>
  )
}
