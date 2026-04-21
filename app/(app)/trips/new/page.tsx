'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewTripPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: trip, error: tripErr } = await supabase
      .from('trips')
      .insert({ title, start_date: startDate, end_date: endDate, owner_id: user.id })
      .select()
      .single()

    if (tripErr || !trip) {
      setError(tripErr?.message ?? 'Failed to create trip')
      setLoading(false)
      return
    }

    await supabase.from('trip_members').insert({
      trip_id: trip.id,
      user_id: user.id,
      role: 'owner',
    })

    router.push(`/trips/${trip.id}/itinerary`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link href="/trips" className="text-sm text-muted-foreground hover:underline">← Back</Link>
          <h1 className="text-base font-semibold">New trip</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Trip name</Label>
            <Input
              id="title"
              placeholder="e.g. Japan 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">End date</Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create trip'}
          </Button>
        </form>
      </main>
    </div>
  )
}
