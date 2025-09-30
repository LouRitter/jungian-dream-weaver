-- Simple Tag Cleanup Script - Run Step by Step
-- This will clean up the complex tags you mentioned

-- Step 1: Create new simple tags
INSERT INTO public.tags (name, type) VALUES
-- Simple symbols
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
('Change', 'symbol');

-- Step 2: Update dream_tags to use new simple tags for complex ones
-- Ancient Secrets/Destiny -> Ancient, Secrets, Destiny
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Ancient' AND t.type = 'symbol'
WHERE old_tag.name = 'Ancient Secrets/Destiny'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Secrets' AND t.type = 'symbol'
WHERE old_tag.name = 'Ancient Secrets/Destiny'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Destiny' AND t.type = 'symbol'
WHERE old_tag.name = 'Ancient Secrets/Destiny'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Collecting Connected People -> Collecting, People
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Collecting' AND t.type = 'symbol'
WHERE old_tag.name = 'Collecting Connected People'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'People' AND t.type = 'symbol'
WHERE old_tag.name = 'Collecting Connected People'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Different Versions (happy, sad, angry) -> Versions
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Versions' AND t.type = 'symbol'
WHERE old_tag.name = 'Different Versions (happy, sad, angry)'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Eden Planet (vacant) -> Eden, Planet
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Eden' AND t.type = 'symbol'
WHERE old_tag.name = 'Eden Planet (vacant)'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Planet' AND t.type = 'symbol'
WHERE old_tag.name = 'Eden Planet (vacant)'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Faceless Merchants -> Merchants
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Merchants' AND t.type = 'symbol'
WHERE old_tag.name = 'Faceless Merchants'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Floating, Glowing Books -> Books
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Books' AND t.type = 'symbol'
WHERE old_tag.name = 'Floating, Glowing Books'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Her Words -> Words
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Words' AND t.type = 'symbol'
WHERE old_tag.name = 'Her Words'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Humanoid Android with Void for a Face -> Android, Void
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Android' AND t.type = 'symbol'
WHERE old_tag.name = 'Humanoid Android with Void for a Face'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Void' AND t.type = 'symbol'
WHERE old_tag.name = 'Humanoid Android with Void for a Face'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Humanoid Wasp -> Wasp
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Wasp' AND t.type = 'symbol'
WHERE old_tag.name = 'Humanoid Wasp'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Infinite Reflections -> Reflections
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Reflections' AND t.type = 'symbol'
WHERE old_tag.name = 'Infinite Reflections'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Memories from childhood -> Memories
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Memories' AND t.type = 'symbol'
WHERE old_tag.name = 'Memories from childhood'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Mysterious Figure in a Hooded Cloak -> Figure, Cloak
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Figure' AND t.type = 'symbol'
WHERE old_tag.name = 'Mysterious Figure in a Hooded Cloak'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Cloak' AND t.type = 'symbol'
WHERE old_tag.name = 'Mysterious Figure in a Hooded Cloak'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Path Winding into Shadows -> Path, Shadows
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Path' AND t.type = 'symbol'
WHERE old_tag.name = 'Path Winding into Shadows'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Shadows' AND t.type = 'symbol'
WHERE old_tag.name = 'Path Winding into Shadows'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Radiant Eastern European Ballet Dancer/Angel -> Dancer, Angel
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Dancer' AND t.type = 'symbol'
WHERE old_tag.name = 'Radiant Eastern European Ballet Dancer/Angel'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Angel' AND t.type = 'symbol'
WHERE old_tag.name = 'Radiant Eastern European Ballet Dancer/Angel'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Reflection in Water -> Reflection, Water
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Reflection' AND t.type = 'symbol'
WHERE old_tag.name = 'Reflection in Water'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Water' AND t.type = 'symbol'
WHERE old_tag.name = 'Reflection in Water'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Running through crowds -> Running, Crowds
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Running' AND t.type = 'symbol'
WHERE old_tag.name = 'Running through crowds'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Crowds' AND t.type = 'symbol'
WHERE old_tag.name = 'Running through crowds'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Searching for the real me -> Searching
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Searching' AND t.type = 'symbol'
WHERE old_tag.name = 'Searching for the real me'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Silk-like Fabric Wings/Flying Upwards -> Wings, Flying
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Wings' AND t.type = 'symbol'
WHERE old_tag.name = 'Silk-like Fabric Wings/Flying Upwards'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Flying' AND t.type = 'symbol'
WHERE old_tag.name = 'Silk-like Fabric Wings/Flying Upwards'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Smiling and Waving Reflection -> Smiling, Waving, Reflection
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Smiling' AND t.type = 'symbol'
WHERE old_tag.name = 'Smiling and Waving Reflection'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Waving' AND t.type = 'symbol'
WHERE old_tag.name = 'Smiling and Waving Reflection'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Reflection' AND t.type = 'symbol'
WHERE old_tag.name = 'Smiling and Waving Reflection'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Stabbing and Life Draining -> Stabbing, Draining
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Stabbing' AND t.type = 'symbol'
WHERE old_tag.name = 'Stabbing and Life Draining'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Draining' AND t.type = 'symbol'
WHERE old_tag.name = 'Stabbing and Life Draining'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Steep hill -> Hill
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Hill' AND t.type = 'symbol'
WHERE old_tag.name = 'Steep hill'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Touching books -> Touching, Books
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Touching' AND t.type = 'symbol'
WHERE old_tag.name = 'Touching books'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Books' AND t.type = 'symbol'
WHERE old_tag.name = 'Touching books'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Universe/Angels Tracking/Surveillance Team Leader -> Universe, Tracking, Surveillance
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Universe' AND t.type = 'symbol'
WHERE old_tag.name = 'Universe/Angels Tracking/Surveillance Team Leader'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Tracking' AND t.type = 'symbol'
WHERE old_tag.name = 'Universe/Angels Tracking/Surveillance Team Leader'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Surveillance' AND t.type = 'symbol'
WHERE old_tag.name = 'Universe/Angels Tracking/Surveillance Team Leader'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Vast Marketplace -> Marketplace
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Marketplace' AND t.type = 'symbol'
WHERE old_tag.name = 'Vast Marketplace'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Vehicle with family -> Vehicle, Family
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Vehicle' AND t.type = 'symbol'
WHERE old_tag.name = 'Vehicle with family'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Family' AND t.type = 'symbol'
WHERE old_tag.name = 'Vehicle with family'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Whispering Voice -> Whispering, Voice
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Whispering' AND t.type = 'symbol'
WHERE old_tag.name = 'Whispering Voice'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Voice' AND t.type = 'symbol'
WHERE old_tag.name = 'Whispering Voice'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Wise Librarian -> Librarian
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Librarian' AND t.type = 'symbol'
WHERE old_tag.name = 'Wise Librarian'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Worlds/Cities Undergoing Dramatic Change -> Cities, Change
INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Cities' AND t.type = 'symbol'
WHERE old_tag.name = 'Worlds/Cities Undergoing Dramatic Change'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

INSERT INTO public.dream_tags (dream_id, tag_id)
SELECT DISTINCT dt.dream_id, t.id
FROM public.dream_tags dt
JOIN public.tags old_tag ON dt.tag_id = old_tag.id
JOIN public.tags t ON t.name = 'Change' AND t.type = 'symbol'
WHERE old_tag.name = 'Worlds/Cities Undergoing Dramatic Change'
ON CONFLICT (dream_id, tag_id) DO NOTHING;

-- Step 3: Remove old complex tags
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

-- Step 4: Show results
SELECT 'Tag cleanup complete!' as status;

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
