"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  [key: string]: any;
}

export default function SafeImage({ 
  src, 
  alt, 
  fallbackText, 
  className = "",
  fill = false,
  width,
  height,
  ...props 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate fallback text from alt or provided text
  const fallback = fallbackText || alt.charAt(0).toUpperCase();

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      )}
      
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {fallback}
          </span>
        </div>
      )}
    </div>
  );
}
