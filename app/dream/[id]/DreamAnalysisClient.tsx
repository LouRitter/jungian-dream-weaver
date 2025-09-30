"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Sparkles, Brain, MessageCircle, Wand2, Eye, Palette, AlertCircle } from "lucide-react";
import DreamBackground from "../../components/ui/DreamBackground";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

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

interface DreamAnalysisClientProps {
  dream: DreamAnalysis;
  onVisualizeDream: () => void;
  isVisualizing: boolean;
  visualizationError: string | null;
  canVisualize: boolean;
}

export default function DreamAnalysisClient({ dream, onVisualizeDream, isVisualizing, visualizationError, canVisualize }: DreamAnalysisClientProps) {
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(dream);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnalysis(dream);
  }, [dream]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <DreamBackground 
          intensity={0.8}
          speed={0.6}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your dream analysis...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <DreamBackground 
          intensity={0.8}
          speed={0.6}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-md border-red-500/40 shadow-2xl shadow-red-950/50 max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif text-red-300">Error</CardTitle>
              <CardDescription className="text-gray-300">{error}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Weave a New Dream
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dreamlike Animated Background */}
      <DreamBackground 
        intensity={0.8}
        speed={0.6}
        className="absolute inset-0 z-0"
      />

      <motion.div
        className="relative z-10 p-4 py-8 md:p-8 lg:p-12 flex items-center justify-center min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-4xl w-full mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-blue-900/30 backdrop-blur-md border-purple-500/40 shadow-2xl shadow-purple-950/50">
            <CardHeader className="text-center space-y-4 p-6 md:p-8">
              <div className="flex items-center justify-center space-x-3">
                <BookOpen className="h-8 w-8 text-purple-400" />
                <CardTitle className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {analysis.title}
                </CardTitle>
              </div>
              <CardDescription className="text-xl md:text-2xl text-gray-300 font-light">
                {analysis.summary}
              </CardDescription>
            </CardHeader>

            {/* Dream Visualization Section */}
            <div className="px-6 md:px-8 pb-6">
              {analysis.image_url ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-2xl mb-6 bg-gray-900/20 border border-purple-500/20"
                >
                  <div className="relative w-full max-w-2xl mx-auto">
                    <Image
                      src={analysis.image_url}
                      alt={`Visualization of ${analysis.title}`}
                      width={1024}
                      height={1024}
                      className="w-full h-auto rounded-2xl"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Palette className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-white font-medium">Dream Visualization</span>
                    </div>
                  </div>
                </motion.div>
              ) : canVisualize ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-6"
                >
                  <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full">
                        <Eye className="h-8 w-8 text-purple-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2">
                      Visualize Your Dream
                    </h3>
                    <p className="text-gray-300 mb-4 max-w-md mx-auto">
                      Generate a unique, AI-powered visualization of your dream based on its symbols, archetypes, and themes.
                    </p>
                    
                    {visualizationError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {visualizationError}
                      </motion.div>
                    )}
                    
                    <Button
                      onClick={onVisualizeDream}
                      disabled={isVisualizing}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      {isVisualizing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating Visualization...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Generate Dream Visualization
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-6"
                >
                  <div className="bg-gradient-to-r from-gray-900/20 to-gray-800/20 border border-gray-600/30 rounded-2xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full">
                        <Eye className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-serif text-gray-300 mb-2">
                      Dream Visualization
                    </h3>
                    <p className="text-gray-400 mb-4 max-w-md mx-auto">
                      This dream doesn't have a visualization yet. Only the dream creator can generate visualizations.
                    </p>
                    <div className="text-sm text-gray-500">
                      Create your own dreams to unlock the visualization feature
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <CardContent className="space-y-8 p-6 md:p-8">
              {/* Interpretation */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-2xl font-serif text-yellow-300">Interpretation</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed bg-black/20 p-6 rounded-lg border border-purple-500/20">
                  {analysis.interpretation}
                </p>
              </div>

              {/* Symbols and Archetypes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Symbols */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6 text-cyan-400" />
                    <h3 className="text-2xl font-serif text-cyan-300">Key Symbols</h3>
                  </div>
                  <div className="space-y-3">
                    {analysis.identified_symbols.map((symbol: DreamSymbol, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-black/20 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
                      >
                        <h4 className="font-bold text-cyan-300 text-lg mb-2">{symbol.symbol}</h4>
                        <p className="text-gray-300 text-sm">{symbol.meaning}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Identified Archetypes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-pink-400" />
                    <h3 className="text-2xl font-serif text-pink-300">Identified Archetypes</h3>
                  </div>
                  <div className="space-y-3">
                    {analysis.identified_archetypes.map((archetype: DreamArchetype, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-black/20 p-4 rounded-lg border border-pink-500/20 hover:border-pink-400/40 transition-colors"
                      >
                        <h4 className="font-bold text-pink-300 text-lg mb-2">{archetype.archetype}</h4>
                        <p className="text-gray-300 text-sm">{archetype.representation}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reflection Question */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                  <h3 className="text-2xl font-serif text-green-300">Reflection</h3>
                </div>
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-6 rounded-lg border border-green-500/30">
                  <p className="text-lg text-gray-200 font-medium italic">
                    "{analysis.reflection_question}"
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6 flex justify-center">
              <Link href="/">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold border border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Wand2 className="mr-3 h-6 w-6" />
                  Weave Another Dream
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
