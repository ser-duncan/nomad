import { Badge } from '@/components/ui/badge'
import { MapPinIcon, StarIcon, ClockIcon } from 'lucide-react'
import type { Block } from '@/types/app'

interface PlaceBlockProps {
  block: Block
}

const categoryColors: Record<string, string> = {
  restaurant: 'bg-yellow-100 text-yellow-800',
  lodging: 'bg-blue-100 text-blue-800',
  tourist_attraction: 'bg-green-100 text-green-800',
  default: 'bg-slate-100 text-slate-700',
}

function getCategoryColor(types: string[] | null) {
  if (!types) return categoryColors.default
  for (const t of types) {
    if (categoryColors[t]) return categoryColors[t]
  }
  return categoryColors.default
}

export function PlaceBlock({ block }: PlaceBlockProps) {
  const color = getCategoryColor(block.place_types)

  return (
    <li className="flex gap-3 px-4 py-3">
      {/* Time column */}
      <div className="w-12 shrink-0 pt-0.5">
        {block.start_time && (
          <span className="text-xs text-muted-foreground font-mono">
            {block.start_time.slice(0, 5)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="font-medium text-sm leading-snug">{block.place_name}</span>
          {block.place_types && block.place_types[0] && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${color}`}>
              {block.place_types[0].replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {block.place_address && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{block.place_address}</span>
          </p>
        )}

        {block.place_rating && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {block.place_rating}
          </p>
        )}

        {block.note_text && (
          <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{block.note_text}</p>
        )}
      </div>
    </li>
  )
}
