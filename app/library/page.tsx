import { Suspense } from "react";
import { BookOpen, Sparkles, Calendar } from "lucide-react";
import DreamBackground from "../components/ui/DreamBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import LibraryClient from "./LibraryClient";

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

async function DreamLibrary() {
  if (!isSupabaseConfigured()) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Library
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Set up Supabase to access your personal dream collection
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <p className="text-gray-300">
              To create your personal dream library, please:
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

  const { data: dreams, error } = await supabase
    .from('dreams')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching dreams:', error);
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Library
          </CardTitle>
          <CardDescription className="text-red-400 text-center">
            Error loading your dreams
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dreams || dreams.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-gray-300 text-center">
            Dream Library
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            No dreams in your library yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-300 mb-4">
            Start weaving your dreams to build your personal collection
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="h-5 w-5" />
            Weave Your First Dream
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-gray-300 text-center">
          Dream Library
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Your personal collection of dream interpretations
        </CardDescription>
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
                className="block"
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
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <DreamBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-serif text-white mb-4 drop-shadow-lg flex items-center justify-center gap-4">
            <BookOpen className="h-10 w-10 text-purple-300" />
            Dream Library
            <Sparkles className="h-10 w-10 text-purple-300" />
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your personal collection of dream interpretations and insights from the depths of your unconscious.
          </p>
        </div>

        <Suspense fallback={
          <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
            <CardContent className="text-center py-8">
              <p className="text-gray-200 font-medium">Loading your dream library...</p>
            </CardContent>
          </Card>
        }>
          <LibraryClient />
        </Suspense>
      </div>
    </div>
  );
}
