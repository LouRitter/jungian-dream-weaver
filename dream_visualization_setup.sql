-- Dream Visualization Feature Setup
-- Run these queries in your Supabase SQL Editor

-- 1. Add a column to store the public URL of the generated image
ALTER TABLE public.dreams
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create a new storage bucket named 'dream_images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('dream_images', 'dream_images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set RLS policies for the bucket
-- Allow public read access to anyone
CREATE POLICY "Public read access for dream_images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'dream_images' );

-- Allow authenticated users to upload images (we will use a service key for this on the backend)
CREATE POLICY "Authenticated users can upload dream_images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'dream_images' AND auth.role() = 'authenticated' );

-- Allow service role to manage images (for backend operations)
CREATE POLICY "Service role can manage dream_images"
ON storage.objects FOR ALL
USING ( bucket_id = 'dream_images' AND auth.role() = 'service_role' );
