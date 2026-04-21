export type BlockType =
  | 'place'
  | 'note'
  | 'checklist'
  | 'flight'
  | 'train'
  | 'hotel'

export type SectionType =
  | 'normal'
  | 'hotels'
  | 'flights'
  | 'transit'
  | 'textOnly'

export type SectionMode = 'dayPlan' | 'placeList'

export type MemberRole = 'owner' | 'editor' | 'viewer'

export type ChecklistStatus = 'book_now' | 'waiting' | 'done'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  cover_image: string | null
  owner_id: string
  schema_version: number
  created_at: string
  updated_at: string
}

export interface TripMember {
  trip_id: string
  user_id: string
  role: MemberRole
  joined_at: string
  profile?: Profile
}

export interface Section {
  id: string
  trip_id: string
  type: SectionType
  mode: SectionMode
  heading: string
  date: string | null
  position: number
  created_at: string
  blocks?: Block[]
}

export interface Block {
  id: string
  section_id: string
  trip_id: string
  type: BlockType
  position: number
  note_text: string | null
  start_time: string | null
  end_time: string | null
  // Place
  place_name: string | null
  place_id: string | null
  place_lat: number | null
  place_lng: number | null
  place_address: string | null
  place_rating: number | null
  place_website: string | null
  place_types: string[] | null
  place_photo_url: string | null
  // Hotel
  hotel_check_in: string | null
  hotel_check_out: string | null
  hotel_confirmation: string | null
  hotel_traveler_names: string[] | null
  // Flight
  flight_airline: string | null
  flight_number: string | null
  flight_depart_airport: string | null
  flight_depart_time: string | null
  flight_arrive_airport: string | null
  flight_arrive_time: string | null
  flight_confirmation: string | null
  // Train
  train_carrier: string | null
  train_depart_station: string | null
  train_depart_time: string | null
  train_arrive_station: string | null
  train_arrive_time: string | null
  train_confirmation: string | null
  train_traveler_names: string[] | null
  // Meta
  added_by: string | null
  version: number
  created_at: string
  updated_at: string
  // Relations
  checklist_items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  block_id: string
  trip_id: string
  text: string
  checked: boolean
  position: number
  due_label: string | null
  status: ChecklistStatus | null
  links: { label: string; url: string }[] | null
  steps: string[] | null
  created_at: string
}

export interface Expense {
  id: string
  trip_id: string
  block_id: string | null
  amount: number
  currency: string
  category: string
  description: string
  date: string
  paid_by: string
  split_with: string[]
  created_at: string
  payer?: Profile
}

export interface PackingItem {
  id: string
  trip_id: string
  label: string
  packed: boolean
  category: string | null
  added_by: string | null
  position: number
}

export interface TripInvite {
  id: string
  trip_id: string
  token: string
  created_by: string
  expires_at: string
  used_at: string | null
}

// Calendar event normalized from blocks
export interface CalendarEvent {
  id: string
  start: Date
  end: Date
  title: string
  type: BlockType
  block: Block
  allDay?: boolean
}

// Place search result from Google Places API
export interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  website?: string
  types?: string[]
  photo_url?: string
  opening_hours?: { weekday_text?: string[] }
}
