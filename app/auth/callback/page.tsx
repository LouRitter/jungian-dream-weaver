"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Successfully authenticated! Redirecting to your library...');
          
          // Redirect to library after a short delay
          setTimeout(() => {
            router.push('/library');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in again.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 rounded-2xl blur-xl" />
        
        {/* Content */}
        <motion.div
          className="relative bg-gradient-to-br from-gray-900/60 via-purple-900/30 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-xl max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-serif text-white mb-2">
                  Authenticating...
                </h2>
                <p className="text-gray-300 text-sm">
                  {message}
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h2 className="text-xl font-serif text-white mb-2">
                  Welcome to Alchera!
                </h2>
                <p className="text-gray-300 text-sm">
                  {message}
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-serif text-white mb-2">
                  Authentication Failed
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  {message}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Return Home
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
