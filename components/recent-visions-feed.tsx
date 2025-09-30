"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DreamSymbol {
  symbol: string;
  meaning: string;
}

interface DreamArchetype {
  archetype: string;
  representation: string;
}

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
  dream_text: string;
}

export default function RecentVisionsFeed() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Function to create a short, clear summary of the user's dream text
  const createDreamTextSummary = (dreamText: string): string => {
    if (!dreamText) return '';
    
    // Clean up the text and get first sentence or first 100 characters
    const cleaned = dreamText.trim();
    const firstSentence = cleaned.split(/[.!?]/)[0];
    
    // If first sentence is too long, truncate it
    if (firstSentence.length > 120) {
      return firstSentence.substring(0, 120) + '...';
    }
    
    // If first sentence is reasonable length, use it
    if (firstSentence.length > 20) {
      return firstSentence + '.';
    }
    
    // Otherwise, take first 100 characters
    return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned;
  };

  useEffect(() => {
    // Only fetch once when component mounts
    if (hasFetched) return;

    async function fetchDreams() {
      try {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
          setError('Supabase not configured');
          return;
        }

        const { data, error } = await supabase
          .from('dreams')
          .select('*')
          .eq('is_private', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching dreams:', error);
          setError(error.message);
        } else {
          setDreams(data || []);
        }
      } catch (err) {
        console.error('Exception fetching dreams:', err);
        setError('Failed to fetch dreams');
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    }

    fetchDreams();
  }, [hasFetched]);

  if (!isSupabaseConfigured()) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Recent Visions
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Set up Supabase to see the community's dream interpretations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <p className="text-gray-300">
              To enable the live feed of dream interpretations, please:
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-400">
              <p>1. Create a Supabase project</p>
              <p>2. Run the SQL schema from <code className="bg-gray-800 px-2 py-1 rounded">supabase-schema.sql</code></p>
              <p>3. Add your Supabase credentials to <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code></p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Recent Visions
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Loading dream interpretations...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Recent Visions
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Error: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dreams || dreams.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Recent Visions
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            No dream interpretations yet. Be the first to share your vision!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-gray-300 text-center">
          Recent Visions
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Explore the collective unconscious through recent dream interpretations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream, index) => {
            // Extract tags from symbols, archetypes, and themes
            const symbolTags = dream.identified_symbols?.slice(0, 1).map((s: DreamSymbol) => ({ name: s.symbol, type: 'symbol' })) || [];
            const archetypeTags = dream.identified_archetypes?.slice(0, 1).map((a: DreamArchetype) => ({ name: a.archetype, type: 'archetype' })) || [];
            const themeTags = dream.identified_themes?.slice(0, 1).map((t: string) => ({ name: t, type: 'theme' })) || [];
            const allTags = [...symbolTags, ...archetypeTags, ...themeTags].slice(0, 3);

            // Format date
            const date = new Date(dream.created_at);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const getTagStyle = (type: string) => {
              switch (type) {
                case 'archetype':
                  return "bg-purple-900/40 text-purple-200 border-purple-600/50";
                case 'theme':
                  return "bg-indigo-900/40 text-indigo-200 border-indigo-600/50";
                case 'symbol':
                  return "bg-amber-900/40 text-amber-200 border-amber-600/50";
                default:
                  return "bg-gray-800/40 text-gray-200 border-gray-600/50";
              }
            };

            return (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/dream/${dream.id}`}>
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
                      </div>
                      
                      <h4 className="text-lg font-serif font-bold text-gray-200 group-hover:text-white transition-colors mb-3 line-clamp-2">
                        {dream.title}
                      </h4>
                      
                      {/* User's Dream Text Summary */}
                      <div className="mb-3 p-3 bg-gray-800/30 rounded-lg border border-gray-600/30">
                        <p className="text-xs text-gray-400 font-medium mb-1">Original Dream:</p>
                        <p className="text-sm text-gray-200 leading-relaxed">
                          "{createDreamTextSummary(dream.dream_text)}"
                        </p>
                      </div>
                      
                      {/* AI Interpretation Summary */}
                      <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-2">
                        <span className="text-xs text-gray-500 font-medium">Interpretation: </span>
                        {dream.summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className={`text-xs ${getTagStyle(tag.type)}`}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
