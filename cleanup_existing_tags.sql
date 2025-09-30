-- Script to clean up existing tags in the database
-- This will replace long, compound tags with shorter, cleaner versions

-- First, let's see what problematic tags we have
SELECT name, type, COUNT(*) as dream_count 
FROM public.tags 
WHERE LENGTH(name) > 25 OR name LIKE '%/%' OR name LIKE '%(%'
ORDER BY LENGTH(name) DESC;

-- Now let's clean up the problematic tags
-- We'll create a mapping of old tags to new, cleaner tags

-- 1. Update long compound tags to shorter versions
UPDATE public.tags 
SET name = 'The Library' 
WHERE name = 'Vast Library/Chroniclers/Man with Golden Glowing Eye';

UPDATE public.tags 
SET name = 'The Sky' 
WHERE name = 'Imploding Sky/Separating Souls into White Swords';

UPDATE public.tags 
SET name = 'The Sun' 
WHERE name = 'The Sun (Ultimate Symbol)';

UPDATE public.tags 
SET name = 'The Garden' 
WHERE name = 'Garden of Singing Flowers';

UPDATE public.tags 
SET name = 'The Ocean' 
WHERE name = 'Vast Ocean Depths';

UPDATE public.tags 
SET name = 'The Forest' 
WHERE name = 'Dark Forest Path';

UPDATE public.tags 
SET name = 'The House' 
WHERE name = 'Abandoned House/Empty Rooms';

UPDATE public.tags 
SET name = 'The Bridge' 
WHERE name = 'Collapsing Bridge/Crossing the Void';

UPDATE public.tags 
SET name = 'The Mirror' 
WHERE name = 'Shattered Mirror/Reflections of Self';

UPDATE public.tags 
SET name = 'The Key' 
WHERE name = 'Golden Key/Unlocking Secrets';

-- 2. Clean up archetype tags with descriptions in parentheses
UPDATE public.tags 
SET name = 'The Hero' 
WHERE name = 'The Hero (Observational)';

UPDATE public.tags 
SET name = 'The Tyrant' 
WHERE name = 'The Tyrant (Shadow of the King)';

UPDATE public.tags 
SET name = 'The Wanderer' 
WHERE name = 'The Wanderer / The Outcast';

UPDATE public.tags 
SET name = 'The Wise Old Man' 
WHERE name = 'The Wise Old Man/Woman';

UPDATE public.tags 
SET name = 'The Wise Old Man' 
WHERE name = 'The Wise Old Person/Spirit';

UPDATE public.tags 
SET name = 'The Shadow' 
WHERE name = 'The Shadow Self';

-- 3. Clean up theme tags that are too long
UPDATE public.tags 
SET name = 'Blindness' 
WHERE name = 'Collective Unconscious Blindness';

UPDATE public.tags 
SET name = 'Catastrophe' 
WHERE name = 'Impending Catastrophe & Existential Truth';

UPDATE public.tags 
SET name = 'Awareness' 
WHERE name = 'Individuation Through Awareness';

UPDATE public.tags 
SET name = 'Transformation' 
WHERE name = 'Transformation & Growth';

UPDATE public.tags 
SET name = 'Identity' 
WHERE name = 'Search for Identity';

UPDATE public.tags 
SET name = 'Integration' 
WHERE name = 'Integration of Self';

UPDATE public.tags 
SET name = 'Shadow Work' 
WHERE name = 'Shadow Work & Confrontation';

UPDATE public.tags 
SET name = 'Healing' 
WHERE name = 'Healing Journey';

UPDATE public.tags 
SET name = 'Awakening' 
WHERE name = 'Spiritual Awakening';

-- 4. Clean up symbol tags that are too descriptive
UPDATE public.tags 
SET name = 'Spaceship' 
WHERE name = 'Planet-sized Spaceship / Asteroid';

UPDATE public.tags 
SET name = 'Disaster' 
WHERE name = 'Unnamed Disaster on Earth';

UPDATE public.tags 
SET name = 'Food' 
WHERE name = 'Running out of Food / Toxic Asteroid Food';

UPDATE public.tags 
SET name = 'War' 
WHERE name = 'War / Rioting / Societal Collapse';

UPDATE public.tags 
SET name = 'Perception' 
WHERE name = 'Dreamer''s Unique Perception';

UPDATE public.tags 
SET name = 'Conducting' 
WHERE name = 'Conducting them into harmony';

UPDATE public.tags 
SET name = 'Gardener' 
WHERE name = 'The Wise Gardener';

UPDATE public.tags 
SET name = 'Flowers' 
WHERE name = 'Singing Flowers';

UPDATE public.tags 
SET name = 'Message' 
WHERE name = 'Message: ''Let them be as they are - their diversity is their beauty.''';

-- 5. Remove any remaining tags that are still too long (over 20 characters)
-- and replace with generic alternatives
UPDATE public.tags 
SET name = 'Mystery' 
WHERE LENGTH(name) > 20 AND type = 'symbol';

UPDATE public.tags 
SET name = 'Pattern' 
WHERE LENGTH(name) > 20 AND type = 'archetype';

UPDATE public.tags 
SET name = 'Journey' 
WHERE LENGTH(name) > 20 AND type = 'theme';

-- 6. Handle any duplicate tags that might have been created
-- First, let's see if there are duplicates
SELECT name, type, COUNT(*) as count
FROM public.tags 
GROUP BY name, type 
HAVING COUNT(*) > 1;

-- If there are duplicates, we'll need to merge them
-- This is more complex and should be done carefully

-- 7. Final cleanup - ensure all tags are properly formatted
-- Remove any extra spaces and ensure consistent capitalization
UPDATE public.tags 
SET name = TRIM(name);

-- Capitalize first letter of each word for consistency
UPDATE public.tags 
SET name = INITCAP(name);

-- Fix common capitalization issues for archetypes
UPDATE public.tags 
SET name = 'The ' || SUBSTRING(name FROM 5) 
WHERE name LIKE 'The %' AND type = 'archetype';

-- 8. Verify the cleanup worked
SELECT name, type, COUNT(*) as dream_count 
FROM public.tags 
WHERE LENGTH(name) > 20
ORDER BY LENGTH(name) DESC;

-- Show final tag counts by type
SELECT type, COUNT(*) as tag_count
FROM public.tags 
GROUP BY type 
ORDER BY type;

-- Show the most common tags after cleanup
SELECT name, type, COUNT(dt.dream_id) as dream_count
FROM public.tags t
LEFT JOIN public.dream_tags dt ON t.id = dt.tag_id
GROUP BY t.id, t.name, t.type
ORDER BY dream_count DESC
LIMIT 20;
