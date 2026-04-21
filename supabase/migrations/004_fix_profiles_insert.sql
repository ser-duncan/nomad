-- Allow the auth trigger to insert profiles (trigger runs as postgres/superuser
-- but adding an explicit policy avoids any RLS edge cases)
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (true);
