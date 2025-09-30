import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to check if current user owns the dream
function checkDreamOwnership(
  dream: any, 
  currentUser: any, 
  currentAnonymousUserId: string | null
): boolean {
  // If user is authenticated, check if dream.user_id matches current user
  if (currentUser && dream.user_id) {
    return dream.user_id === currentUser.id;
  }
  
  // If user is anonymous, check if dream.anonymous_user_id matches current anonymous user
  if (currentAnonymousUserId && dream.anonymous_user_id) {
    return dream.anonymous_user_id === currentAnonymousUserId;
  }
  
  // If dream was created by authenticated user but current user is anonymous, deny access
  if (dream.user_id && !currentUser) {
    return false;
  }
  
  // If dream was created by anonymous user but current user is authenticated, deny access
  if (dream.anonymous_user_id && currentUser) {
    return false;
  }
  
  // If no user context and no dream ownership info, deny access
  if (!currentUser && !currentAnonymousUserId) {
    return false;
  }
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dreamId } = body;

    if (!dreamId) {
      return NextResponse.json(
        { error: 'Dream ID is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Image generation service not configured' },
        { status: 500 }
      );
    }

    // Get authentication information
    const authHeader = request.headers.get('authorization');
    let currentUser = null;
    let anonymousUserId = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && user) {
          currentUser = user;
        }
      } catch (error) {
        console.log('No valid auth token provided');
      }
    }
    
    // Check for anonymous user ID in request body
    if (body.anonymousUserId) {
      anonymousUserId = body.anonymousUserId;
    }

    // Step 1: Fetch the dream data
    const { data: dream, error: fetchError } = await supabaseAdmin
      .from('dreams')
      .select('*')
      .eq('id', dreamId)
      .single();

    if (fetchError || !dream) {
      console.error('Error fetching dream:', fetchError);
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }

    // Check if current user owns this dream (authorization)
    const userOwnsDream = checkDreamOwnership(dream, currentUser, anonymousUserId);
    if (!userOwnsDream) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only generate visualizations for your own dreams' },
        { status: 403 }
      );
    }

    // Check if dream already has an image
    if (dream.image_url) {
      return NextResponse.json({
        success: true,
        message: 'Dream already has an image',
        dream: dream
      });
    }

    // Step 2: Construct the image prompt with safety filtering
    const symbolsText = dream.identified_symbols?.map((s: any) => s.symbol).join(', ') || 'mystical elements';
    const archetypesText = dream.identified_archetypes?.map((a: any) => a.archetype).join(', ') || 'universal patterns';
    const themesText = dream.identified_themes?.join(', ') || 'transformation and growth';

    // Sanitize content to avoid safety system triggers while preserving dream essence
    const sanitizeContent = (content: string) => {
      return content
        // Replace only the most problematic words that commonly trigger safety systems
        .replace(/\b(violence|kill|murder|suicide|torture|abuse|attack|weapon|gun|knife|bomb|explosive|poison|drug|cocaine|heroin|meth|sex|sexual|nude|naked|breast|penis|vagina|rape|orgasm|porn|fetish|bdsm)\b/gi, 'profound experience')
        // Keep emotional words but make them more mystical
        .replace(/\b(terror|horror|nightmare|evil|demon|devil|hell|sin)\b/gi, 'profound mystery')
        .replace(/\b(rage|hate|revenge|angry|furious)\b/gi, 'passionate energy')
        // Keep psychological terms but make them more archetypal
        .replace(/\b(trauma|ptsd|panic attack|anxiety disorder|depression|mental illness)\b/gi, 'psychological journey')
        // Transform death into rebirth/transformation themes
        .replace(/\b(death|dying|dead|corpse|grave|tomb|funeral)\b/gi, 'rebirth')
        // Transform pain into sensation/awakening
        .replace(/\b(physical pain|hurt|injured|wounded|bleeding|blood)\b/gi, 'awakening sensation')
        .replace(/\b(fear|afraid|scared|terrified)\b/gi, 'mystical uncertainty')
        // Keep dark themes but make them more mystical and archetypal
        .replace(/\b(dark|darkness|shadow|shadowy)\b/gi, 'mystical shadow')
        .replace(/\b(guilt|shame|regret)\b/gi, 'inner wisdom')
        // Preserve more content for better dream interpretation
        .substring(0, 800); // Longer limit to preserve more dream essence
    };

    const safeTitle = sanitizeContent(dream.title);
    const safeInterpretation = sanitizeContent(dream.interpretation);
    const safeSymbols = sanitizeContent(symbolsText);
    const safeArchetypes = sanitizeContent(archetypesText);
    const safeThemes = sanitizeContent(themesText);

    // Create archetypal visual descriptions for more precise imagery
    const getArchetypeVisual = (archetype: string) => {
      const archetypeMap: { [key: string]: string } = {
        'The Hero': 'a figure in flowing robes standing tall with a mystical weapon or staff',
        'The Wise Old Man': 'an elder figure with a long beard and glowing eyes, surrounded by mystical symbols',
        'The Great Mother': 'a nurturing figure with flowing garments and maternal energy',
        'The Shadow': 'a mysterious figure emerging from darkness with ambiguous features',
        'The Anima': 'a graceful feminine figure with ethereal beauty and flowing hair',
        'The Animus': 'a strong masculine figure with commanding presence and mystical aura',
        'The Trickster': 'a playful figure with mischievous energy and transformative power',
        'The Seeker': 'a figure on a journey with a lantern or guiding light',
        'The Healer': 'a figure with healing energy and restorative power',
        'The Teacher': 'a figure with knowledge symbols and wisdom emanating from them',
        'The Guardian': 'a protective figure with shield-like elements and watchful presence',
        'The Magician': 'a figure with magical tools and transformative energy'
      };
      
      // Find the best match (case insensitive, partial match)
      const normalizedArchetype = archetype.toLowerCase();
      for (const [key, visual] of Object.entries(archetypeMap)) {
        if (normalizedArchetype.includes(key.toLowerCase().replace('the ', ''))) {
          return visual;
        }
      }
      
      return 'a mystical figure with archetypal presence and symbolic elements';
    };

    // Create a more precise, tarot-like prompt that captures the dream's essence
    const createTarotStylePrompt = (dream: any, symbols: string, archetypes: string, themes: string) => {
      // Extract key visual elements from the dream
      const keySymbols = dream.identified_symbols?.slice(0, 3).map((s: any) => s.symbol).join(', ') || 'mystical elements';
      const primaryArchetype = dream.identified_archetypes?.[0]?.archetype || 'The Seeker';
      const archetypeVisual = getArchetypeVisual(primaryArchetype);
      const mainThemes = dream.identified_themes?.slice(0, 2).join(' and ') || 'transformation';
      
      return `Create a mystical tarot card-style digital painting with a deep purple, indigo, and violet color palette. Vertical composition with these specific elements:

CENTRAL FIGURE: ${archetypeVisual}
PRIMARY SYMBOLS: ${keySymbols} arranged around the central figure
THEMES: ${mainThemes} represented through symbolic elements

STYLE: Ethereal, mystical, and dreamlike with flowing purple gradients, indigo shadows, and silver-gold highlights. The composition should be centered and balanced like a tarot card, with symbolic elements arranged in a meaningful way around the central archetypal figure.

LIGHTING: Soft, diffused lighting with ethereal glows emanating from the symbols and archetypal figure. Deep shadows in purple and indigo tones create depth and mystery.

TECHNIQUE: Highly detailed digital art with a painterly quality, rich textures, and mystical atmosphere. The overall feel should be introspective and profound, like a window into the unconscious mind.

CRITICAL: Absolutely no text, words, letters, or written symbols anywhere in the image. Pure visual symbolism only.`;
    };

    let imagePrompt = createTarotStylePrompt(dream, safeSymbols, safeArchetypes, safeThemes);

    // DALL-E 3 has a 4000 character limit for prompts
    if (imagePrompt.length > 4000) {
      console.log('Prompt too long, truncating...');
      imagePrompt = imagePrompt.substring(0, 3900) + '...';
    }

    console.log('Generated image prompt (length:', imagePrompt.length, '):', imagePrompt);

    // Step 3: Generate the image using OpenAI DALL-E 3
    let attempts = 0;
    const maxAttempts = 2;
    let finalPrompt = imagePrompt;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Generating image with prompt length ${finalPrompt.length}`);
        
        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: finalPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'hd',
            style: 'vivid'
          }),
        });

        if (!openaiResponse.ok) {
          console.error('OpenAI API response not ok:', openaiResponse.status, openaiResponse.statusText);
          
          // Try to get error details
          let errorMessage = `OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`;
          try {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API error response:', errorText);
            
            // Try to parse as JSON
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = `OpenAI API error: ${errorData.error?.message || errorData.message || errorText}`;
            } catch {
              // If not JSON, use the raw text
              errorMessage = `OpenAI API error: ${errorText}`;
            }
          } catch (e) {
            console.error('Failed to read error response:', e);
          }
          
          // If it's a safety system rejection and we have more attempts, try with a safer but still thematic prompt
          if (errorMessage.includes('safety system') && attempts < maxAttempts - 1) {
            console.log('Safety system rejection detected, trying with safer thematic prompt...');
            
            // Create a safer version that still captures the dream's essence
            const safeSymbolsList = dream.identified_symbols?.map((s: any) => 
              s.symbol.replace(/[^\w\s]/g, '').toLowerCase()
            ).filter((s: string) => s.length > 0).join(', ') || 'mystical elements';
            
            const safeArchetypesList = dream.identified_archetypes?.map((a: any) => 
              a.archetype.replace(/[^\w\s]/g, '').toLowerCase()
            ).filter((a: string) => a.length > 0).join(', ') || 'universal patterns';
            
            // Create a safer but still tarot-like fallback prompt
            const primarySymbol = dream.identified_symbols?.[0]?.symbol?.replace(/[^\w\s]/g, '').toLowerCase() || 'mystical symbol';
            const primaryArchetype = dream.identified_archetypes?.[0]?.archetype || 'The Seeker';
            const archetypeVisual = getArchetypeVisual(primaryArchetype);
            
            finalPrompt = `Create a mystical tarot card-style digital painting with deep purple, indigo, and violet color palette. Vertical composition featuring: ${archetypeVisual} as the central figure with ${primarySymbol} symbol. Ethereal, flowing gradients with silver-gold highlights. Soft, diffused lighting with ethereal glows. Highly detailed digital art with painterly quality and mystical atmosphere. Centered, balanced composition like a tarot card. Absolutely no text, words, or letters anywhere. Pure visual symbolism only.`;
            
            attempts++;
            continue; // Try again with the safer prompt
          }
          
          throw new Error(errorMessage);
        }

        const openaiData = await openaiResponse.json();
        console.log('OpenAI API response:', openaiData);
        
        if (!openaiData.data || !openaiData.data[0] || !openaiData.data[0].url) {
          console.error('Invalid OpenAI response structure:', openaiData);
          throw new Error('Invalid response from OpenAI API');
        }
        
        const imageUrl = openaiData.data[0].url;

        if (!imageUrl) {
          throw new Error('No image URL received from OpenAI');
        }

        // Step 4: Download the image from OpenAI
        console.log('Downloading image from:', imageUrl);
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          console.error('Failed to download image:', imageResponse.status, imageResponse.statusText);
          throw new Error(`Failed to download image from OpenAI: ${imageResponse.status} ${imageResponse.statusText}`);
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        console.log('Image downloaded successfully, size:', imageBuffer.byteLength, 'bytes');

        // Step 5: Upload to Supabase Storage
        const fileName = `dream-${dreamId}-${Date.now()}.png`;
        console.log('Uploading image to Supabase storage:', fileName);
      
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('dream_images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          throw new Error(`Failed to upload image to storage: ${uploadError.message || 'Unknown error'}`);
        }
        
        console.log('Image uploaded successfully to Supabase storage');

        // Step 6: Get the public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('dream_images')
          .getPublicUrl(fileName);

        const publicImageUrl = urlData.publicUrl;
        console.log('Generated public URL:', publicImageUrl);

        // Step 7: Update the dream record with the image URL
        console.log('Updating dream record with image URL');
        const { data: updatedDream, error: updateError } = await supabaseAdmin
          .from('dreams')
          .update({ image_url: publicImageUrl })
          .eq('id', dreamId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating dream with image URL:', updateError);
          throw new Error(`Failed to update dream record: ${updateError.message || 'Unknown error'}`);
        }

        console.log(`Successfully generated and saved image for dream ${dreamId}`);

        return NextResponse.json({
          success: true,
          message: 'Dream image generated successfully',
          dream: updatedDream
        });

      } catch (imageError) {
        console.error('Image generation error:', imageError);
        return NextResponse.json(
          { error: `Image generation failed: ${imageError instanceof Error ? imageError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Error in dream visualization API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Internal server error during image generation' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred during image generation' },
      { status: 500 }
    );
  }
}
