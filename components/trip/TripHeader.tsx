import Link from 'next/link'
import { format } from 'date-fns'
import { buttonVariants } from '@/components/ui/button'
import { SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Trip } from '@/types/app'

interface TripHeaderProps {
  trip: Trip
}

export function TripHeader({ trip }: TripHeaderProps) {
  const start = format(new Date(trip.start_date), 'MMM d')
  const end = format(new Date(trip.end_date), 'MMM d, yyyy')

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <Link href="/trips" className="text-xs text-muted-foreground hover:underline">
            ← Trips
          </Link>
          <h1 className="truncate text-base font-semibold leading-tight mt-0.5">{trip.title}</h1>
          <p className="text-xs text-muted-foreground">
            {start} – {end}
          </p>
        </div>
        <Link
          href={`/trips/${trip.id}/settings`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <SettingsIcon className="h-4 w-4" />
        </Link>
      </div>
    </header>
  )
}
