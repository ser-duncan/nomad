import { createClient } from '@/lib/supabase/server'
import { TripCard } from '@/components/trip/TripCard'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import type { Trip } from '@/types/app'

export default async function TripsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trips } = await supabase
    .from('trips')
    .select('*, trip_members!inner(user_id)')
    .eq('trip_members.user_id', user!.id)
    .order('start_date', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">Nomad</h1>
          <Link href="/trips/new" className={buttonVariants({ size: 'sm' })}>
            + New trip
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {!trips || trips.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-lg font-medium">No trips yet</p>
            <p className="text-sm text-muted-foreground">Create your first trip to get started.</p>
            <Link href="/trips/new" className={buttonVariants()}>Plan a trip</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(trips as Trip[]).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
