import { TripHeader } from '@/components/trip/TripHeader'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Trip } from '@/types/app'

interface Props {
  params: Promise<{ tripId: string }>
}

export default async function Page({ params }: Props) {
  const { tripId } = await params
  const supabase = await createClient()
  const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single()
  if (!trip) notFound()

  return (
    <div>
      <TripHeader trip={trip as Trip} />
      <div className="mx-auto max-w-2xl px-4 py-8 text-center text-muted-foreground text-sm">
        Coming soon
      </div>
    </div>
  )
}
