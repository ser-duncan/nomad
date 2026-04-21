import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Trip } from '@/types/app'
import { format, differenceInDays } from 'date-fns'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const days = differenceInDays(new Date(trip.end_date), new Date(trip.start_date)) + 1
  const start = format(new Date(trip.start_date), 'MMM d')
  const end = format(new Date(trip.end_date), 'MMM d, yyyy')

  return (
    <Link href={`/trips/${trip.id}/itinerary`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {trip.cover_image && (
          <div
            className="h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${trip.cover_image})` }}
          />
        )}
        {!trip.cover_image && (
          <div className="h-36 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold text-base leading-tight">{trip.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {start} – {end}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {days} days
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
