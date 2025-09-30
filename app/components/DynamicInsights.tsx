"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Star, 
  Moon, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Brain,
  Zap,
  Shield,
  Crown,
  TreePine,
  Mountain,
  Waves,
  Flame,
  Flower
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface Tag {
  id: number;
  name: string;
  type: 'symbol' | 'archetype' | 'theme';
  dream_count: number;
}

interface DynamicInsightsProps {
  initialTags?: Tag[];
}

// Icon mapping for different tag types and names
const getTagIcon = (tagName: string, tagType: string) => {
  const name = tagName.toLowerCase();
  
  // Symbol icons
  if (tagType === 'symbol') {
    if (name.includes('ocean') || name.includes('water') || name.includes('sea')) return Waves;
    if (name.includes('fire') || name.includes('flame') || name.includes('burn')) return Flame;
    if (name.includes('tree') || name.includes('forest') || name.includes('nature')) return TreePine;
    if (name.includes('mountain') || name.includes('peak') || name.includes('hill')) return Mountain;
    if (name.includes('flower') || name.includes('bloom') || name.includes('garden')) return Flower;
    if (name.includes('eye') || name.includes('vision') || name.includes('sight')) return Eye;
    if (name.includes('star') || name.includes('sky') || name.includes('space')) return Star;
    if (name.includes('moon') || name.includes('night') || name.includes('lunar')) return Moon;
    if (name.includes('heart') || name.includes('love') || name.includes('emotion')) return Heart;
    return Zap; // Default symbol icon
  }
  
  // Archetype icons
  if (tagType === 'archetype') {
    if (name.includes('hero') || name.includes('warrior') || name.includes('champion')) return Crown;
    if (name.includes('wise') || name.includes('sage') || name.includes('teacher')) return Brain;
    if (name.includes('mother') || name.includes('nurture') || name.includes('care')) return Heart;
    if (name.includes('shadow') || name.includes('dark') || name.includes('hidden')) return Moon;
    if (name.includes('guardian') || name.includes('protect') || name.includes('shield')) return Shield;
    return Sparkles; // Default archetype icon
  }
  
  // Theme icons
  if (tagType === 'theme') {
    if (name.includes('love') || name.includes('relationship') || name.includes('connection')) return Heart;
    if (name.includes('transformation') || name.includes('change') || name.includes('growth')) return Sparkles;
    if (name.includes('fear') || name.includes('anxiety') || name.includes('worry')) return Moon;
    if (name.includes('wisdom') || name.includes('knowledge') || name.includes('learning')) return Brain;
    if (name.includes('power') || name.includes('strength') || name.includes('energy')) return Zap;
    return Star; // Default theme icon
  }
  
  return Sparkles; // Ultimate fallback
};

// Color mapping for different tag types - all purple variants
const getTagColors = (tagType: string) => {
  switch (tagType) {
    case 'symbol':
      return {
        bg: 'from-purple-500 to-pink-500',
        hover: 'from-purple-600 to-pink-600'
      };
    case 'archetype':
      return {
        bg: 'from-purple-600 to-indigo-500',
        hover: 'from-purple-700 to-indigo-600'
      };
    case 'theme':
      return {
        bg: 'from-purple-400 to-violet-500',
        hover: 'from-purple-500 to-violet-600'
      };
    default:
      return {
        bg: 'from-purple-500 to-pink-500',
        hover: 'from-purple-600 to-pink-600'
      };
  }
};

// Generate insights descriptions based on tag type and name
const generateInsightDescription = (tag: Tag) => {
  const name = tag.name.toLowerCase();
  const type = tag.type;
  
  // Symbol descriptions
  if (type === 'symbol') {
    if (name.includes('ocean') || name.includes('water')) {
      return `Dreams featuring ${tag.name} often represent the collective unconscious and emotional depths of the psyche...`;
    }
    if (name.includes('fire') || name.includes('flame')) {
      return `The symbol of ${tag.name} in dreams typically represents transformation, passion, and creative energy...`;
    }
    if (name.includes('tree') || name.includes('forest')) {
      return `Dreams with ${tag.name} symbolize growth, connection to nature, and the life cycle...`;
    }
    if (name.includes('mountain') || name.includes('peak')) {
      return `The ${tag.name} in dreams often represents challenges, aspirations, and spiritual elevation...`;
    }
    return `The symbol of ${tag.name} carries deep archetypal meaning in the dream realm...`;
  }
  
  // Archetype descriptions
  if (type === 'archetype') {
    if (name.includes('hero') || name.includes('warrior')) {
      return `The ${tag.name} archetype represents the journey of self-discovery and overcoming challenges...`;
    }
    if (name.includes('wise') || name.includes('sage')) {
      return `Dreams featuring the ${tag.name} often bring messages of wisdom and spiritual guidance...`;
    }
    if (name.includes('mother') || name.includes('nurture')) {
      return `The ${tag.name} archetype embodies nurturing energy and protective instincts...`;
    }
    if (name.includes('shadow')) {
      return `The ${tag.name} archetype invites us to explore hidden aspects of our psyche...`;
    }
    return `The ${tag.name} archetype holds profound meaning for personal growth and transformation...`;
  }
  
  // Theme descriptions
  if (type === 'theme') {
    if (name.includes('transformation') || name.includes('change')) {
      return `Dreams of ${tag.name} signal important shifts in consciousness and personal development...`;
    }
    if (name.includes('love') || name.includes('relationship')) {
      return `Themes of ${tag.name} in dreams reflect our deepest connections and emotional bonds...`;
    }
    if (name.includes('fear') || name.includes('anxiety')) {
      return `Dreams exploring ${tag.name} help us confront and integrate our deepest concerns...`;
    }
    if (name.includes('wisdom') || name.includes('knowledge')) {
      return `Themes of ${tag.name} in dreams often bring insights from the collective unconscious...`;
    }
    return `The theme of ${tag.name} offers profound insights into the dreamer's inner world...`;
  }
  
  return `Explore dreams related to ${tag.name} and discover their hidden meanings...`;
};

export default function DynamicInsights({ initialTags = [] }: DynamicInsightsProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [loading, setLoading] = useState(!initialTags.length);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await fetch('/api/popular-tags?limit=3');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialTags.length) {
      fetchPopularTags();
    }
  }, [initialTags.length]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-md border-purple-500/30 shadow-xl shadow-purple-950/30">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-purple-300 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recent Insights
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Latest wisdom from the collective unconscious
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-black/20 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-md border-purple-500/30 shadow-xl shadow-purple-950/30">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-purple-300 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recent Insights
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm">
          Latest wisdom from the collective unconscious
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {tags.map((tag, index) => {
            const Icon = getTagIcon(tag.name, tag.type);
            const colors = getTagColors(tag.type);
            const description = generateInsightDescription(tag);
            
            return (
              <Link key={tag.id} href={`/explore?tag=${encodeURIComponent(tag.name)}`}>
                <motion.div 
                  className={`p-3 rounded-lg bg-black/20 hover:bg-purple-900/20 transition-all duration-200 cursor-pointer group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${colors.bg} shadow-lg group-hover:${colors.hover} transition-all duration-200`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {tag.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-purple-400 font-medium capitalize">
                          {tag.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {tag.dream_count} dream{tag.dream_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
        
        <div className="pt-3 border-t border-gray-600/30">
          <Link 
            href="/explore" 
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-purple-500/30 hover:border-purple-400/50 rounded-lg text-purple-300 hover:text-white transition-all duration-300 text-sm font-medium"
          >
            <BookOpen className="h-4 w-4" />
            Explore All Dreams
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
