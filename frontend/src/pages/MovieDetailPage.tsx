import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, showAPI, theatreAPI } from '../services/api';
import type { Movie, Show, Theatre } from '../types';
import { Star, Clock, Globe, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showCity, setShowCity] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      movieAPI.getById(Number(id)),
      theatreAPI.getActive(),
    ]).then(([movieRes, theatreRes]) => {
      setMovie(movieRes.data.data);
      setTheatres(theatreRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    showAPI.search({ movieId: Number(id), date: selectedDate })
      .then(res => setShows(res.data.data))
      .catch(() => {});
  }, [id, selectedDate]);

  const cities = [...new Set(theatres.map(t => t.city))];

  const filteredShows = showCity
    ? shows.filter(s => s.theatreCity === showCity)
    : shows;

  const groupedByTheatre = filteredShows.reduce((acc, show) => {
    const key = show.theatreId;
    if (!acc[key]) {
      const theatre = theatres.find(t => t.id === show.theatreId);
      acc[key] = { theatre: theatre || { id: key, name: show.theatreName || '', city: show.theatreCity || '', address: '', active: true }, shows: [] };
    }
    acc[key].shows.push(show);
    return acc;
  }, {} as Record<number, { theatre: Theatre; shows: Show[] }>);

  const handleBook = (showId: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/book/${showId}`);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /><div className="h-8 bg-gray-200 rounded w-1/3" /></div>;
  }

  if (!movie) return <div className="text-center py-12 text-gray-500">Movie not found</div>;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-44 bg-primary-500 rounded-xl flex items-center justify-center text-5xl font-bold shrink-0">
            {movie.title.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-primary-100 mb-4">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {movie.rating}/10</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.duration} min</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {movie.language}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {movie.genre}</span>
            </div>
            {movie.description && <p className="text-primary-100">{movie.description}</p>}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select value={showCity} onChange={e => setShowCity(e.target.value)}
              className="input-field">
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {Object.keys(groupedByTheatre).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No shows available for selected date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(groupedByTheatre).map(({ theatre, shows }) => (
              <div key={theatre.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{theatre.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {theatre.address}, {theatre.city}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {shows.sort((a, b) => a.showTime.localeCompare(b.showTime)).map(show => (
                    <button key={show.id} onClick={() => handleBook(show.id)}
                      className="border border-primary-300 rounded-lg px-4 py-3 text-center hover:bg-primary-50 transition-colors group">
                      <div className="text-sm font-semibold text-primary-700">{show.showTime}</div>
                      <div className="text-xs text-gray-500">₹{show.ticketPrice}</div>
                      <div className="text-xs text-gray-400">{show.availableSeats} seats</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
