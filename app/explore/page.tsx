import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Filter, Sparkles, BookOpen, Calendar } from "lucide-react";
import DreamGridClient from "./DreamGridClient";
import TagFiltersClient from "./TagFiltersClient";
import DreamBackground from "../components/ui/DreamBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Type definitions
interface Tag {
  id: number;
  name: string;
  type: 'symbol' | 'archetype' | 'theme';
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

interface DreamSymbol {
  symbol: string;
  meaning: string;
}

interface DreamArchetype {
  archetype: string;
  representation: string;
}

interface ExplorePageProps {
  searchParams: Promise<{ tag?: string }>;
}

// Component for filtering by tags
async function TagFilters({ selectedTag }: { selectedTag?: string }) {
  if (!isSupabaseConfigured()) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Archive
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Set up Supabase to explore dreams by tags
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('type')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Archive
          </CardTitle>
          <CardDescription className="text-red-400 text-center">
            Error loading tags
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <TagFiltersClient tags={tags || []} selectedTag={selectedTag} />;
}

// Component for displaying dreams
async function DreamGrid({ selectedTag }: { selectedTag?: string }) {
  if (!isSupabaseConfigured()) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardContent className="text-center py-8">
          <p className="text-gray-300">Set up Supabase to see dream interpretations</p>
        </CardContent>
      </Card>
    );
  }

  let dreams: Dream[] = [];
  let error: string | null = null;

  try {
    if (selectedTag) {
      // Fetch dreams by tag
      const { data, error: tagError } = await supabase
        .from('dreams')
        .select(`
          *,
          dream_tags!inner(
            tags!inner(name)
          )
        `)
        .eq('dream_tags.tags.name', selectedTag)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (tagError) {
        console.error('Error fetching dreams by tag:', tagError);
        error = `Error loading dreams for tag "${selectedTag}"`;
      } else {
        dreams = data || [];
      }
    } else {
      // Fetch recent dreams
      const { data, error: recentError } = await supabase
        .from('dreams')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (recentError) {
        console.error('Error fetching recent dreams:', recentError);
        error = 'Error loading recent dreams';
      } else {
        dreams = data || [];
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    error = 'An unexpected error occurred';
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardContent className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (dreams.length === 0) {
    const message = selectedTag 
      ? `No dreams found for "${selectedTag}". Try a different tag or browse all dreams.`
      : "No dream interpretations yet. Be the first to share your vision!";
    
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardContent className="text-center py-8">
          <p className="text-gray-300 mb-4">{message}</p>
          {selectedTag && (
            <Link href="/explore">
              <Button variant="outline" className="border-gray-500/50 text-gray-300 hover:bg-gray-800/50">
                Browse All Dreams
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return <DreamGridClient dreams={dreams} />;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { tag: selectedTag } = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DreamBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-serif text-white mb-4 drop-shadow-lg flex items-center justify-center gap-4">
            <Sparkles className="h-10 w-10 text-purple-300" />
            Dream Archive
            <Sparkles className="h-10 w-10 text-purple-300" />
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Journey through the collective unconscious. Explore dreams by archetypes, themes, and symbols to discover hidden patterns and universal truths.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={
              <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
                <CardContent className="text-center py-8">
                  <p className="text-gray-200 font-medium">Loading filters...</p>
                </CardContent>
              </Card>
            }>
              <TagFilters selectedTag={selectedTag} />
            </Suspense>
          </div>

          {/* Dreams Grid */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-white mb-2">
                {selectedTag ? `Dreams tagged "${selectedTag}"` : "Recent Dreams"}
              </h2>
              <p className="text-gray-300">
                {selectedTag 
                  ? `Exploring dreams related to ${selectedTag}`
                  : "Discover the latest interpretations from the collective unconscious"
                }
              </p>
            </div>

            <Suspense fallback={
              <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
                <CardContent className="text-center py-8">
                  <p className="text-gray-200 font-medium">Loading dreams...</p>
                </CardContent>
              </Card>
            }>
              <DreamGrid selectedTag={selectedTag} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
