-- Script to migrate existing dreams to the new tagging system
-- Run this AFTER creating the tags and dream_tags tables

-- First, add the identified_themes column to the dreams table if it doesn't exist
ALTER TABLE public.dreams ADD COLUMN IF NOT EXISTS identified_themes TEXT[];

-- Now let's add themes to existing dreams based on their content
-- We'll extract themes from the interpretation text using simple pattern matching

-- Update existing dreams with themes based on common patterns
UPDATE public.dreams 
SET identified_themes = ARRAY['Transformation', 'Self-Discovery', 'Integration']
WHERE identified_themes IS NULL 
  AND (interpretation ILIKE '%transformation%' OR interpretation ILIKE '%change%' OR interpretation ILIKE '%growth%');

UPDATE public.dreams 
SET identified_themes = ARRAY['Shadow Work', 'Confronting Fear', 'Integration']
WHERE identified_themes IS NULL 
  AND (interpretation ILIKE '%shadow%' OR interpretation ILIKE '%fear%' OR interpretation ILIKE '%dark%');

UPDATE public.dreams 
SET identified_themes = ARRAY['Spiritual Awakening', 'Enlightenment', 'Transcendence']
WHERE identified_themes IS NULL 
  AND (interpretation ILIKE '%spiritual%' OR interpretation ILIKE '%awakening%' OR interpretation ILIKE '%enlightenment%');

UPDATE public.dreams 
SET identified_themes = ARRAY['Search for Identity', 'Self-Reflection', 'Individuation']
WHERE identified_themes IS NULL 
  AND (interpretation ILIKE '%identity%' OR interpretation ILIKE '%self%' OR interpretation ILIKE '%who am i%');

UPDATE public.dreams 
SET identified_themes = ARRAY['Healing Journey', 'Recovery', 'Integration']
WHERE identified_themes IS NULL 
  AND (interpretation ILIKE '%healing%' OR interpretation ILIKE '%recovery%' OR interpretation ILIKE '%wholeness%');

-- Set default themes for any remaining dreams
UPDATE public.dreams 
SET identified_themes = ARRAY['Transformation', 'Self-Discovery', 'Integration']
WHERE identified_themes IS NULL;

-- Now create tags for all existing dreams
-- This will create tags for symbols, archetypes, and themes

-- Insert tags for symbols
INSERT INTO public.tags (name, type)
SELECT DISTINCT 
  jsonb_array_elements(identified_symbols)->>'symbol' as symbol_name,
  'symbol' as type
FROM public.dreams 
WHERE identified_symbols IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Insert tags for archetypes
INSERT INTO public.tags (name, type)
SELECT DISTINCT 
  jsonb_array_elements(identified_archetypes)->>'archetype' as archetype_name,
  'archetype' as type
FROM public.dreams 
WHERE identified_archetypes IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Insert tags for themes
INSERT INTO public.tags (name, type)
SELECT DISTINCT 
  unnest(identified_themes) as theme_name,
  'theme' as type
FROM public.dreams 
WHERE identified_themes IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Now link dreams to their tags
-- Link symbols
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT
  d.id as dream_id,
  t.id as tag_id
FROM public.dreams d,
     jsonb_array_elements(d.identified_symbols) as symbol_data,
     public.tags t
WHERE t.name = symbol_data->>'symbol' 
  AND t.type = 'symbol'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Link archetypes
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT
  d.id as dream_id,
  t.id as tag_id
FROM public.dreams d,
     jsonb_array_elements(d.identified_archetypes) as archetype_data,
     public.tags t
WHERE t.name = archetype_data->>'archetype' 
  AND t.type = 'archetype'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Link themes
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT
  d.id as dream_id,
  t.id as tag_id
FROM public.dreams d,
     unnest(d.identified_themes) as theme_name,
     public.tags t
WHERE t.name = theme_name 
  AND t.type = 'theme'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Verify the migration
SELECT 
  'Dreams with themes' as category,
  COUNT(*) as count
FROM public.dreams 
WHERE identified_themes IS NOT NULL

UNION ALL

SELECT 
  'Total tags created' as category,
  COUNT(*) as count
FROM public.tags

UNION ALL

SELECT 
  'Dream-tag relationships' as category,
  COUNT(*) as count
FROM public.dream_tags;
