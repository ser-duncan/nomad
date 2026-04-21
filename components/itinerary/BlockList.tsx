import { PlaceBlock } from './PlaceBlock'
import { NoteBlock } from './NoteBlock'
import { TransportBlock } from './TransportBlock'
import { HotelBlock } from './HotelBlock'
import { ChecklistBlock } from './ChecklistBlock'
import type { Block } from '@/types/app'

interface BlockListProps {
  blocks: Block[]
  tripId: string
  sectionId: string
}

export function BlockList({ blocks, tripId, sectionId }: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        No items yet
      </div>
    )
  }

  return (
    <ul className="divide-y">
      {blocks.map((block) => {
        switch (block.type) {
          case 'place':
          case 'hotel':
            return block.hotel_check_in ? (
              <HotelBlock key={block.id} block={block} />
            ) : (
              <PlaceBlock key={block.id} block={block} />
            )
          case 'note':
            return <NoteBlock key={block.id} block={block} />
          case 'flight':
          case 'train':
            return <TransportBlock key={block.id} block={block} />
          case 'checklist':
            return <ChecklistBlock key={block.id} block={block} />
          default:
            return null
        }
      })}
    </ul>
  )
}
