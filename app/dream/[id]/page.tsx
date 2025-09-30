"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../components/providers/AuthProvider";
import DreamAnalysisClient from './DreamAnalysisClient';

// Type definitions for dream analysis
interface DreamSymbol {
  symbol: string;
  meaning: string;
}

interface DreamArchetype {
  archetype: string;
  representation: string;
}

interface DreamAnalysis {
  id: number;
  title: string;
  summary: string;
  interpretation: string;
  identified_symbols: DreamSymbol[];
  identified_archetypes: DreamArchetype[];
  identified_themes: string[];
  reflection_question: string;
  image_url?: string;
  created_at: string;
  is_private: boolean;
  user_id: string | null;
  anonymous_user_id: string | null;
  dream_text: string;
}

interface DreamAnalysisPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to check if current user owns the dream
function checkDreamOwnership(
  dream: DreamAnalysis, 
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

export default function DreamAnalysisPage({ params }: DreamAnalysisPageProps) {
  const [dream, setDream] = useState<DreamAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizationError, setVisualizationError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [canVisualize, setCanVisualize] = useState(false);
  const router = useRouter();
  const { user, session, anonymousUserId } = useAuth();

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const resolvedParams = await params;
        const { id: dreamId } = resolvedParams;
        
        if (!dreamId) {
          setNotFound(true);
          return;
        }

        // Check if Supabase is properly configured
        const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

        let fetchedDream = null;

        if (isSupabaseConfigured && !isNaN(Number(dreamId))) {
          // Try to fetch from Supabase first
          const { data, error } = await supabase
            .from('dreams')
            .select('*')
            .eq('id', dreamId)
            .eq('is_private', false)
            .single();

          if (!error && data) {
            fetchedDream = data;
          }
        }

        // If not found in Supabase, try sessionStorage fallback
        if (!fetchedDream) {
          const sessionData = sessionStorage.getItem(`dream-${dreamId}`);
          if (sessionData) {
            try {
              fetchedDream = JSON.parse(sessionData);
            } catch (e) {
              console.error('Error parsing session storage data:', e);
            }
          }
        }

        if (!fetchedDream) {
          setNotFound(true);
          return;
        }

        setDream(fetchedDream);
        
        // Check if current user owns this dream (for visualization permissions)
        const userOwnsDream = checkDreamOwnership(fetchedDream, user, anonymousUserId);
        setCanVisualize(userOwnsDream);
        
      } catch (error) {
        console.error('Error fetching dream:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [params, user, anonymousUserId]);

  const handleVisualizeDream = async () => {
    if (!dream) return;

    setIsVisualizing(true);
    setVisualizationError(null);

    try {
      // Prepare request body with user context
      const requestBody: any = { dreamId: dream.id };
      
      if (user && user.id) {
        // Add auth header for authenticated users
        requestBody.userId = user.id;
      } else if (anonymousUserId) {
        // Add anonymous user ID for unauthenticated users
        requestBody.anonymousUserId = anonymousUserId;
      }

      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add auth header if user is authenticated
      if (user && session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/visualize-dream', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate dream visualization');
      }

      // Update the dream with the new image URL
      setDream(prevDream => prevDream ? { ...prevDream, image_url: data.dream.image_url } : null);

    } catch (error) {
      console.error('Error generating visualization:', error);
      setVisualizationError(error instanceof Error ? error.message : 'Failed to generate visualization');
    } finally {
      setIsVisualizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dream analysis...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Dream Not Found</h1>
          <p className="text-gray-300 mb-6">The dream you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dream analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <DreamAnalysisClient 
      dream={dream}
      onVisualizeDream={handleVisualizeDream}
      isVisualizing={isVisualizing}
      visualizationError={visualizationError}
      canVisualize={canVisualize}
    />
  );
}