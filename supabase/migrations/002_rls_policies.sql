-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_invites ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is a member of the given trip
-- SECURITY DEFINER so it works inside Realtime subscription context
CREATE OR REPLACE FUNCTION is_trip_member(p_trip_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM trip_members
    WHERE trip_id = p_trip_id AND user_id = auth.uid()
  );
$$;

-- Helper: check if current user can edit the given trip (owner or editor)
CREATE OR REPLACE FUNCTION can_edit_trip(p_trip_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM trip_members
    WHERE trip_id = p_trip_id AND user_id = auth.uid() AND role IN ('owner', 'editor')
  );
$$;

-- PROFILES
CREATE POLICY profiles_select ON profiles FOR SELECT USING (true); -- public profiles
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());

-- TRIPS
CREATE POLICY trips_select ON trips FOR SELECT
  USING (is_trip_member(id));

CREATE POLICY trips_insert ON trips FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY trips_update ON trips FOR UPDATE
  USING (can_edit_trip(id));

CREATE POLICY trips_delete ON trips FOR DELETE
  USING (owner_id = auth.uid());

-- TRIP_MEMBERS
CREATE POLICY trip_members_select ON trip_members FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY trip_members_insert ON trip_members FOR INSERT
  WITH CHECK (
    -- Can add yourself via invite flow (handled by server action)
    -- Owner can add others
    EXISTS (SELECT 1 FROM trips WHERE id = trip_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY trip_members_delete ON trip_members FOR DELETE
  USING (
    -- Owner can remove anyone; member can remove themselves
    EXISTS (SELECT 1 FROM trips WHERE id = trip_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
  );

-- SECTIONS
CREATE POLICY sections_select ON sections FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY sections_insert ON sections FOR INSERT
  WITH CHECK (can_edit_trip(trip_id));

CREATE POLICY sections_update ON sections FOR UPDATE
  USING (can_edit_trip(trip_id));

CREATE POLICY sections_delete ON sections FOR DELETE
  USING (can_edit_trip(trip_id));

-- BLOCKS
CREATE POLICY blocks_select ON blocks FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY blocks_insert ON blocks FOR INSERT
  WITH CHECK (can_edit_trip(trip_id));

CREATE POLICY blocks_update ON blocks FOR UPDATE
  USING (can_edit_trip(trip_id));

CREATE POLICY blocks_delete ON blocks FOR DELETE
  USING (can_edit_trip(trip_id));

-- CHECKLIST_ITEMS
CREATE POLICY checklist_items_select ON checklist_items FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY checklist_items_insert ON checklist_items FOR INSERT
  WITH CHECK (can_edit_trip(trip_id));

CREATE POLICY checklist_items_update ON checklist_items FOR UPDATE
  USING (can_edit_trip(trip_id));

CREATE POLICY checklist_items_delete ON checklist_items FOR DELETE
  USING (can_edit_trip(trip_id));

-- EXPENSES
CREATE POLICY expenses_select ON expenses FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY expenses_insert ON expenses FOR INSERT
  WITH CHECK (can_edit_trip(trip_id));

CREATE POLICY expenses_update ON expenses FOR UPDATE
  USING (can_edit_trip(trip_id));

CREATE POLICY expenses_delete ON expenses FOR DELETE
  USING (can_edit_trip(trip_id));

-- PACKING_ITEMS
CREATE POLICY packing_items_select ON packing_items FOR SELECT
  USING (is_trip_member(trip_id));

CREATE POLICY packing_items_insert ON packing_items FOR INSERT
  WITH CHECK (can_edit_trip(trip_id));

CREATE POLICY packing_items_update ON packing_items FOR UPDATE
  USING (can_edit_trip(trip_id));

CREATE POLICY packing_items_delete ON packing_items FOR DELETE
  USING (can_edit_trip(trip_id));

-- TRIP_INVITES
CREATE POLICY trip_invites_select ON trip_invites FOR SELECT
  USING (
    is_trip_member(trip_id)
    OR token = current_setting('request.jwt.claims', true)::json->>'invite_token'
  );

CREATE POLICY trip_invites_insert ON trip_invites FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM trips WHERE id = trip_id AND owner_id = auth.uid())
  );
