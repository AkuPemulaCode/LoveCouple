import { useParams, useNavigate, Navigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { movies, getMovieById } from '../data/movies';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = getMovieById(id);
  if (!movie) return <Navigate to="/browse" replace />;

  const currentIndex = movies.findIndex((m) => m.id === movie.id);
  const nextMovie = movies[(currentIndex + 1) % movies.length];
  const prevMovie = movies[(currentIndex - 1 + movies.length) % movies.length];

  const goBack = () => navigate('/browse');

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--ps-bg-track)]">
      <VideoPlayer
        key={movie.id}
        movie={movie}
        onClose={goBack}
        onPrev={() => navigate(`/watch/${prevMovie.id}`)}
        onNext={() => navigate(`/watch/${nextMovie.id}`)}
        upNext={nextMovie}
        autoPlay
        defaultMuted={false}
      />
    </div>
  );
}