-- Advanced Tag Cleanup Script
-- This will break down complex compound tags into simpler, more generalized ones

-- Step 1: First, let's see what problematic tags we currently have
SELECT name, type, COUNT(dt.dream_id) as dream_count
FROM public.tags t
LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
WHERE LENGTH(name) > 15 OR name LIKE '%/%' OR name LIKE '%(%' OR name LIKE '% %' AND name NOT IN ('The Hero', 'The Shadow', 'The Sun', 'The Moon')
GROUP BY t.id, t.name, t.type
ORDER BY LENGTH(name) DESC;

-- Step 2: Create new simplified tags
INSERT INTO public.tags (name, type) VALUES
-- Break down complex symbols into simpler ones
('Ancient', 'symbol'),
('Secrets', 'symbol'),
('Destiny', 'symbol'),
('Bugs', 'symbol'),
('Clearing', 'symbol'),
('Collecting', 'symbol'),
('People', 'symbol'),
('Conducting', 'symbol'),
('Exit', 'symbol'),
('Versions', 'symbol'),
('Disaster', 'symbol'),
('Eden', 'symbol'),
('Planet', 'symbol'),
('Merchants', 'symbol'),
('Falling', 'symbol'),
('Fire', 'symbol'),
('Books', 'symbol'),
('Food', 'symbol'),
('Words', 'symbol'),
('Android', 'symbol'),
('Void', 'symbol'),
('Wasp', 'symbol'),
('Reflections', 'symbol'),
('Maze', 'symbol'),
('Memories', 'symbol'),
('Message', 'symbol'),
('Figure', 'symbol'),
('Cloak', 'symbol'),
('Old Man', 'symbol'),
('Old Woman', 'symbol'),
('Path', 'symbol'),
('Shadows', 'symbol'),
('Perception', 'symbol'),
('Dancer', 'symbol'),
('Angel', 'symbol'),
('Reflection', 'symbol'),
('Water', 'symbol'),
('Running', 'symbol'),
('Crowds', 'symbol'),
('Searching', 'symbol'),
('Wings', 'symbol'),
('Flying', 'symbol'),
('Sky', 'symbol'),
('Smiling', 'symbol'),
('Waving', 'symbol'),
('Spaceship', 'symbol'),
('Stabbing', 'symbol'),
('Draining', 'symbol'),
('Stasis', 'symbol'),
('Hill', 'symbol'),
('Sunrise', 'symbol'),
('The Sun', 'symbol'),
('Touching', 'symbol'),
('Universe', 'symbol'),
('Tracking', 'symbol'),
('Surveillance', 'symbol'),
('Marketplace', 'symbol'),
('Vehicle', 'symbol'),
('Family', 'symbol'),
('War', 'symbol'),
('Whispering', 'symbol'),
('Voice', 'symbol'),
('Librarian', 'symbol'),
('Wise Old Woman', 'symbol'),
('Cities', 'symbol'),
('Change', 'symbol'),

-- Themes (break down complex themes)
('Transformation', 'theme'),
('Identity', 'theme'),
('Journey', 'theme'),
('Fear', 'theme'),
('Loss', 'theme'),
('Discovery', 'theme'),
('Connection', 'theme'),
('Isolation', 'theme'),
('Power', 'theme'),
('Control', 'theme'),
('Surveillance', 'theme'),
('Memory', 'theme'),
('Childhood', 'theme'),
('Communication', 'theme'),
('Guidance', 'theme'),
('Wisdom', 'theme'),
('Reflection', 'theme'),
('Movement', 'theme'),
('Flight', 'theme'),
('Joy', 'theme'),
('Violence', 'theme'),
('Stasis', 'theme'),
('Growth', 'theme'),
('Dawn', 'theme'),
('Light', 'theme'),
('Interaction', 'theme'),
('Monitoring', 'theme'),
('Community', 'theme'),
('Conflict', 'theme'),
('Whispering', 'theme'),
('Knowledge', 'theme'),
('Transformation', 'theme');

-- Step 3: Create mapping for complex tags to multiple simple tags
-- We'll need to handle each complex tag individually

-- Ancient Secrets/Destiny -> Ancient, Secrets, Destiny
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Ancient' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Ancient Secrets/Destiny');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Secrets' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Ancient Secrets/Destiny');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Destiny' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Ancient Secrets/Destiny');

-- Collecting Connected People -> Collecting, People
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Collecting' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Collecting Connected People');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'People' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Collecting Connected People');

-- Different Versions (happy, sad, angry) -> Versions
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Versions' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Different Versions (happy, sad, angry)');

-- Eden Planet (vacant) -> Eden, Planet
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Eden' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Eden Planet (vacant)');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Planet' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Eden Planet (vacant)');

-- Faceless Merchants -> Merchants
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Merchants' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Faceless Merchants');

-- Floating, Glowing Books -> Books
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Books' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Floating, Glowing Books');

-- Her Words -> Words
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Words' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Her Words');

-- Humanoid Android with Void for a Face -> Android, Void
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Android' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Humanoid Android with Void for a Face');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Void' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Humanoid Android with Void for a Face');

-- Humanoid Wasp -> Wasp
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Wasp' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Humanoid Wasp');

-- Infinite Reflections -> Reflections
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Reflections' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Infinite Reflections');

-- Memories from childhood -> Memories, Childhood
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Memories' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Memories from childhood');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Childhood' AND type = 'theme')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Memories from childhood');

-- Mysterious Figure in a Hooded Cloak -> Figure, Cloak
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Figure' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Mysterious Figure in a Hooded Cloak');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Cloak' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Mysterious Figure in a Hooded Cloak');

