"use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Calendar, User, Lock } from "lucide-react";
import { useAuth } from "../components/providers/AuthProvider";
import MagicLinkAuth from "../components/ui/MagicLinkAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface Dream {
  id: number;
  created_at: string;
  title: string;
  summary: string;
  interpretation: string;
  reflection_question: string;
  identified_symbols: DreamSymbol[];
  identified_archetypes: DreamArchetype[];
  identified_themes: string[];
  is_private: boolean;
  user_id: string | null;
  anonymous_user_id: string | null;
  dream_text: string;
}

interface DreamSymbol {
  symbol: string;
  meaning: string;
}

interface DreamArchetype {
  archetype: string;
  representation: string;
}

export default function LibraryClient() {
  const { user, anonymousUserId, loading } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDreams = async () => {
      if (loading) return;

      setIsLoading(true);
      setError(null);

      try {
        let query = '';
        
        if (user) {
          // Fetch dreams for authenticated user
          query = `/api/dreams?user_id=${user.id}`;
        } else if (anonymousUserId) {
          // Fetch dreams for anonymous user
          query = `/api/dreams?anonymous_user_id=${anonymousUserId}`;
        } else {
          setDreams([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(query);
        const data = await response.json();

        if (response.ok) {
          setDreams(data.dreams || []);
        } else {
          setError(data.error || 'Failed to fetch dreams');
        }
      } catch (err) {
        console.error('Error fetching dreams:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDreams();
  }, [user, anonymousUserId, loading]);

  if (loading || isLoading) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-gray-200 font-medium">Loading your dream library...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Library
          </CardTitle>
          <CardDescription className="text-red-400 text-center">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (dreams.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Library
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            {user ? 'Your dream library is empty' : 'No dreams in your temporary library yet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full ${user 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20'
              }`}>
                <BookOpen className={`h-8 w-8 ${user ? 'text-purple-400' : 'text-amber-400'}`} />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-serif text-white mb-2">
                {user ? 'Your Dream Library Awaits' : 'Welcome to Your Temporary Library'}
              </h3>
              <p className="text-gray-300 mb-6">
                {user 
                  ? 'Start weaving your dreams to build your personal collection of insights and interpretations.'
                  : 'Your dreams will appear here as you create them. Claim your library to save them permanently and access them from any device.'
                }
              </p>
              
              <div className="space-y-4">
                <a 
                  href="/" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="h-5 w-5" />
                  Weave Your First Dream
                </a>
                
                {!user && (
                  <div className="text-sm text-gray-400">
                    ✨ Free to start • No signup required • Upgrade anytime
                  </div>
                )}
              </div>
            </div>

            {!user && dreams.length === 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-900/10 to-yellow-900/10 border border-amber-500/20 rounded-xl">
                <h4 className="text-lg font-serif text-amber-200 mb-3">
                  Want to Save Your Dreams Permanently?
                </h4>
                <p className="text-sm text-gray-300 mb-4">
                  Claim your library to save dreams permanently and access them from any device.
                </p>
                <MagicLinkAuth />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-serif text-gray-300">
              Dream Library
            </CardTitle>
            <CardDescription className="text-gray-400">
              {user 
                ? `Your personal collection of ${dreams.length} dream interpretations`
                : `Your temporary library (${dreams.length} dreams) - Claim to save permanently`
              }
            </CardDescription>
          </div>
          
          {!user && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <Lock className="h-4 w-4" />
              Temporary
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream: Dream) => {
            const date = new Date(dream.created_at);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <a 
                key={dream.id} 
                href={`/dream/${dream.id}`}
                className="block group"
              >
                <Card className="bg-black/20 hover:bg-purple-900/20 transition-all duration-300 border-purple-500/20 group-hover:border-purple-400/50 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-purple-400" />
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formattedDate}
                        </span>
                      </div>
                      {!user && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-serif font-bold text-gray-200 group-hover:text-white transition-colors mb-3 line-clamp-2">
                      {dream.title}
                    </h4>
                    
                    <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-3">
                      {dream.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {dream.identified_themes?.slice(0, 3).map((theme, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-900/40 text-indigo-200 border border-indigo-600/50 rounded text-xs"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        {!user && (
          <div className="mt-8 pt-6 border-t border-gray-600/30">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-serif text-amber-200">
                  Save Your Dreams Permanently
                </span>
              </div>
              <p className="text-gray-300 text-sm max-w-md mx-auto">
                You have {dreams.length} dream{dreams.length !== 1 ? 's' : ''} in your temporary library. 
                Claim your library to save them permanently and access them from any device.
              </p>
            </div>
            <MagicLinkAuth />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
