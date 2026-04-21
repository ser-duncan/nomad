import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TripHeader } from '@/components/trip/TripHeader'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import type { Trip, Section, Block } from '@/types/app'

interface Props {
  params: Promise<{ tripId: string }>
}

export default async function ItineraryPage({ params }: Props) {
  const { tripId } = await params
  const supabase = await createClient()

  const [{ data: trip }, { data: sections }] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).single(),
    supabase
      .from('sections')
      .select('*, blocks(*, checklist_items(*))')
      .eq('trip_id', tripId)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'blocks' }),
  ])

  if (!trip) notFound()

  return (
    <div>
      <TripHeader trip={trip as Trip} />
      <ItineraryView
        tripId={tripId}
        sections={(sections ?? []) as (Section & { blocks: (Block & { checklist_items: any[] })[] })[]}
      />
    </div>
  )
}
