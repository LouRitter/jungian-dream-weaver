"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Moon, 
  Star,
  ChevronUp,
  Eye,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

export default function DreamNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      description: "Weave Your Dream",
      color: "from-purple-500 to-pink-500",
      hoverColor: "from-purple-400 to-pink-400"
    },
    {
      href: "/explore",
      label: "Explore",
      icon: Compass,
      description: "Dream Archive",
      color: "from-indigo-500 to-blue-500",
      hoverColor: "from-indigo-400 to-blue-400"
    },
    {
      href: "/library",
      label: "Library",
      icon: BookOpen,
      description: user ? "Your Dreams" : "Claim Library",
      color: "from-emerald-500 to-teal-500",
      hoverColor: "from-emerald-400 to-teal-400"
    }
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Navigation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 space-y-3"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`
                        group relative flex items-center gap-3 p-4 rounded-2xl
                        bg-gradient-to-r ${active ? item.color : 'from-gray-800/90 to-gray-900/90'}
                        backdrop-blur-lg border border-white/10
                        shadow-xl hover:shadow-2xl transition-all duration-300
                        hover:scale-105 cursor-pointer
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      <div className={`
                        p-2 rounded-xl
                        ${active 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-r ' + item.color + '/20 group-hover:bg-gradient-to-r ' + item.hoverColor + '/30'
                        }
                        transition-all duration-300
                      `}>
                        <Icon className={`h-5 w-5 ${
                          active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        } transition-colors duration-300`} />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`font-semibold text-sm ${
                          active ? 'text-white' : 'text-gray-200 group-hover:text-white'
                        } transition-colors duration-300`}>
                          {item.label}
                        </span>
                        <span className={`text-xs ${
                          active ? 'text-white/80' : 'text-gray-400 group-hover:text-white/80'
                        } transition-colors duration-300`}>
                          {item.description}
                        </span>
                      </div>
                      
                      {/* Magical sparkle effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                        }}
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
            
            {/* User Status Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: navItems.length * 0.1,
                ease: "easeOut"
              }}
              className="pt-4 border-t border-gray-600/30"
            >
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30">
                    <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-green-200">
                        {user.email}
                      </span>
                      <p className="text-xs text-green-300">
                        Permanent Library
                      </p>
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-900/20 to-red-800/20 hover:from-red-900/30 hover:to-red-800/30 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                      <LogOut className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-red-200 group-hover:text-red-100 transition-colors">
                      Sign Out
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30">
                  <div className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-amber-200">
                      Anonymous User
                    </span>
                    <p className="text-xs text-amber-300">
                      Temporary Library
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative w-14 h-14 rounded-full
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:from-purple-500 hover:to-indigo-500
          shadow-2xl hover:shadow-purple-500/25
          border border-white/20
          flex items-center justify-center
          transition-all duration-300
          ${isExpanded ? 'rotate-45' : ''}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
      >
        {/* Floating particles */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(168, 85, 247, 0.4)",
              "0 0 0 10px rgba(168, 85, 247, 0)",
              "0 0 0 0 rgba(168, 85, 247, 0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-0.5"
            >
              <Sparkles className="h-3 w-3 text-white" />
              <Eye className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Magical glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)`
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
    </div>
  );
}
