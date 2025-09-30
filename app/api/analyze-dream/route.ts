import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Initialize the Google Generative AI client
const ai = new GoogleGenAI({});

// Type definitions for the analysis response
interface DreamSymbol {
  symbol: string;
  meaning: string;
}

interface DreamArchetype {
  archetype: string;
  representation: string;
}

interface DreamAnalysis {
  title: string;
  summary: string;
  interpretation: string;
  identified_symbols: DreamSymbol[];
  identified_archetypes: DreamArchetype[];
  identified_themes: string[];
  reflection_question: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { dream, anonymousUserId } = body;

    // Validate that dream is provided
    if (!dream || typeof dream !== 'string' || dream.trim().length === 0) {
      return NextResponse.json(
        { error: 'Dream description is required' },
        { status: 400 }
      );
    }

    // Check for user authentication
    const authHeader = request.headers.get('authorization');
    let currentUser = null;
    
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

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

        // Construct an enhanced prompt for profound analysis
        const prompt = `You are a master Jungian analyst with deep insight into the unconscious mind. Analyze this dream with wisdom and depth.

TAG RULES: Use 1-2 words max. No "/", "(", ")". Create separate tags for multiple concepts.

IMPORTANT LIMITS: Return MAXIMUM 5 symbols and MAXIMUM 3 archetypes. Choose only the most significant ones.

Respond ONLY with this JSON structure:

{
  "title": "Poetic, evocative title that captures the dream's essence",
  "summary": "A profound, insightful 1-2 sentence summary that reveals the dream's deeper meaning and psychological significance - not just what happened, but what it means for the soul's journey",
  "interpretation": "Detailed Jungian analysis exploring symbols, archetypes, and unconscious processes",
  "identified_symbols": [{"symbol": "Ocean", "meaning": "Profound psychological insight into this symbol's deeper significance and what it reveals about the dreamer's inner landscape"}],
  "identified_archetypes": [{"archetype": "The Hero", "representation": "Deep analysis of how this archetype manifests in the dream and what it reveals about the dreamer's psychological journey"}],
  "identified_themes": ["Transformation", "Identity", "Healing"],
  "reflection_question": "A penetrating question that guides deeper self-reflection"
}

Dream: ${dream}`;

    // Generate content using the model with timeout
    const startTime = Date.now();
    console.log('Starting dream analysis...');
    
    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timeout after 30 seconds')), 30000)
      )
    ]) as any;
    
    const endTime = Date.now();
    console.log(`Analysis completed in ${endTime - startTime}ms`);
    
    const text = response.text;

    // Check if response text exists
    if (!text) {
      throw new Error('No response text received from AI model');
    }

    // Parse the JSON response
    let analysis: DreamAnalysis;
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = text.trim();
      // Remove any markdown code blocks if present
      const jsonText = cleanedText.replace(/```json\n?|\n?```/g, '');
      analysis = JSON.parse(jsonText);
      console.log('Parsed analysis:', JSON.stringify(analysis, null, 2));
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json(
        { error: 'Failed to parse analysis response' },
        { status: 500 }
      );
    }

    // Validate the parsed JSON has the required structure
    if (!analysis.title || !analysis.summary || !analysis.interpretation || 
        !analysis.reflection_question) {
      console.error('Invalid analysis structure:', analysis);
      return NextResponse.json(
        { error: 'Invalid analysis structure received' },
        { status: 500 }
      );
    }

        // Ensure all required fields exist with fallbacks
        if (!analysis.identified_themes || !Array.isArray(analysis.identified_themes)) {
          analysis.identified_themes = ["Transformation", "Self-Discovery", "Integration"];
          console.log('Added fallback themes:', analysis.identified_themes);
        }
        
        if (!analysis.identified_symbols || !Array.isArray(analysis.identified_symbols)) {
          analysis.identified_symbols = [];
          console.log('Added fallback symbols');
        }
        
        if (!analysis.identified_archetypes || !Array.isArray(analysis.identified_archetypes)) {
          analysis.identified_archetypes = [];
          console.log('Added fallback archetypes');
        }

    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      // Return analysis without saving to database
      return NextResponse.json(analysis, { status: 200 });
    }

    // Save analysis to Supabase database with new tagging system
    try {
      // Prepare dream data based on user authentication status
      const dreamData: any = {
        title: analysis.title,
        summary: analysis.summary,
        interpretation: analysis.interpretation,
        reflection_question: analysis.reflection_question,
        identified_symbols: analysis.identified_symbols,
        identified_archetypes: analysis.identified_archetypes,
        identified_themes: analysis.identified_themes,
        dream_text: dream.trim(),
        is_private: false // Default to public, will be configurable later
      };

      // Add user association based on authentication status
      if (currentUser) {
        dreamData.user_id = currentUser.id;
        console.log('Saving dream for authenticated user:', currentUser.id);
      } else if (anonymousUserId) {
        dreamData.anonymous_user_id = anonymousUserId;
        console.log('Saving dream for anonymous user:', anonymousUserId);
      }

      // First, save the dream
      const { data: savedDream, error: dbError } = await supabaseAdmin
        .from('dreams')
        .insert(dreamData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save dream analysis to database');
      }

      // Now handle the tagging system
      const tagIds: number[] = [];

      // Process symbols
      for (const symbol of analysis.identified_symbols) {
        const { data: tag, error: tagError } = await supabaseAdmin
          .from('tags')
          .upsert(
            { name: symbol.symbol, type: 'symbol' },
            { onConflict: 'name' }
          )
          .select()
          .single();

        if (tagError) {
          console.error('Error upserting symbol tag:', tagError);
          continue;
        }

        tagIds.push(tag.id);
      }

      // Process archetypes
      for (const archetype of analysis.identified_archetypes) {
        const { data: tag, error: tagError } = await supabaseAdmin
          .from('tags')
          .upsert(
            { name: archetype.archetype, type: 'archetype' },
            { onConflict: 'name' }
          )
          .select()
          .single();

        if (tagError) {
          console.error('Error upserting archetype tag:', tagError);
          continue;
        }

        tagIds.push(tag.id);
      }

      // Process themes
      for (const theme of analysis.identified_themes) {
        const { data: tag, error: tagError } = await supabaseAdmin
          .from('tags')
          .upsert(
            { name: theme, type: 'theme' },
            { onConflict: 'name' }
          )
          .select()
          .single();

        if (tagError) {
          console.error('Error upserting theme tag:', tagError);
          continue;
        }

        tagIds.push(tag.id);
      }

      // Link all tags to the dream
      if (tagIds.length > 0) {
        const dreamTags = tagIds.map(tagId => ({
          dream_id: savedDream.id,
          tag_id: tagId
        }));

        const { error: linkError } = await supabaseAdmin
          .from('dream_tags')
          .insert(dreamTags);

        if (linkError) {
          console.error('Error linking tags to dream:', linkError);
          // Don't fail the request, just log the error
        }
      }

      // Return the complete database record including the ID
      return NextResponse.json(savedDream, { status: 200 });
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      return NextResponse.json(
        { error: 'Failed to save dream analysis' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in dream analysis API:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API authentication failed' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during dream analysis' },
      { status: 500 }
    );
  }
}
