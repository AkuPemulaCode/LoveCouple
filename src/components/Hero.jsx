import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { getTrending } from '../data/movies';
import VideoFrame from './VideoFrame';

const AUTOPLAY_INTERVAL = 7000;

export default function Hero({ onMovieSelect, onPlay }) {
  const featured = getTrending().slice(0, 5);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const toggleMute = () => setMuted((m) => !m);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const movie = featured[current];
  const hasVideo = !!movie?.video;
  const useVideo = hasVideo && !videoError;
  const videoRef = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (animating) return;
      setAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setVideoError(false);
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % featured.length);
  }, [current, featured.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + featured.length) % featured.length);
  }, [current, featured.length, goTo]);

  // Auto-advance for slides without a playable video
  useEffect(() => {
    if (useVideo) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 100 / (AUTOPLAY_INTERVAL / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [goNext, useVideo]);

  // Autoplay the active slide's video (muted first, then apply user's sound pref)
  useEffect(() => {
    if (!useVideo) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (videoRef.current === v) v.muted = muted;
        }).catch(() => {});
      }
    } else {
      v.muted = muted;
    }
  }, [current, muted, useVideo]);

  const handleVideoProgress = (e) => {
    const v = e.currentTarget;
    if (v.duration && !animating) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-[var(--ps-bg)]">
      {/* Backdrop images — stacked, fade between them */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'cursor-pointer' : ''}`}
          style={{
            opacity: i === current && !animating ? 1 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
          onClick={() => { if (i === current) onMovieSelect?.(m); }}
        >
          {i === current && useVideo ? (
            <video
              ref={videoRef}
              src={m.video}
              poster={m.backdrop}
              className="w-full h-full object-cover"
              playsInline
              onTimeUpdate={handleVideoProgress}
              onEnded={goNext}
              onError={() => setVideoError(true)}
            />
          ) : (
            <VideoFrame
              src={m.video}
              fallback={m.backdrop}
              ratio={16 / 9}
              maxWidth={1280}
              alt={m.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}
          {/* Colour-grade overlay — dark with purple tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ps-bg)] via-[var(--ps-bg-80)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ps-bg)] via-transparent to-[var(--ps-bg-30)]" />
          {/* PixelSync purple tint on right side */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#6c63ff]/10 to-transparent" />
        </div>
      ))}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* Grid pixel pattern — subtle */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div
        className={`relative z-20 h-full flex flex-col justify-end pb-24 px-8 md:px-16 max-w-3xl transition-all duration-400 ${
          animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
      >
        {/* Primary actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onPlay?.(movie)}
            className="flex items-center gap-2 px-7 py-3 bg-[var(--ps-fg)] text-[var(--ps-bg)] font-bold text-sm rounded hover:bg-[var(--ps-fg-mid)] transition-all duration-200 shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.5)] active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </button>

          <button
            onClick={() => onMovieSelect?.(movie)}
            className="flex items-center gap-2 px-7 py-3 bg-[var(--ps-bg-mid-80)] text-[var(--ps-fg)] font-bold text-sm rounded border border-[#6c63ff]/60 hover:bg-[#6c63ff]/20 hover:border-[#6c63ff] transition-all duration-200 shadow-[0_0_15px_rgba(108,99,255,0.2)] hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95 backdrop-blur-sm"
          >
            <Info className="w-5 h-5" />
            More Info
          </button>
        </div>
      </div>

      {/* Carousel controls */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/40 text-white hover:text-white hover:border-[#6c63ff]/70 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm hidden md:flex"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/40 text-white hover:text-white hover:border-[#6c63ff]/70 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm hidden md:flex"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Mute toggle + slide indicators with progress */}
      <div className="absolute bottom-6 right-8 md:right-16 z-20 flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 border border-white/40 text-white hover:text-white hover:border-[#6c63ff]/70 hover:bg-black/60 transition-all duration-200 backdrop-blur-sm"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 40 : 20 }}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className="absolute inset-0 bg-[var(--ps-border)] rounded-full" />
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 bg-[#6c63ff] rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
            {i !== current && (
              <span className="absolute inset-0 bg-[var(--ps-fg-dim)] rounded-full" />
            )}
          </button>
        ))}
        </div>
      </div>

      {/* Bottom fade into content */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--ps-bg)] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
