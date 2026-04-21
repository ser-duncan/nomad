import { PlaneIcon, TrainIcon, ArrowRightIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { Block } from '@/types/app'

export function TransportBlock({ block }: { block: Block }) {
  const isFlight = block.type === 'flight'
  const Icon = isFlight ? PlaneIcon : TrainIcon

  const fromStation = isFlight ? block.flight_depart_airport : block.train_depart_station
  const toStation = isFlight ? block.flight_arrive_airport : block.train_arrive_station
  const departTime = isFlight ? block.flight_depart_time : block.train_depart_time
  const arriveTime = isFlight ? block.flight_arrive_time : block.train_arrive_time
  const carrier = isFlight ? block.flight_airline : block.train_carrier
  const ref = isFlight ? block.flight_confirmation : block.train_confirmation
  const label = isFlight
    ? `${block.flight_airline ?? ''} ${block.flight_number ?? ''}`.trim()
    : block.train_carrier ?? 'Train'

  return (
    <li className="flex gap-3 px-4 py-3 bg-slate-50/50">
      <div className="w-12 shrink-0 flex justify-end pt-0.5">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{fromStation}</span>
          <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{toStation}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {departTime && (
            <span>{format(new Date(departTime), 'h:mm a')}</span>
          )}
          {label && <span className="font-medium">{label}</span>}
          {ref && <span>#{ref}</span>}
        </div>
        {block.note_text && (
          <p className="text-xs text-muted-foreground mt-1">{block.note_text}</p>
        )}
      </div>
    </li>
  )
}
