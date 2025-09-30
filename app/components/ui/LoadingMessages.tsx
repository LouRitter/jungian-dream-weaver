"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingMessagesProps {
  className?: string;
}

export default function LoadingMessages({ className = "" }: LoadingMessagesProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    // Dream analysis steps
    "Consulting the collective unconscious...",
    "Deciphering ancient dream symbols...",
    "Channeling Carl Jung's wisdom...",
    "Mapping archetypal patterns...",
    "Tracing the path of individuation...",
    "Reading the language of the soul...",
    "Unveiling hidden meanings...",
    "Connecting to the universal dream...",
    
    // Philosophical quotes about dreams
    "Dreams are the royal road to the unconscious. - Sigmund Freud",
    "In dreams, we are all poets. - Carl Jung",
    "Dreams are the answers to questions we haven't yet figured out how to ask. - X-Files",
    "The dream is the small hidden door in the deepest and most intimate sanctum of the soul. - Carl Jung",
    "Dreams are illustrations from the book your soul is writing about you. - Marsha Norman",
    "All that we see or seem is but a dream within a dream. - Edgar Allan Poe",
    "Dreams are the seeds of reality. - Napoleon Hill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    
    // Celebrity quotes about dreams
    "I have a dream that one day... - Martin Luther King Jr.",
    "Dreams come true. Without that possibility, nature would not incite us to have them. - John Updike",
    "Dreams are the touchstones of our character. - Henry David Thoreau",
    "The dreamers of the day are dangerous men, for they may act their dream with open eyes. - T.E. Lawrence",
    "Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly. - Langston Hughes",
    "Dreams are the whispers of the soul. - Unknown",
    "Every great dream begins with a dreamer. - Harriet Tubman",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
    
    // Mystical and poetic messages
    "The veil between worlds grows thin...",
    "Ancient symbols awaken in the twilight...",
    "The psyche speaks in metaphors...",
    "Journeying through the realm of symbols...",
    "The unconscious reveals its secrets...",
    "Following the thread of meaning...",
    "The dream weaver spins her tale...",
    "Where reality meets the infinite...",
    
    // Jungian concepts
    "Integrating the shadow self...",
    "Balancing anima and animus...",
    "Discovering the true Self...",
    "Confronting the collective unconscious...",
    "Embarking on the hero's journey...",
    "Seeking the philosopher's stone...",
    "Transcending the ego...",
    "Finding the sacred marriage..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % messages.length
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className={`text-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-lg text-gray-300 font-medium"
        >
          {messages[currentMessageIndex]}
        </motion.div>
      </AnimatePresence>
      
      {/* Animated dots */}
      <motion.div 
        className="flex justify-center mt-4 space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
