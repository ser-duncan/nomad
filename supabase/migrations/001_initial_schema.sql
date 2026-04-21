-- UUID functions are built-in on Supabase (pgcrypto not needed)

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      text UNIQUE,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz DEFAULT now()
);

-- Trips
CREATE TABLE trips (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  cover_image     text,
  owner_id        uuid NOT NULL REFERENCES profiles(id),
  schema_version  int DEFAULT 1,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Trip members (all roles are equal for feature access)
CREATE TABLE trip_members (
  trip_id    uuid REFERENCES trips(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at  timestamptz DEFAULT now(),
  PRIMARY KEY (trip_id, user_id)
);

-- Sections (days or grouped content like Hotels, Flights)
CREATE TABLE sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  type        text NOT NULL DEFAULT 'normal' CHECK (type IN ('normal', 'hotels', 'flights', 'transit', 'textOnly')),
  mode        text NOT NULL DEFAULT 'dayPlan' CHECK (mode IN ('dayPlan', 'placeList')),
  heading     text NOT NULL,
  date        date,
  position    float NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Blocks (polymorphic content within sections)
CREATE TABLE blocks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id    uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  trip_id       uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  type          text NOT NULL CHECK (type IN ('place', 'note', 'checklist', 'flight', 'train', 'hotel')),
  position      float NOT NULL,
  version       int NOT NULL DEFAULT 1,
  -- Shared fields
  note_text     text,
  start_time    time,
  end_time      time,
  -- Place fields
  place_name    text,
  place_id      text,
  place_lat     double precision,
  place_lng     double precision,
  place_address text,
  place_rating  numeric(2,1),
  place_website text,
  place_types   text[],
  place_photo_url text,
  -- Hotel fields
  hotel_check_in        date,
  hotel_check_out       date,
  hotel_confirmation    text,
  hotel_traveler_names  text[],
  -- Flight fields
  flight_airline        text,
  flight_number         text,
  flight_depart_airport text,
  flight_depart_time    timestamptz,
  flight_arrive_airport text,
  flight_arrive_time    timestamptz,
  flight_confirmation   text,
  -- Train fields
  train_carrier         text,
  train_depart_station  text,
  train_depart_time     timestamptz,
  train_arrive_station  text,
  train_arrive_time     timestamptz,
  train_confirmation    text,
  train_traveler_names  text[],
  -- Metadata
  added_by    uuid REFERENCES profiles(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Spatial index on place coordinates
CREATE INDEX blocks_geo_idx ON blocks USING btree (place_lat, place_lng)
  WHERE place_lat IS NOT NULL AND place_lng IS NOT NULL;

-- Checklist items (child rows for checklist blocks)
CREATE TABLE checklist_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id    uuid NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  trip_id     uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  text        text NOT NULL,
  checked     boolean DEFAULT false,
  position    float NOT NULL,
  due_label   text,
  status      text CHECK (status IN ('book_now', 'waiting', 'done')),
  links       jsonb,
  steps       text[],
  created_at  timestamptz DEFAULT now()
);

-- Expenses
CREATE TABLE expenses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  block_id    uuid REFERENCES blocks(id) ON DELETE SET NULL,
  amount      numeric(12,2) NOT NULL,
  currency    char(3) NOT NULL DEFAULT 'JPY',
  category    text NOT NULL,
  description text NOT NULL,
  date        date NOT NULL,
  paid_by     uuid NOT NULL REFERENCES profiles(id),
  split_with  uuid[] NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

-- Packing items
CREATE TABLE packing_items (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id   uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  label     text NOT NULL,
  packed    boolean DEFAULT false,
  category  text,
  added_by  uuid REFERENCES profiles(id),
  position  float NOT NULL
);

-- Trip invites (token-based, never expose trip_id in URL)
CREATE TABLE trip_invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  token       text UNIQUE NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_by  uuid NOT NULL REFERENCES profiles(id),
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  used_at     timestamptz
);

-- Auto-update updated_at on trips
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blocks_updated_at BEFORE UPDATE ON blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
