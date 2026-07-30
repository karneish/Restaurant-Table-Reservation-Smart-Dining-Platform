import { useState, useEffect } from 'react';
import { movieAPI, theatreAPI } from '../services/api';
import type { Movie, Theatre } from '../types';
import { Film, Building2, TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [tab, setTab] = useState<'movies' | 'theatres'>('movies');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      movieAPI.getAll(),
      theatreAPI.getAll(),
    ]).then(([moviesRes, theatresRes]) => {
      setMovies(moviesRes.data.data);
      setTheatres(theatresRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDeleteMovie = async (id: number) => {
    if (!window.confirm('Deactivate this movie?')) return;
    try {
      await movieAPI.getById(id);
      toast.success('Movie deactivated');
      setMovies(prev => prev.map(m => m.id === id ? { ...m, active: false } : m));
    } catch {
      toast.error('Failed to deactivate');
    }
  };

  const stats = {
    totalMovies: movies.length,
    activeMovies: movies.filter(m => m.active).length,
    totalTheatres: theatres.length,
    activeTheatres: theatres.filter(t => t.active).length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Movies', value: stats.totalMovies, icon: Film, color: 'bg-blue-500' },
          { label: 'Active Movies', value: stats.activeMovies, icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Total Theatres', value: stats.totalTheatres, icon: Building2, color: 'bg-purple-500' },
          { label: 'Active Theatres', value: stats.activeTheatres, icon: Building2, color: 'bg-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b">
        <button onClick={() => setTab('movies')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === 'movies' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Movies
        </button>
        <button onClick={() => setTab('theatres')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === 'theatres' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Theatres
        </button>
      </div>

      {tab === 'movies' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left pb-3">Title</th>
                <th className="text-left pb-3">Language</th>
                <th className="text-left pb-3">Genre</th>
                <th className="text-left pb-3">Rating</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{movie.title}</td>
                  <td className="py-3 text-gray-500">{movie.language}</td>
                  <td className="py-3 text-gray-500">{movie.genre}</td>
                  <td className="py-3">{movie.rating}/10</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${movie.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {movie.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDeleteMovie(movie.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'theatres' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">City</th>
                <th className="text-left pb-3">Address</th>
                <th className="text-left pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {theatres.map(theatre => (
                <tr key={theatre.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{theatre.name}</td>
                  <td className="py-3 text-gray-500">{theatre.city}</td>
                  <td className="py-3 text-gray-500">{theatre.address}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${theatre.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {theatre.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
