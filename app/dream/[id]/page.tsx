import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  title: string;
  summary: string;
  interpretation: string;
  identified_symbols: DreamSymbol[];
  identified_archetypes: DreamArchetype[];
  reflection_question: string;
}

interface DreamAnalysisPageProps {
  params: {
    id: string;
  };
}

export default async function DreamAnalysisPage({ params }: DreamAnalysisPageProps) {
  const { id: dreamId } = await params;
  
  if (!dreamId) {
    notFound();
  }

  // Check if Supabase is properly configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  let dream = null;

  if (isSupabaseConfigured && !isNaN(Number(dreamId))) {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', dreamId)
      .eq('is_private', false)
      .single();

    if (!error && data) {
      dream = data;
    }
  }

  // If not found in Supabase or Supabase not configured, this will be handled by client-side fallback
  if (!dream) {
    // Return a client component that will handle sessionStorage fallback
    return <DreamAnalysisClient dreamId={dreamId} />;
  }

  // Return the client component with the dream data
  return <DreamAnalysisClient dream={dream} />;
}
