import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, MapPin, Ticket, Search, TrendingUp } from 'lucide-react';
import { movieAPI } from '../services/api';
import type { Movie } from '../types';
import MovieCard from '../components/MovieCard';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieAPI.getActive().then(res => {
      setMovies(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl text-white -mx-4 px-4">
        <Film className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Ticket to Entertainment</h1>
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
          Book movie tickets, reserve your seats, and enjoy the show with India's most trusted ticket booking platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/movies" className="bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
            Browse Movies
          </Link>
          <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
            Get Started
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Search, title: 'Browse Movies', desc: 'Explore the latest movies, filter by language, genre, and more.' },
          { icon: MapPin, title: 'Choose Theatre', desc: 'Find theatres near you with show timings and seat availability.' },
          { icon: Ticket, title: 'Instant Booking', desc: 'Reserve seats and pay securely. Get e-tickets instantly.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-600" /> Now Showing
          </h2>
          <Link to="/movies" className="text-primary-600 hover:underline font-medium">View All</Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="card animate-pulse h-48" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {movies.slice(0, 4).map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>
    </div>
  );
}
