-- Comprehensive tag cleanup script
-- This handles both tag names and the dream_tags relationships

-- Step 1: Create a temporary table to track tag mappings
CREATE TEMP TABLE tag_mappings (
    old_name TEXT,
    new_name TEXT,
    type TEXT
);

-- Step 2: Define all the tag mappings
INSERT INTO tag_mappings (old_name, new_name, type) VALUES
-- Long compound symbol tags
('Vast Library/Chroniclers/Man with Golden Glowing Eye', 'Library', 'symbol'),
('Imploding Sky/Separating Souls into White Swords', 'Sky', 'symbol'),
('Planet-sized Spaceship / Asteroid', 'Spaceship', 'symbol'),
('Unnamed Disaster on Earth', 'Disaster', 'symbol'),
('Running out of Food / Toxic Asteroid Food', 'Food', 'symbol'),
('War / Rioting / Societal Collapse', 'War', 'symbol'),
('Dreamer''s Unique Perception', 'Perception', 'symbol'),
('Conducting them into harmony', 'Conducting', 'symbol'),
('The Wise Gardener', 'Gardener', 'symbol'),
('Singing Flowers', 'Flowers', 'symbol'),
('Message: ''Let them be as they are - their diversity is their beauty.''', 'Message', 'symbol'),

-- Archetype tags with descriptions
('The Hero (Observational)', 'The Hero', 'archetype'),
('The Tyrant (Shadow of the King)', 'The Tyrant', 'archetype'),
('The Wanderer / The Outcast', 'The Wanderer', 'archetype'),
('The Wise Old Man/Woman', 'The Wise Old Man', 'archetype'),
('The Wise Old Person/Spirit', 'The Wise Old Man', 'archetype'),
('The Shadow Self', 'The Shadow', 'archetype'),

-- Long theme tags
('Collective Unconscious Blindness', 'Blindness', 'theme'),
('Impending Catastrophe & Existential Truth', 'Catastrophe', 'theme'),
('Individuation Through Awareness', 'Awareness', 'theme'),
('Transformation & Growth', 'Transformation', 'theme'),
('Search for Identity', 'Identity', 'theme'),
('Integration of Self', 'Integration', 'theme'),
('Shadow Work & Confrontation', 'Shadow Work', 'theme'),
('Healing Journey', 'Healing', 'theme'),
('Spiritual Awakening', 'Awakening', 'theme');

-- Step 3: Create new cleaned tags for each mapping
INSERT INTO public.tags (name, type)
SELECT DISTINCT new_name, type
FROM tag_mappings
WHERE NOT EXISTS (
    SELECT 1 FROM public.tags 
    WHERE name = tag_mappings.new_name AND type = tag_mappings.type
);

-- Step 4: Update dream_tags to point to the new cleaned tags
UPDATE public.dream_tags 
SET tag_id = (
    SELECT t2.id 
    FROM tag_mappings tm
    JOIN public.tags t1 ON t1.name = tm.old_name AND t1.type = tm.type
    JOIN public.tags t2 ON t2.name = tm.new_name AND t2.type = tm.type
    WHERE t1.id = dream_tags.tag_id
)
WHERE tag_id IN (
    SELECT t.id 
    FROM tag_mappings tm
    JOIN public.tags t ON t.name = tm.old_name AND t.type = tm.type
);

-- Step 5: Remove the old tags that are no longer referenced
DELETE FROM public.tags 
WHERE name IN (
    SELECT old_name FROM tag_mappings
);

-- Step 6: Handle any remaining overly long tags (over 20 characters)
-- First, create generic replacements
INSERT INTO public.tags (name, type)
SELECT DISTINCT 
    CASE type
        WHEN 'symbol' THEN 'Mystery'
        WHEN 'archetype' THEN 'Pattern'
        WHEN 'theme' THEN 'Journey'
    END as name,
    type
FROM public.tags 
WHERE LENGTH(name) > 20
AND NOT EXISTS (
    SELECT 1 FROM public.tags t2 
    WHERE t2.name = CASE public.tags.type
        WHEN 'symbol' THEN 'Mystery'
        WHEN 'archetype' THEN 'Pattern'
        WHEN 'theme' THEN 'Journey'
    END 
    AND t2.type = public.tags.type
);

-- Update dream_tags for overly long tags
UPDATE public.dream_tags 
SET tag_id = (
    SELECT t2.id 
    FROM public.tags t1
    JOIN public.tags t2 ON t2.name = CASE t1.type
        WHEN 'symbol' THEN 'Mystery'
        WHEN 'archetype' THEN 'Pattern'
        WHEN 'theme' THEN 'Journey'
    END AND t2.type = t1.type
    WHERE t1.id = dream_tags.tag_id AND LENGTH(t1.name) > 20
)
WHERE tag_id IN (
    SELECT id FROM public.tags WHERE LENGTH(name) > 20
);

-- Remove the old overly long tags
DELETE FROM public.tags 
WHERE LENGTH(name) > 20;

-- Step 7: Clean up formatting
UPDATE public.tags 
SET name = TRIM(name);

-- Fix capitalization for archetypes (should start with "The ")
UPDATE public.tags 
SET name = 'The ' || INITCAP(SUBSTRING(name FROM 5))
WHERE type = 'archetype' AND name LIKE 'The %';

-- Fix capitalization for other types
UPDATE public.tags 
SET name = INITCAP(name)
WHERE type IN ('symbol', 'theme');

-- Step 8: Handle any duplicate tags that might have been created
-- Merge duplicate tags by keeping the one with the most dreams
WITH duplicate_tags AS (
    SELECT name, type, COUNT(*) as tag_count
    FROM public.tags 
    GROUP BY name, type 
    HAVING COUNT(*) > 1
),
keep_tag AS (
    SELECT t.id, t.name, t.type, COUNT(dt.dream_id) as dream_count,
           ROW_NUMBER() OVER (PARTITION BY t.name, t.type ORDER BY COUNT(dt.dream_id) DESC) as rn
    FROM public.tags t
    JOIN duplicate_tags dt ON t.name = dt.name AND t.type = dt.type
    LEFT JOIN public.dream_tags dt2 ON t.id = dt2.tag_id
    GROUP BY t.id, t.name, t.type
)
UPDATE public.dream_tags 
SET tag_id = kt.id
FROM keep_tag kt
JOIN public.tags t ON t.id = dream_tags.tag_id
WHERE t.name = kt.name AND t.type = kt.type AND kt.rn = 1;

-- Remove duplicate tags (keep the ones with the most dreams)
DELETE FROM public.tags 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, type) id
    FROM public.tags t
    LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
    GROUP BY t.id, t.name, t.type
    ORDER BY name, type, COUNT(dt.dream_id) DESC
);

-- Step 9: Final verification queries
SELECT 'Tag cleanup complete!' as status;

-- Show tag counts by type
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

-- Clean up temp table
DROP TABLE tag_mappings;
