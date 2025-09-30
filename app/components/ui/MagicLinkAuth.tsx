"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "./button";

interface MagicLinkAuthProps {
  onSuccess?: () => void;
  className?: string;
}

export default function MagicLinkAuth({ onSuccess, className = "" }: MagicLinkAuthProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage("");

    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to send magic link');
      } else {
        setStatus('sent');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-serif text-white mb-2">
          Claim Your Dream Library
        </h3>
        <p className="text-gray-300 text-sm">
          Enter your email to receive a magic link and save your dreams permanently
        </p>
      </div>

      {status === 'sent' ? (
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">
            Magic Link Sent!
          </h4>
          <p className="text-gray-300 text-sm mb-4">
            Check your email for the login link. Click it to claim your dream library.
          </p>
          <p className="text-xs text-gray-400">
            Don't see the email? Check your spam folder.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                disabled={isLoading}
              />
            </div>
            {status === 'error' && (
              <motion.div
                className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Magic Link...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Send Magic Link
              </div>
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <p className="text-xs text-gray-400 text-center">
          By continuing, you agree to receive a one-time login link via email. 
          Your dreams will be securely saved to your personal library.
        </p>
      </div>
    </motion.div>
  );
}
