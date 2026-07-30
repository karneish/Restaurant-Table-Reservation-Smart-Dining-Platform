import { Link } from 'react-router-dom';
import { Star, Clock, Globe } from 'lucide-react';
import type { Movie } from '../types';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movies/${movie.id}`} className="card group cursor-pointer">
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg p-4 mb-4 text-white text-center">
          <div className="text-3xl font-bold mb-1">{movie.title.charAt(0)}</div>
          <div className="text-xs opacity-80">{movie.genre}</div>
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {movie.rating}/10</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" /> {movie.language}
        </div>
        {movie.description && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{movie.description}</p>
        )}
      </div>
    </Link>
  );
}
