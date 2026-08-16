import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface RestaurantImageProps {
  src?: string;
  alt: string;
  emoji: string;
  className?: string;
  initial?: string;
}

export default function RestaurantImage({ src, alt, emoji, className = '', initial }: RestaurantImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 ${className}`}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-gold-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-lime-300/10 rounded-full blur-xl" />
        <div className="relative text-center text-white">
          <span className="block text-5xl drop-shadow-lg">{emoji}</span>
          {initial && <span className="mt-1 block text-lg font-bold tracking-wide uppercase opacity-90">{initial}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-primary-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
    </div>
  );
}

export function ImageFallback({ className = '', emoji }: { className?: string; emoji: string }) {
  return (
    <div className={`flex items-center justify-center bg-forest-50 text-forest-300 ${className}`}>
      <span className="text-4xl opacity-70">{emoji}</span>
      <ImageOff className="w-5 h-5 absolute opacity-30" />
    </div>
  );
}
