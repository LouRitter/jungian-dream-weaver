"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wand2, Brain, Moon, Star, Sparkles, Eye, Heart, Loader2, BookOpen } from "lucide-react";
import Image from "next/image";
import DreamBackground from "./components/ui/DreamBackground";
import LoadingMessages from "./components/ui/LoadingMessages";
import { useAuth } from "./components/providers/AuthProvider";
import DynamicInsights from "./components/DynamicInsights";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import Logo from "./components/ui/logo";
import SafeImage from "./components/ui/safe-image";
import Link from "next/link";

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
  title: string;
  summary: string;
  interpretation: string;
  identified_symbols: DreamSymbol[];
  identified_archetypes: DreamArchetype[];
  reflection_question: string;
}

export default function DreamWeaverLanding() {
  // Router for navigation
  const router = useRouter();
  
  // State management
  const [dream, setDream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Auth context
  const { user, session, anonymousUserId } = useAuth();


  // API call function
  const handleAnalyzeDream = async () => {
    if (!dream.trim()) {
      setError("Please enter a dream description to analyze.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Prepare request body with user context
      const requestBody: any = { dream: dream.trim() };
      
      if (user && session) {
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

      const response = await fetch('/api/analyze-dream', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze dream');
      }

      const dreamData = await response.json();
      
      // Check if we have a database ID (Supabase configured) or need to use sessionStorage
      if (dreamData.id) {
        // Supabase is configured, use database ID
        router.push('/dream/' + dreamData.id);
      } else {
        // Supabase not configured, use sessionStorage fallback
        const dreamId = Date.now().toString();
        sessionStorage.setItem('dream-' + dreamId, JSON.stringify(dreamData));
        router.push('/dream/' + dreamId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dreamlike Animated Background */}
      <DreamBackground 
        intensity={0.8}
        speed={0.6}
        className="absolute inset-0 z-0"
      />

      {/* Hero Logo Section */}
      <motion.div
        className="relative z-10 pt-4 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <Logo size="hero" variant="hero" className="text-center" />
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            
            {/* Top Left - Main Event Banner */}
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-md border-purple-500/30 shadow-2xl shadow-purple-950/50 h-full">
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="flex justify-between items-start">
                    <Logo size="md" variant="minimal" className="text-left" />
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-6xl font-serif font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      DREAMS UNVEILED
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                      AI-POWERED DREAM ANALYSIS WITH CARL JUNG'S WISDOM
                    </p>
                    <div className="text-lg text-purple-300 font-serif">
                      DISCOVER ARCHETYPES • SYMBOLS • HIDDEN MEANINGS
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Textarea
                      value={dream}
                      onChange={(e) => setDream(e.target.value)}
                      placeholder="I was falling through a library of silent clocks, each one ticking to a different rhythm of time, and I could hear whispers in languages I'd never learned..."
                      className="bg-black/40 border-purple-500/50 text-gray-300 placeholder:text-gray-500 min-h-[200px] text-lg focus-visible:ring-purple-500 focus-visible:ring-offset-gray-900 resize-none backdrop-blur-sm"
                      disabled={isLoading}
                    />
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleAnalyzeDream}
                      disabled={isLoading || !dream.trim()}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-xl font-bold px-12 py-4 rounded-full shadow-2xl shadow-purple-950/50 transition-all duration-300 group"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          WEAVING...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                          WEAVE THE DREAM
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Loading Messages */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8"
                    >
                      <LoadingMessages />
                    </motion.div>
                  )}
                  
                  {/* User Status Indicator */}
                  {!user && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6 text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                        <Eye className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-amber-300">
                          Dreams saved temporarily • 
                          <Link href="/library" className="text-amber-200 hover:text-amber-100 underline ml-1">
                            Claim your library
                          </Link>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Right - Dynamic Insights */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <DynamicInsights />
            </motion.div>

            {/* Bottom - Explore Archive CTA */}
            <motion.div
              className="lg:col-span-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-serif text-gray-200 mb-2 flex items-center justify-center gap-3">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                    Explore the Collective Unconscious
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Journey through a vast archive of dream interpretations, filtered by archetypes, themes, and symbols. 
                    Discover the hidden patterns that connect us all through the universal language of dreams.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">Archetypes</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-300">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">Themes</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <Star className="h-5 w-5" />
                      <span className="text-sm font-medium">Symbols</span>
                    </div>
                  </div>
                  <Link href="/explore">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
                    >
                      <BookOpen className="h-6 w-6 mr-2" />
                      Browse Dream Archive
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
    </div>

    </main>
  );
}