-- Safe Tag Cleanup Script
-- Run this step by step in your Supabase SQL Editor

-- Step 1: First, let's see what problematic tags we currently have
SELECT name, type, COUNT(dt.dream_id) as dream_count
FROM public.tags t
LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
WHERE LENGTH(name) > 20 OR name LIKE '%/%' OR name LIKE '%(%'
GROUP BY t.id, t.name, t.type
ORDER BY LENGTH(name) DESC;

-- Step 2: Create new clean tags
INSERT INTO public.tags (name, type) VALUES
-- Symbols
('Library', 'symbol'),
('Sky', 'symbol'),
('Spaceship', 'symbol'),
('Disaster', 'symbol'),
('Food', 'symbol'),
('War', 'symbol'),
('Perception', 'symbol'),
('Conducting', 'symbol'),
('Gardener', 'symbol'),
('Flowers', 'symbol'),
('Message', 'symbol'),

-- Archetypes
('The Tyrant', 'archetype'),
('The Wanderer', 'archetype'),

-- Themes
('Blindness', 'theme'),
('Catastrophe', 'theme'),
('Awareness', 'theme');

-- Step 3: Update dream_tags to use the new clean tags
-- Update symbols
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Library' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Vast Library/Chroniclers/Man with Golden Glowing Eye');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Sky' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Imploding Sky/Separating Souls into White Swords');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Spaceship' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Planet-sized Spaceship / Asteroid');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Disaster' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Unnamed Disaster on Earth');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Food' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Running out of Food / Toxic Asteroid Food');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'War' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'War / Rioting / Societal Collapse');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Perception' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Dreamer''s Unique Perception');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Conducting' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Conducting them into harmony');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Gardener' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'The Wise Gardener');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Flowers' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Singing Flowers');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Message' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Message: ''Let them be as they are - their diversity is their beauty.''');

-- Update archetypes
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'The Tyrant' AND type = 'archetype')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'The Tyrant (Shadow of the King)');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'The Wanderer' AND type = 'archetype')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'The Wanderer / The Outcast');

-- Update themes
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Blindness' AND type = 'theme')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Collective Unconscious Blindness');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Catastrophe' AND type = 'theme')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Impending Catastrophe & Existential Truth');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Awareness' AND type = 'theme')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Individuation Through Awareness');

-- Step 4: Remove the old problematic tags
DELETE FROM public.tags WHERE name IN (
    'Vast Library/Chroniclers/Man with Golden Glowing Eye',
    'Imploding Sky/Separating Souls into White Swords',
    'Planet-sized Spaceship / Asteroid',
    'Unnamed Disaster on Earth',
    'Running out of Food / Toxic Asteroid Food',
    'War / Rioting / Societal Collapse',
    'Dreamer''s Unique Perception',
    'Conducting them into harmony',
    'The Wise Gardener',
    'Singing Flowers',
    'Message: ''Let them be as they are - their diversity is their beauty.''',
    'The Tyrant (Shadow of the King)',
    'The Wanderer / The Outcast',
    'Collective Unconscious Blindness',
    'Impending Catastrophe & Existential Truth',
    'Individuation Through Awareness'
);

-- Step 5: Verify the cleanup worked
SELECT 'Cleanup complete! Here are the remaining tags:' as status;

-- Show final tag counts by type
SELECT type, COUNT(*) as tag_count
FROM public.tags 
GROUP BY type 
ORDER BY type;

-- Show the longest remaining tags
SELECT name, type, LENGTH(name) as length
FROM public.tags 
ORDER BY LENGTH(name) DESC
LIMIT 10;

-- Show the most popular tags
SELECT t.name, t.type, COUNT(dt.dream_id) as dream_count
FROM public.tags t
LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
GROUP BY t.id, t.name, t.type
ORDER BY dream_count DESC
LIMIT 20;