-- Path Winding into Shadows -> Path, Shadows
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Path' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Path Winding into Shadows');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Shadows' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Path Winding into Shadows');

-- Radiant Eastern European Ballet Dancer/Angel -> Dancer, Angel
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Dancer' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Radiant Eastern European Ballet Dancer/Angel');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Angel' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Radiant Eastern European Ballet Dancer/Angel');

-- Reflection in Water -> Reflection, Water
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Reflection' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Reflection in Water');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Water' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Reflection in Water');

-- Running through crowds -> Running, Crowds
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Running' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Running through crowds');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Crowds' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Running through crowds');

-- Searching for the real me -> Searching, Identity
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Searching' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Searching for the real me');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Identity' AND type = 'theme')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Searching for the real me');

-- Silk-like Fabric Wings/Flying Upwards -> Wings, Flying
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Wings' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Silk-like Fabric Wings/Flying Upwards');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Flying' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Silk-like Fabric Wings/Flying Upwards');

-- Smiling and Waving Reflection -> Smiling, Waving, Reflection
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Smiling' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Smiling and Waving Reflection');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Waving' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Smiling and Waving Reflection');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Reflection' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Smiling and Waving Reflection');

-- Stabbing and Life Draining -> Stabbing, Draining
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Stabbing' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Stabbing and Life Draining');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Draining' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Stabbing and Life Draining');

-- Steep hill -> Hill
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Hill' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Steep hill');

-- Touching books -> Touching, Books
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Touching' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Touching books');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Books' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Touching books');

-- Universe/Angels Tracking/Surveillance Team Leader -> Universe, Tracking, Surveillance
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Universe' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Universe/Angels Tracking/Surveillance Team Leader');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Tracking' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Universe/Angels Tracking/Surveillance Team Leader');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Surveillance' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Universe/Angels Tracking/Surveillance Team Leader');

-- Vast Marketplace -> Marketplace
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Marketplace' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Vast Marketplace');

-- Vehicle with family -> Vehicle, Family
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Vehicle' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Vehicle with family');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Family' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Vehicle with family');

-- Whispering Voice -> Whispering, Voice
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Whispering' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Whispering Voice');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Voice' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Whispering Voice');

-- Wise Librarian -> Librarian
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Librarian' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Wise Librarian');

-- Worlds/Cities Undergoing Dramatic Change -> Cities, Change
UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Cities' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Worlds/Cities Undergoing Dramatic Change');

UPDATE public.dream_tags 
SET tag_id = (SELECT id FROM public.tags WHERE name = 'Change' AND type = 'symbol')
WHERE tag_id = (SELECT id FROM public.tags WHERE name = 'Worlds/Cities Undergoing Dramatic Change');

-- Step 4: Remove the old complex tags
DELETE FROM public.tags WHERE name IN (
    'Ancient Secrets/Destiny',
    'Collecting Connected People',
    'Different Versions (happy, sad, angry)',
    'Eden Planet (vacant)',
    'Faceless Merchants',
    'Floating, Glowing Books',
    'Her Words',
    'Humanoid Android with Void for a Face',
    'Humanoid Wasp',
    'Infinite Reflections',
    'Memories from childhood',
    'Mysterious Figure in a Hooded Cloak',
    'Path Winding into Shadows',
    'Radiant Eastern European Ballet Dancer/Angel',
    'Reflection in Water',
    'Running through crowds',
    'Searching for the real me',
    'Silk-like Fabric Wings/Flying Upwards',
    'Smiling and Waving Reflection',
    'Stabbing and Life Draining',
    'Steep hill',
    'Touching books',
    'Universe/Angels Tracking/Surveillance Team Leader',
    'Vast Marketplace',
    'Vehicle with family',
    'Whispering Voice',
    'Wise Librarian',
    'Worlds/Cities Undergoing Dramatic Change'
);

-- Step 5: Handle duplicate tags (merge them)
-- Remove duplicates by keeping the one with the most dreams linked
DELETE FROM public.tags 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, type) id
    FROM public.tags t
    LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
    GROUP BY t.id, t.name, t.type
    ORDER BY name, type, COUNT(dt.dream_id) DESC
);

-- Update dream_tags to point to the remaining tags
WITH tag_mapping AS (
    SELECT 
        old_tag.id as old_id,
        new_tag.id as new_id
    FROM public.tags old_tag
    JOIN public.tags new_tag ON old_tag.name = new_tag.name AND old_tag.type = new_tag.type
    WHERE old_tag.id > new_tag.id
)
UPDATE public.dream_tags 
SET tag_id = tm.new_id
FROM tag_mapping tm
WHERE dream_tags.tag_id = tm.old_id;

-- Remove the duplicate tags
DELETE FROM public.tags 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, type) id
    FROM public.tags t
    LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
    GROUP BY t.id, t.name, t.type
    ORDER BY name, type, COUNT(dt.dream_id) DESC
);

-- Step 6: Final verification
SELECT 'Advanced tag cleanup complete!' as status;

-- Show final tag counts by type
SELECT type, COUNT(*) as tag_count
FROM public.tags 
GROUP BY type 
ORDER BY type;

-- Show the longest remaining tags
SELECT name, type, LENGTH(name) as length
FROM public.tags 
ORDER BY LENGTH(name) DESC
LIMIT 20;

-- Show the most popular tags
SELECT t.name, t.type, COUNT(dt.dream_id) as dream_count
FROM public.tags t
LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
GROUP BY t.id, t.name, t.type
ORDER BY dream_count DESC
LIMIT 30;
