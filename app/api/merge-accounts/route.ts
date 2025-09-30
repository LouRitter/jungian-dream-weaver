import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { anonymousUserId } = body;

    // Validate that anonymousUserId is provided
    if (!anonymousUserId || typeof anonymousUserId !== 'string') {
      return NextResponse.json(
        { error: 'Anonymous user ID is required' },
        { status: 400 }
      );
    }

    // Check for user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      
      if (error || !user) {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }

      // Update all dreams with the anonymous_user_id to have the new permanent user_id
      const { data: updatedDreams, error: updateError } = await supabaseAdmin
        .from('dreams')
        .update({ 
          user_id: user.id,
          anonymous_user_id: null // Clear the anonymous ID
        })
        .eq('anonymous_user_id', anonymousUserId)
        .select();

      if (updateError) {
        console.error('Error merging accounts:', updateError);
        return NextResponse.json(
          { error: 'Failed to merge accounts' },
          { status: 500 }
        );
      }

      console.log(`Successfully merged ${updatedDreams?.length || 0} dreams for user ${user.id}`);

      return NextResponse.json({
        success: true,
        message: `Successfully merged ${updatedDreams?.length || 0} dreams to your account`,
        dreamsMerged: updatedDreams?.length || 0
      });

    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Error in merge accounts API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Internal server error during account merge' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred during account merge' },
      { status: 500 }
    );
  }
}
