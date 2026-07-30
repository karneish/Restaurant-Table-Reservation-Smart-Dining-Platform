import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';
import type { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Search, Filter } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filtered, setFiltered] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieAPI.getAll().then(res => {
      setMovies(res.data.data);
      setFiltered(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = movies;
    if (search) {
      result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (language !== 'All') {
      result = result.filter(m => m.language === language);
    }
    setFiltered(result);
  }, [search, language, movies]);

  const languages = ['All', ...new Set(movies.map(m => m.language))];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Movies</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search movies..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none">
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="card animate-pulse h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No movies found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {filtered.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  );
}
