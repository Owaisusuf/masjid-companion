-- Create a single-row table for prayer configuration (shared across all devices)
CREATE TABLE public.prayer_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mode TEXT NOT NULL DEFAULT 'auto' CHECK (mode IN ('auto', 'manual')),
  fajr TEXT NOT NULL DEFAULT '5:55 AM',
  dhuhr TEXT NOT NULL DEFAULT '1:15 PM',
  asr TEXT NOT NULL DEFAULT '4:45 PM',
  maghrib TEXT NOT NULL DEFAULT '6:43 PM',
  isha TEXT NOT NULL DEFAULT '8:10 PM',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prayer_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read prayer times
CREATE POLICY "Anyone can read prayer config"
  ON public.prayer_config FOR SELECT
  USING (true);

-- Anyone can update (admin is password-protected in the app)
CREATE POLICY "Anyone can update prayer config"
  ON public.prayer_config FOR UPDATE
  USING (true);

-- Anyone can insert (for initial seed)
CREATE POLICY "Anyone can insert prayer config"
  ON public.prayer_config FOR INSERT
  WITH CHECK (true);

-- Seed with default values
INSERT INTO public.prayer_config (id, mode, fajr, dhuhr, asr, maghrib, isha)
VALUES (1, 'auto', '5:55 AM', '1:15 PM', '4:45 PM', '6:43 PM', '8:10 PM');

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_config;