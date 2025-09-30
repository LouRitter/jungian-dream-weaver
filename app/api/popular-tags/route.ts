import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');
    const type = searchParams.get('type'); // Optional filter by tag type

    if (!isSupabaseConfigured()) {
      // Return mock data if Supabase is not configured
      return NextResponse.json([
        {
          id: 1,
          name: 'Ocean',
          type: 'symbol',
          dream_count: 15
        },
        {
          id: 2,
          name: 'The Hero',
          type: 'archetype',
          dream_count: 12
        },
        {
          id: 3,
          name: 'Transformation',
          type: 'theme',
          dream_count: 18
        }
      ]);
    }

    let query = supabaseAdmin
      .from('tags')
      .select(`
        id,
        name,
        type,
        dream_count:dream_tags(count)
      `)
      .order('created_at', { ascending: false });

    // Filter by type if specified
    if (type && ['symbol', 'archetype', 'theme'].includes(type)) {
      query = query.eq('type', type);
    }

    // Limit the results
    query = query.limit(limit);

    const { data: tags, error } = await query;

    if (error) {
      console.error('Error fetching popular tags:', error);
      return NextResponse.json(
        { error: 'Failed to fetch popular tags' },
        { status: 500 }
      );
    }

    // Transform the data to include proper dream_count
    const transformedTags = tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      type: tag.type,
      dream_count: Array.isArray(tag.dream_count) ? tag.dream_count.length : 0
    })) || [];

    // Sort by dream count (most popular first) and then by name
    transformedTags.sort((a, b) => {
      if (b.dream_count !== a.dream_count) {
        return b.dream_count - a.dream_count;
      }
      return a.name.localeCompare(b.name);
    });

    // Return the top tags
    return NextResponse.json(transformedTags.slice(0, limit));

  } catch (error) {
    console.error('Error in popular-tags API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
