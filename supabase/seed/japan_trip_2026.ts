/**
 * Seeds the Japan Trip 2026 data from the prototype into Supabase.
 * Run with: npx tsx supabase/seed/japan_trip_2026.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { generateKeyBetween } from 'fractional-indexing'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Source data from prototype ───────────────────────────────────────────────

const DAYS = [
  { date: '2026-05-25', title: 'Arrival in Tokyo', city: 'Tokyo', items: [
    { time: '3:05 PM', cat: 'travel', name: 'Arrive HND', note: 'Land at Haneda, clear immigration, and transfer to the Yoyogi/Shinjuku Airbnb.' },
    { time: '6:30 PM', cat: 'activities', name: 'Easy Shinjuku walk', note: 'Neon streets, convenience store stop, and a low-effort first evening.' },
    { time: '7:30 PM', cat: 'dining', name: 'Casual dinner', note: 'Ramen or simple nearby dinner.' },
  ]},
  { date: '2026-05-26', title: 'Meiji Shrine + Harajuku + Shibuya', city: 'Tokyo', items: [
    { time: '9:30 AM', cat: 'activities', name: 'Meiji Shrine', note: 'Start early before crowds.' },
    { time: '11:00 AM', cat: 'activities', name: 'Harajuku / Takeshita Street', note: 'Browse and walk straight from Meiji Shrine.' },
    { time: '12:30 PM', cat: 'dining', name: 'Lunch', note: 'Lunch in Harajuku / Omotesando.' },
    { time: '2:00 PM', cat: 'activities', name: 'Shibuya shopping', note: '109, Loft, Tokyu Hands, Donki.' },
    { time: '7:00 PM', cat: 'dining', name: 'Sushi dinner', note: 'Good Shibuya sushi night.' },
  ]},
  { date: '2026-05-27', title: 'Flexible Tokyo day', city: 'Tokyo', items: [
    { time: '9:00 AM', cat: 'activities', name: 'Optional teamLab', note: 'Timed entry if you book it.' },
    { time: '2:00 PM', cat: 'activities', name: 'Shopping / Pokémon Center', note: 'Use for flex attractions and shopping.' },
    { time: '7:00 PM', cat: 'dining', name: 'Ramen night', note: 'Shinjuku or Shibuya ramen.' },
  ]},
  { date: '2026-05-28', title: 'Tokyo buffer day', city: 'Tokyo', items: [
    { time: '10:00 AM', cat: 'activities', name: 'Last Tokyo priorities', note: 'Use for anything missed.' },
    { time: '3:00 PM', cat: 'travel', name: 'Pack for Hakone', note: 'Prep luggage and next-day rail.' },
    { time: '7:00 PM', cat: 'dining', name: 'Final Tokyo dinner', note: 'Choose any Tokyo meal still missing.' },
  ]},
  { date: '2026-05-29', title: 'Tokyo → Hakone', city: 'Tokyo → Hakone', items: [
    { time: '10:00 AM', cat: 'travel', name: 'Check out Tokyo Airbnb', note: 'Head to Shinjuku with luggage.' },
    { time: '11:00 AM', cat: 'travel', name: 'Romancecar to Hakone-Yumoto', note: 'Target Hakone No. 5, then taxi onward.', isTrain: true, from: 'Shinjuku', to: 'Hakone-Yumoto', carrier: 'Odakyu Romancecar' },
    { time: '2:30 PM', cat: 'activities', name: 'Lake Ashi / pirate ship', note: 'Best arrival-afternoon use of time.' },
    { time: '7:00 PM', cat: 'dining', name: 'Kaiseki dinner', note: 'Quiet Hakone dinner night.' },
  ]},
  { date: '2026-05-30', title: 'Hakone → Kyoto', city: 'Hakone → Kyoto', items: [
    { time: '9:00 AM', cat: 'activities', name: 'Ropeway + Owakudani', note: 'High-value Hakone morning block.' },
    { time: '12:00 PM', cat: 'travel', name: 'Check out Hakone villa', note: 'Taxi to Odawara.' },
    { time: '1:15 PM', cat: 'travel', name: 'Shinkansen to Kyoto', note: 'Book 5 reserved seats together.', isTrain: true, from: 'Odawara', to: 'Kyoto', carrier: 'JR Shinkansen' },
    { time: '6:30 PM', cat: 'activities', name: 'Gion walk', note: 'Perfect first Kyoto evening.' },
    { time: '7:30 PM', cat: 'dining', name: 'Kyoto dinner', note: 'Traditional Kyoto dinner.' },
  ]},
  { date: '2026-05-31', title: 'Fushimi Inari + Nishiki + Gion', city: 'Kyoto', items: [
    { time: '7:30 AM', cat: 'activities', name: 'Fushimi Inari', note: 'Go early for fewer crowds.' },
    { time: '11:30 AM', cat: 'dining', name: 'Nishiki Market', note: 'Food exploration block.' },
    { time: '5:30 PM', cat: 'activities', name: 'Gion return', note: 'Golden-hour Kyoto wandering.' },
    { time: '7:00 PM', cat: 'dining', name: 'Kyoto dinner', note: 'Dinner in the same area.' },
  ]},
  { date: '2026-06-01', title: 'Arashiyama day', city: 'Kyoto', items: [
    { time: '8:00 AM', cat: 'travel', name: 'Train to Arashiyama', note: 'Early departure is worth it.' },
    { time: '9:00 AM', cat: 'activities', name: 'Bamboo Grove', note: 'Morning is best.' },
    { time: '11:30 AM', cat: 'dining', name: 'Lunch in Arashiyama', note: 'Stay in district for lunch.' },
    { time: '2:00 PM', cat: 'activities', name: 'Tea ceremony or kimono', note: 'Bookable cultural experience slot.' },
  ]},
  { date: '2026-06-02', title: 'Kinkaku-ji + flex', city: 'Kyoto', items: [
    { time: '9:00 AM', cat: 'activities', name: 'Kinkaku-ji', note: 'Anchor sight of the day.' },
    { time: '2:00 PM', cat: 'activities', name: "Optional Nijo / Philosopher's Path", note: 'Choose by energy level.' },
    { time: '5:00 PM', cat: 'travel', name: 'Pack for Osaka', note: 'Easy transfer tomorrow.' },
    { time: '7:00 PM', cat: 'dining', name: 'Final Kyoto dinner', note: 'Special Kyoto meal.' },
  ]},
  { date: '2026-06-03', title: 'Kyoto → Osaka', city: 'Kyoto → Osaka', items: [
    { time: '11:00 AM', cat: 'travel', name: 'Check out Kyoto Airbnb', note: 'No advance booking needed.' },
    { time: '12:00 PM', cat: 'travel', name: 'Regional train to Osaka', note: 'Use IC card and stay flexible.', isTrain: true, from: 'Kyoto', to: 'Osaka', carrier: 'JR Regional' },
    { time: '6:00 PM', cat: 'activities', name: 'Dotonbori', note: 'Classic first Osaka night.' },
    { time: '7:00 PM', cat: 'dining', name: 'Takoyaki + okonomiyaki', note: 'Dedicated Osaka food night.' },
  ]},
  { date: '2026-06-04', title: 'Osaka full day', city: 'Osaka', items: [
    { time: '9:30 AM', cat: 'activities', name: 'Osaka Castle', note: 'Morning anchor.' },
    { time: '2:00 PM', cat: 'activities', name: 'Shinsekai', note: 'Classic Osaka neighborhood.' },
    { time: '5:00 PM', cat: 'activities', name: 'Optional Pokémon Café Osaka', note: 'Tokyo location closed during your trip.' },
    { time: '7:00 PM', cat: 'dining', name: 'Final Osaka dinner', note: 'Last big meal before airport day.' },
  ]},
  { date: '2026-06-05', title: 'Osaka → KIX', city: 'Osaka → KIX', items: [
    { time: '10:00 AM', cat: 'travel', name: 'Check out Osaka Airbnb', note: 'Keep the morning calm.' },
    { time: '11:00 AM', cat: 'dining', name: 'Early lunch', note: 'Eat before airport push.' },
    { time: '1:03 PM', cat: 'travel', name: 'HARUKA to KIX', note: 'Preferred airport train target.', isTrain: true, from: 'Osaka', to: 'Kansai International Airport', carrier: 'JR HARUKA' },
    { time: '4:55 PM', cat: 'travel', name: 'Depart KIX', note: 'Flight home.' },
  ]},
]

const ACTIONS = [
  { title: 'Add transit card to iPhone', due: 'Before departure', status: 'book_now' as const,
    steps: ['Add Suica to Apple Wallet.', 'Load a starting balance.', 'Use it for local rail and convenience stores.'],
    links: [{ label: 'Apple Wallet transit card', url: 'https://support.apple.com/en-us/108772' }] },
  { title: 'Book Hakone → Kyoto Shinkansen', due: 'Do now', status: 'book_now' as const,
    steps: ['Search SmartEX for Odawara → Kyoto on Sat, May 30.', 'Target about 1:00–1:30 PM.', 'Book 5 reserved seats together.'],
    links: [{ label: 'SmartEX', url: 'https://smart-ex.jp/en/' }] },
  { title: 'Book Tokyo → Hakone Romancecar', due: 'Opens Apr 28, 2026 at 7:00 PM MDT', status: 'waiting' as const,
    steps: ['Search Shinjuku → Hakone-Yumoto for Fri, May 29.', 'Target the 11:00 AM train.', 'Book 5 seats together.'],
    links: [{ label: 'Odakyu e-Romancecar', url: 'https://www.web-odakyu.com/e-romancecar/vacantSeatInquiry/inquiry?language=en' }] },
  { title: 'Decide on Hakone Freepass', due: 'Same week as Romancecar', status: 'waiting' as const,
    steps: ['Check whether pirate ship + ropeway + local transport make it worthwhile.'],
    links: [{ label: 'Hakone travel info', url: 'https://odakyu-global.com/' }] },
  { title: 'Book teamLab if doing it', due: 'By early/mid May', status: 'waiting' as const,
    steps: ['Pick the Tokyo day first.', 'Book timed tickets and save QR codes.'],
    links: [{ label: 'teamLab Planets', url: 'https://www.teamlab.art/e/planets/' }] },
  { title: 'Pokémon Café Tokyo closed during trip', due: 'Already handled', status: 'done' as const,
    steps: ['Do not plan this in Tokyo.', 'Use Osaka only if it still matters.'],
    links: [{ label: 'Pokémon Café', url: 'https://www.pokemon-cafe.jp/en/cafe/' }] },
  { title: 'Book Osaka → KIX HARUKA', due: 'Opens May 4, 2026 at 7:00 PM MDT', status: 'waiting' as const,
    steps: ['Search JR West for Osaka area → KIX on Fri, Jun 5.', 'Target the 1:03 PM train.', 'Save booking screenshot.'],
    links: [{ label: 'HARUKA reservation', url: 'https://www.westjr.co.jp/global/en/ticket/haruka-oneway/reservation/' }] },
  { title: 'Kyoto → Osaka regional train', due: 'Day of travel', status: 'waiting' as const,
    steps: ['Use Google Maps or JR West route finder.', 'Tap in with IC card.', 'Do not prebook.'],
    links: [{ label: 'JR West route finder', url: 'https://www.westjr.co.jp/travel-information/en/plan-your-trip/routes-schedule/' }] },
]

const HOTELS = [
  { name: 'KOALA BLDG. SHINJUKU', city: 'Tokyo', checkIn: '2026-05-25', checkOut: '2026-05-29', note: 'Yoyogi/Shibuya area' },
  { name: '箱根芦ノ湖ゴルフVilla', city: 'Hakone', checkIn: '2026-05-29', checkOut: '2026-05-30', note: 'Includes onsen/hot spring' },
  { name: '515 Yamadachō, Nakagyo Ward', city: 'Kyoto', checkIn: '2026-05-30', checkOut: '2026-06-03', note: 'Nakagyo Ward, Kyoto' },
  { name: 'Lien de premier (リアンドプルミエ)', city: 'Osaka', checkIn: '2026-06-03', checkOut: '2026-06-05', note: '' },
]

// ─── Helper ────────────────────────────────────────────────────────────────────

function pos(i: number, total: number): number {
  return (i + 1) / (total + 1)
}

function timeToString(t: string): string | null {
  const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  let h = parseInt(match[1])
  const m = parseInt(match[2])
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding Japan Trip 2026…')

  // 1. Get or create a demo user via service-role (bypasses auth)
  const { data: users } = await supabase.auth.admin.listUsers()
  let userId = users?.users?.[0]?.id

  if (!userId) {
    console.error('No users found. Please create a user via Supabase Auth first, then re-run this script.')
    process.exit(1)
  }

  console.log(`Using user: ${userId}`)

  // Ensure profile exists
  await supabase.from('profiles').upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true })

  // 2. Idempotent: skip if trip already exists
  const { data: existing } = await supabase
    .from('trips')
    .select('id')
    .eq('title', 'Japan Trip 2026')
    .eq('owner_id', userId)
    .single()

  if (existing) {
    console.log('Japan Trip 2026 already exists, skipping.')
    process.exit(0)
  }

  // 3. Create trip
  const { data: trip, error: tripErr } = await supabase
    .from('trips')
    .insert({ title: 'Japan Trip 2026', start_date: '2026-05-25', end_date: '2026-06-05', owner_id: userId })
    .select()
    .single()

  if (tripErr || !trip) { console.error(tripErr); process.exit(1) }

  // 4. Add owner as trip member
  await supabase.from('trip_members').insert({ trip_id: trip.id, user_id: userId, role: 'owner' })

  // 5. Insert day sections + blocks
  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i]
    const { data: section, error: secErr } = await supabase
      .from('sections')
      .insert({
        trip_id: trip.id,
        type: 'normal',
        mode: 'dayPlan',
        heading: `Day ${i + 1} — ${day.title}`,
        date: day.date,
        position: pos(i, DAYS.length),
      })
      .select()
      .single()

    if (secErr || !section) { console.error('section error', secErr); continue }

    for (let j = 0; j < day.items.length; j++) {
      const item = day.items[j] as any
      const isTrain = item.isTrain === true
      const isDining = item.cat === 'dining'
      const blockType = isTrain ? 'train' : 'place'

      const block: Record<string, any> = {
        section_id: section.id,
        trip_id: trip.id,
        type: blockType,
        position: pos(j, day.items.length),
        note_text: item.note,
        start_time: timeToString(item.time),
      }

      if (isTrain) {
        block.train_carrier = item.carrier
        block.train_depart_station = item.from
        block.train_arrive_station = item.to
      } else {
        block.place_name = item.name
        block.place_types = isDining
          ? ['restaurant']
          : item.cat === 'travel'
          ? ['transit_station']
          : ['tourist_attraction']
      }

      await supabase.from('blocks').insert(block)
    }

    console.log(`  ✓ Day ${i + 1}: ${day.title}`)
  }

  // 6. Insert hotels section
  const { data: hotelsSection } = await supabase
    .from('sections')
    .insert({ trip_id: trip.id, type: 'hotels', mode: 'placeList', heading: 'Hotels', position: pos(DAYS.length, DAYS.length + 2) })
    .select().single()

  if (hotelsSection) {
    for (let i = 0; i < HOTELS.length; i++) {
      const h = HOTELS[i]
      await supabase.from('blocks').insert({
        section_id: hotelsSection.id,
        trip_id: trip.id,
        type: 'hotel',
        position: pos(i, HOTELS.length),
        place_name: h.name,
        note_text: h.note || null,
        hotel_check_in: h.checkIn,
        hotel_check_out: h.checkOut,
      })
    }
    console.log('  ✓ Hotels section')
  }

  // 7. Insert action items section
  const { data: actionsSection } = await supabase
    .from('sections')
    .insert({ trip_id: trip.id, type: 'textOnly', mode: 'placeList', heading: 'Action Items', position: pos(DAYS.length + 1, DAYS.length + 2) })
    .select().single()

  if (actionsSection) {
    const { data: checklistBlock } = await supabase
      .from('blocks')
      .insert({ section_id: actionsSection.id, trip_id: trip.id, type: 'checklist', position: 0.5 })
      .select().single()

    if (checklistBlock) {
      const items = ACTIONS.map((a, i) => ({
        block_id: checklistBlock.id,
        trip_id: trip.id,
        text: a.title,
        checked: a.status === 'done',
        position: pos(i, ACTIONS.length),
        due_label: a.due,
        status: a.status,
        links: a.links,
        steps: a.steps,
      }))
      await supabase.from('checklist_items').insert(items)
      console.log('  ✓ Action items')
    }
  }

  console.log(`\nDone! Japan Trip 2026 seeded → tripId: ${trip.id}`)
  console.log(`Visit: http://localhost:3000/trips/${trip.id}/itinerary`)
}

main().catch((e) => { console.error(e); process.exit(1) })
