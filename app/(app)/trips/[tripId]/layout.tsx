import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import { Toaster } from '@/components/ui/sonner'

interface TripLayoutProps {
  children: React.ReactNode
  params: Promise<{ tripId: string }>
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify membership
  const { data: member } = await supabase
    .from('trip_members')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (!member) notFound()

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {children}
      <BottomNav tripId={tripId} />
      <Toaster />
    </div>
  )
}
