"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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

interface DreamGridClientProps {
  dreams: Dream[];
}

export default function DreamGridClient({ dreams }: DreamGridClientProps) {
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

  if (dreams.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-indigo-900/40 backdrop-blur-md border-gray-500/30 shadow-xl shadow-gray-950/30">
        <CardContent className="text-center py-8">
          <p className="text-gray-300 mb-4">No dreams found. Try a different tag or browse all dreams.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dreams.map((dream, index) => {
        const symbolTags = dream.identified_symbols?.slice(0, 1).map((s: DreamSymbol) => ({ name: s.symbol, type: 'symbol' })) || [];
        const archetypeTags = dream.identified_archetypes?.slice(0, 1).map((a: DreamArchetype) => ({ name: a.archetype, type: 'archetype' })) || [];
        const themeTags = dream.identified_themes?.slice(0, 1).map((t: string) => ({ name: t, type: 'theme' })) || [];
        const allTags = [...symbolTags, ...archetypeTags, ...themeTags].slice(0, 3);

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
              return "bg-purple-900/40 text-purple-200 border-purple-600/50 hover:bg-purple-800/50";
            case 'theme':
              return "bg-indigo-900/40 text-indigo-200 border-indigo-600/50 hover:bg-indigo-800/50";
            case 'symbol':
              return "bg-amber-900/40 text-amber-200 border-amber-600/50 hover:bg-amber-800/50";
            default:
              return "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-gray-700/50";
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
              <Card className="bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/30 hover:from-gray-800/70 hover:via-purple-900/30 hover:to-indigo-900/40 transition-all duration-300 border-gray-500/30 group-hover:border-purple-400/50 h-full shadow-lg hover:shadow-xl hover:shadow-purple-500/10">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-purple-300" />
                      <span className="text-xs text-gray-300 flex items-center font-medium">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-serif font-bold text-white group-hover:text-purple-100 transition-colors mb-3 line-clamp-2 leading-tight">
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
                  <p className="text-sm text-gray-300 mb-4 flex-grow line-clamp-2 leading-relaxed">
                    <span className="text-xs text-gray-400 font-medium">Interpretation: </span>
                    {dream.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className={`text-xs font-medium transition-colors ${getTagStyle(tag.type)}`}
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
  );
}
