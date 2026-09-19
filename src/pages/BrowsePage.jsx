import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import Footer from '../components/Footer';
import { rows } from '../data/movies';

export default function BrowsePage() {
  const [selectedMovie, setSelectedMovie] = useState(null); // modal
  const navigate = useNavigate();

  const handlePlay = (movie) => navigate(`/watch/${movie.id}`);

  return (
    <div className="min-h-screen bg-ps-black">
      <Navbar />

      {/* Hero */}
      <Hero
        onMovieSelect={setSelectedMovie}
        onPlay={handlePlay}
      />

      {/* Movie rows */}
      <main className="relative z-10 -mt-4 pb-8">
        {rows.map((row) => (
          <MovieRow
            key={row.id}
            title={row.label}
            movies={row.movies}
            onMovieSelect={setSelectedMovie}
            onPlay={handlePlay}
            showRank={row.id === 'top10'}
          />
        ))}
      </main>

      <Footer />

      {/* Movie detail modal (info) */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
}