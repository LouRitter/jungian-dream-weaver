"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  variant?: "default" | "minimal" | "text-only" | "hero";
  className?: string;
  animated?: boolean;
}

export default function Logo({ 
  size = "md", 
  variant = "default", 
  className = "",
  animated = true 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-12 w-12 sm:h-16 sm:w-16",
    md: "h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28", 
    lg: "h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32",
    xl: "h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40",
    hero: "h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 xl:h-56 xl:w-56 2xl:h-64 2xl:w-64"
  };

  const textSizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-3xl sm:text-4xl lg:text-5xl",
    lg: "text-4xl sm:text-5xl lg:text-6xl", 
    xl: "text-6xl sm:text-7xl lg:text-8xl",
    hero: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
  };

  // Using your actual logo from the public folder
  const logoSrc = "/logo.png";
  
  if (variant === "text-only") {
    return (
      <motion.div
        className={`font-serif font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent ${textSizeClasses[size]} ${className}`}
        initial={animated ? { opacity: 0, scale: 0.8 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={animated ? { duration: 0.6, ease: "easeOut" } : {}}
      >
        Alchera
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={`flex items-center space-x-2 ${className}`}
        initial={animated ? { opacity: 0, x: -20 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={animated ? { duration: 0.6, ease: "easeOut" } : {}}
      >
        <div className={`${sizeClasses[size]} relative`}>
          <Image
            src={logoSrc}
            alt="Alchera Logo"
            fill
            className="object-contain"
            priority
            onError={(e) => {
              // Fallback to text if logo fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"><span class="text-white font-bold text-sm">A</span></div>';
              }
            }}
          />
        </div>
      </motion.div>
    );
  }

  if (variant === "hero") {
    return (
      <motion.div
        className={`flex flex-col items-center space-y-3 ${className}`}
        initial={animated ? { opacity: 0, y: -20 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={animated ? { duration: 0.8, ease: "easeOut" } : {}}
      >
        <div className="flex items-center space-x-4">
          <div className={`${sizeClasses[size]} relative`}>
            <Image
              src={logoSrc}
              alt="Alchera Logo"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback to text if logo fails to load
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center"><span class="text-white font-bold text-2xl">A</span></div>';
                }
              }}
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <span className={`font-serif font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-4xl`}>
              AI
            </span>
          </div>
        </div>
        
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      initial={animated ? { opacity: 0, y: -20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={animated ? { duration: 0.8, ease: "easeOut" } : {}}
    >
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src={logoSrc}
          alt="Alchera Logo"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback to text if logo fails to load
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center"><span class="text-white font-bold text-xs">A</span></div>';
            }
          }}
        />
      </div>
      
      <div className="flex flex-col">
        <span className={`font-serif font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
        AI        
        </span>
      </div>
    </motion.div>
  );
}
