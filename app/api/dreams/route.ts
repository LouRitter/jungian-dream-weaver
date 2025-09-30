import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const anonymousUserId = searchParams.get('anonymous_user_id');

    if (!userId && !anonymousUserId) {
      return NextResponse.json(
        { error: 'Either user_id or anonymous_user_id is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (anonymousUserId) {
      query = query.eq('anonymous_user_id', anonymousUserId);
    }

    const { data: dreams, error } = await query;

    if (error) {
      console.error('Error fetching dreams:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dreams' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      dreams: dreams || [],
      count: dreams?.length || 0
    });

  } catch (error) {
    console.error('Error in dreams API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
