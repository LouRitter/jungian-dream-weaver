"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Sparkles, BookOpen, Calendar, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

interface Tag {
  id: number;
  name: string;
  type: 'symbol' | 'archetype' | 'theme';
}

interface TagFiltersClientProps {
  tags: Tag[];
  selectedTag?: string;
}

export default function TagFiltersClient({ tags, selectedTag }: TagFiltersClientProps) {
  const [expandedSections, setExpandedSections] = useState({
    archetypes: true,
    themes: true,
    symbols: true
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const archetypeTags = tags?.filter(tag => tag.type === 'archetype') || [];
  const themeTags = tags?.filter(tag => tag.type === 'theme') || [];
  const symbolTags = tags?.filter(tag => tag.type === 'symbol') || [];

  // Dynamic tag categorization function
  const categorizeTags = (tags: Tag[], type: string) => {
    const categories: { [key: string]: Tag[] } = {};
    
    tags.forEach(tag => {
      const name = tag.name.toLowerCase();
      let assigned = false;
      
      if (type === 'archetype') {
        // Dynamic archetype categorization based on semantic meaning
        if (['self', 'shadow', 'persona', 'anima', 'animus'].some(word => name.includes(word))) {
          if (!categories['Core Jungian']) categories['Core Jungian'] = [];
          categories['Core Jungian'].push(tag);
          assigned = true;
        } else if (['hero', 'heroine', 'warrior', 'seeker', 'wanderer', 'rebel'].some(word => name.includes(word))) {
          if (!categories['Heroic Journey']) categories['Heroic Journey'] = [];
          categories['Heroic Journey'].push(tag);
          assigned = true;
        } else if (['wise', 'sage', 'mentor', 'crone', 'elder', 'teacher'].some(word => name.includes(word))) {
          if (!categories['Wisdom Keepers']) categories['Wisdom Keepers'] = [];
          categories['Wisdom Keepers'].push(tag);
          assigned = true;
        } else if (['mother', 'father', 'child', 'parent'].some(word => name.includes(word))) {
          if (!categories['Family Patterns']) categories['Family Patterns'] = [];
          categories['Family Patterns'].push(tag);
          assigned = true;
        }
      } else if (type === 'theme') {
        // Dynamic theme categorization
        if (['transformation', 'change', 'growth', 'evolution', 'metamorphosis'].some(word => name.includes(word))) {
          if (!categories['Transformation']) categories['Transformation'] = [];
          categories['Transformation'].push(tag);
          assigned = true;
        } else if (['identity', 'self', 'individuality', 'authenticity', 'essence'].some(word => name.includes(word))) {
          if (!categories['Identity & Self']) categories['Identity & Self'] = [];
          categories['Identity & Self'].push(tag);
          assigned = true;
        } else if (['shadow', 'fear', 'dark', 'hidden', 'unknown', 'repressed'].some(word => name.includes(word))) {
          if (!categories['Shadow Work']) categories['Shadow Work'] = [];
          categories['Shadow Work'].push(tag);
          assigned = true;
        } else if (['journey', 'quest', 'path', 'travel', 'adventure'].some(word => name.includes(word))) {
          if (!categories['Journey & Quest']) categories['Journey & Quest'] = [];
          categories['Journey & Quest'].push(tag);
          assigned = true;
        } else if (['connection', 'relationship', 'bond', 'unity', 'community'].some(word => name.includes(word))) {
          if (!categories['Connection']) categories['Connection'] = [];
          categories['Connection'].push(tag);
          assigned = true;
        }
      } else if (type === 'symbol') {
        // Dynamic symbol categorization
        if (['forest', 'garden', 'river', 'mountain', 'ocean', 'tree', 'flower', 'bird', 'animal', 'nature'].some(word => name.includes(word))) {
          if (!categories['Nature']) categories['Nature'] = [];
          categories['Nature'].push(tag);
          assigned = true;
        } else if (['house', 'building', 'bridge', 'door', 'window', 'library', 'city', 'road', 'structure'].some(word => name.includes(word))) {
          if (!categories['Structures']) categories['Structures'] = [];
          categories['Structures'].push(tag);
          assigned = true;
        } else if (['light', 'dark', 'mirror', 'key', 'crown', 'sword', 'circle', 'cross', 'spiritual'].some(word => name.includes(word))) {
          if (!categories['Mystical']) categories['Mystical'] = [];
          categories['Mystical'].push(tag);
          assigned = true;
        } else if (['book', 'page', 'word', 'message', 'voice', 'sound', 'music'].some(word => name.includes(word))) {
          if (!categories['Knowledge & Communication']) categories['Knowledge & Communication'] = [];
          categories['Knowledge & Communication'].push(tag);
          assigned = true;
        } else if (['fire', 'water', 'air', 'earth', 'element'].some(word => name.includes(word))) {
          if (!categories['Elements']) categories['Elements'] = [];
          categories['Elements'].push(tag);
          assigned = true;
        }
      }
      
      // If no category found, assign to "Other" with a random subcategory
      if (!assigned) {
        const otherCategories = {
          'archetype': ['Other Patterns', 'Universal Archetypes', 'Emerging Forms'],
          'theme': ['Other Themes', 'Universal Patterns', 'Emerging Concepts'],
          'symbol': ['Other Symbols', 'Universal Symbols', 'Emerging Forms']
        };
        
        const randomCategory = otherCategories[type as keyof typeof otherCategories][
          Math.floor(Math.random() * otherCategories[type as keyof typeof otherCategories].length)
        ];
        
        if (!categories[randomCategory]) categories[randomCategory] = [];
        categories[randomCategory].push(tag);
      }
    });
    
    return categories;
  };

  // Shuffle array function for randomization
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate dynamic categories
  const archetypeCategories = categorizeTags(archetypeTags, 'archetype');
  const themeCategories = categorizeTags(themeTags, 'theme');
  const symbolCategories = categorizeTags(symbolTags, 'symbol');

  // Convert to shuffled entries for dynamic ordering
  const shuffledArchetypeCategories = shuffleArray(Object.entries(archetypeCategories));
  const shuffledThemeCategories = shuffleArray(Object.entries(themeCategories));
  const shuffledSymbolCategories = shuffleArray(Object.entries(symbolCategories));

  const TagGroup = ({ title, tags, color, limit = 10, groupKey }: { title: string, tags: Tag[], color: string, limit?: number, groupKey: string }) => {
    if (tags.length === 0) return null;
    
    const isExpanded = expandedGroups[groupKey] || false;
    const displayLimit = isExpanded ? tags.length : limit;
    const hasMore = tags.length > limit;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-200">
          {title}
        </h4>
        <div className="flex flex-wrap gap-2 transition-all duration-300">
          {tags.slice(0, displayLimit).map((tag) => (
            <Link key={tag.id} href={`/explore?tag=${encodeURIComponent(tag.name)}`}>
              <Badge
                variant={selectedTag === tag.name ? "default" : "secondary"}
                className={`cursor-pointer transition-all duration-200 text-xs font-medium px-3 py-1.5 ${
                  selectedTag === tag.name
                    ? "bg-opacity-100 text-white shadow-md"
                    : "bg-opacity-40 hover:bg-opacity-60 text-gray-200 hover:text-white"
                }`}
                style={{
                  backgroundColor: selectedTag === tag.name ? color : `${color}40`,
                  borderColor: selectedTag === tag.name ? color : `${color}60`,
                  borderWidth: '1px'
                }}
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
          {hasMore && (
            <button
              onClick={() => toggleGroup(groupKey)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 text-gray-400 border border-gray-600/50 bg-gray-800/30 hover:bg-gray-700/50 hover:text-gray-300 rounded-md transition-all duration-200"
            >
              {isExpanded ? (
                <>
                  <Minus className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  +{tags.length - limit} more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-r from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border-gray-400/40 shadow-xl shadow-gray-950/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-serif text-white text-center flex items-center justify-center gap-2">
          <Filter className="h-6 w-6 text-purple-300" />
          Dream Archive
        </CardTitle>
        <CardDescription className="text-gray-300 text-center text-base leading-relaxed">
          Explore the collective unconscious through archetypes, themes, and symbols
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Archetypes Section */}
        <div>
          <button
            onClick={() => toggleSection('archetypes')}
            className="flex items-center gap-3 w-full text-left mb-4 hover:bg-purple-900/25 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-purple-500/30"
          >
            {expandedSections.archetypes ? (
              <ChevronDown className="h-5 w-5 text-purple-300" />
            ) : (
              <ChevronRight className="h-5 w-5 text-purple-300" />
            )}
            <Sparkles className="h-5 w-5 text-purple-300" />
            <h3 className="text-lg font-serif text-purple-200 font-semibold">
              Archetypes
            </h3>
            <Badge variant="outline" className="ml-auto text-purple-200 border-purple-400/60 bg-purple-900/20">
              {archetypeTags.length}
            </Badge>
          </button>
          
          {expandedSections.archetypes && (
            <div className="pl-7 space-y-3">
              {shuffledArchetypeCategories.map(([categoryName, categoryTags], index) => (
                <TagGroup 
                  key={`archetype-${index}`}
                  title={categoryName} 
                  tags={categoryTags} 
                  color="#a855f7" 
                  limit={categoryName.includes('Other') || categoryName.includes('Universal') || categoryName.includes('Emerging') ? 6 : 10}
                  groupKey={`archetypes-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Themes Section */}
        <div>
          <button
            onClick={() => toggleSection('themes')}
            className="flex items-center gap-3 w-full text-left mb-4 hover:bg-indigo-900/25 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-indigo-500/30"
          >
            {expandedSections.themes ? (
              <ChevronDown className="h-5 w-5 text-indigo-300" />
            ) : (
              <ChevronRight className="h-5 w-5 text-indigo-300" />
            )}
            <BookOpen className="h-5 w-5 text-indigo-300" />
            <h3 className="text-lg font-serif text-indigo-200 font-semibold">
              Themes
            </h3>
            <Badge variant="outline" className="ml-auto text-indigo-200 border-indigo-400/60 bg-indigo-900/20">
              {themeTags.length}
            </Badge>
          </button>
          
          {expandedSections.themes && (
            <div className="pl-7 space-y-3">
              {shuffledThemeCategories.map(([categoryName, categoryTags], index) => (
                <TagGroup 
                  key={`theme-${index}`}
                  title={categoryName} 
                  tags={categoryTags} 
                  color="#6366f1" 
                  limit={categoryName.includes('Other') || categoryName.includes('Universal') || categoryName.includes('Emerging') ? 4 : 8}
                  groupKey={`themes-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Symbols Section */}
        <div>
          <button
            onClick={() => toggleSection('symbols')}
            className="flex items-center gap-3 w-full text-left mb-4 hover:bg-amber-900/25 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-amber-500/30"
          >
            {expandedSections.symbols ? (
              <ChevronDown className="h-5 w-5 text-amber-300" />
            ) : (
              <ChevronRight className="h-5 w-5 text-amber-300" />
            )}
            <Calendar className="h-5 w-5 text-amber-300" />
            <h3 className="text-lg font-serif text-amber-200 font-semibold">
              Symbols
            </h3>
            <Badge variant="outline" className="ml-auto text-amber-200 border-amber-400/60 bg-amber-900/20">
              {symbolTags.length}
            </Badge>
          </button>
          
          {expandedSections.symbols && (
            <div className="pl-7 space-y-3">
              {shuffledSymbolCategories.map(([categoryName, categoryTags], index) => (
                <TagGroup 
                  key={`symbol-${index}`}
                  title={categoryName} 
                  tags={categoryTags} 
                  color="#f59e0b" 
                  limit={categoryName.includes('Other') || categoryName.includes('Universal') || categoryName.includes('Emerging') ? 4 : 8}
                  groupKey={`symbols-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {selectedTag && (
          <div className="pt-4 border-t border-gray-500/40">
            <Link href="/explore">
              <Button variant="outline" className="w-full border-gray-400/60 text-gray-200 hover:bg-gray-700/50 hover:border-gray-300/60 font-medium">
                Clear Filters
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
