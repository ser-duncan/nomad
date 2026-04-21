import { BedIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { Block } from '@/types/app'

export function HotelBlock({ block }: { block: Block }) {
  const checkIn = block.hotel_check_in
    ? format(new Date(block.hotel_check_in + 'T00:00:00'), 'MMM d')
    : null
  const checkOut = block.hotel_check_out
    ? format(new Date(block.hotel_check_out + 'T00:00:00'), 'MMM d')
    : null

  return (
    <li className="flex gap-3 px-4 py-3 bg-blue-50/40">
      <div className="w-12 shrink-0 flex justify-end pt-0.5">
        <BedIcon className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-medium">{block.place_name}</p>
        {(checkIn || checkOut) && (
          <p className="text-xs text-muted-foreground">
            {checkIn} – {checkOut}
          </p>
        )}
        {block.hotel_confirmation && (
          <p className="text-xs text-muted-foreground">
            Confirmation: <span className="font-mono">{block.hotel_confirmation}</span>
          </p>
        )}
        {block.note_text && (
          <p className="text-xs text-muted-foreground mt-1">{block.note_text}</p>
        )}
      </div>
    </li>
  )
}
