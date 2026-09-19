import { useEffect, useRef, useState } from 'react';
import {
  X, Play, Plus, ThumbsUp, ThumbsDown, Share2,
  Star, Clock, Calendar, Volume2, VolumeX
} from 'lucide-react';
import VideoFrame from './VideoFrame';

export default function MovieModal({ movie, onClose, onPlay }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Autoplay the preview clip (muted first, then apply user's sound pref)
  useEffect(() => {
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
  }, [movie?.id, muted]);

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--ps-bg-card)] border border-[var(--ps-border)] shadow-[0_0_60px_rgba(108,99,255,0.3),0_24px_64px_rgba(0,0,0,0.9)] ps-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c63ff] to-transparent" />

        {/* Backdrop image */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {movie.video && !videoError ? (
            <video
              ref={videoRef}
              src={movie.video}
              poster={movie.backdrop}
              className="w-full h-full object-cover rounded-t-xl"
              playsInline
              loop
              onError={() => setVideoError(true)}
            />
          ) : (
            <VideoFrame
              src={movie.video}
              fallback={movie.backdrop}
              ratio={16 / 9}
              maxWidth={1280}
              alt={movie.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
          )}
          {/* Gradient overlay — cinematic dark so white title stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-transparent rounded-t-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.6)] to-transparent rounded-t-xl" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 border border-white/40 text-white hover:text-white hover:border-[#6c63ff]/70 hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mute button */}
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 border border-white/40 text-white hover:text-white hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Floating title on image */}
          <div className="absolute bottom-6 left-6 right-16">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {movie.new && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#6c63ff] text-white rounded"
                  style={{ fontFamily: 'Orbitron, monospace' }}>New</span>
              )}
              {movie.top10 && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/40 rounded">
                  Top 10
                </span>
              )}
            </div>
            <h2
              className="text-3xl md:text-4xl font-black uppercase text-white leading-tight"
              style={{
                fontFamily: 'Orbitron, monospace',
                textShadow: '0 0 30px rgba(108,99,255,0.6)',
              }}
            >
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tagline */}
          <p className="text-[#00d4ff] text-sm font-medium tracking-widest uppercase mb-4"
            style={{ textShadow: '0 0 8px rgba(0,212,255,0.5)' }}>
            {movie.tagline}
          </p>

          {/* Primary actions */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button
              onClick={() => onPlay?.(movie)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--ps-fg)] text-[var(--ps-bg)] font-bold text-sm rounded hover:bg-[var(--ps-fg-mid)] transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(108,99,255,0.25)]"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Now
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--ps-bg-mid)] text-[var(--ps-fg)] font-semibold text-sm rounded border border-[#6c63ff]/60 hover:bg-[#6c63ff]/20 hover:border-[#6c63ff] transition-all duration-200 active:scale-95">
              <Plus className="w-4 h-4" />
              My List
            </button>

            {/* Icon actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="p-2.5 rounded-full border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:border-[#6c63ff]/60 transition-all duration-200" aria-label="Like">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-full border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:border-[#6c63ff]/60 transition-all duration-200" aria-label="Dislike">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-full border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:border-[#6c63ff]/60 transition-all duration-200" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Two-column info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2">
              <p className="text-[var(--ps-fg-mid)] text-sm leading-relaxed mb-4">
                {movie.description}
              </p>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs rounded-full border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:border-[#6c63ff]/60 hover:text-[var(--ps-fg)] cursor-pointer transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Details sidebar */}
            <div className="space-y-3 text-sm">
              <DetailRow label="Rating">
                <span className="flex items-center gap-1 text-[#ffd700]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[var(--ps-fg)] font-semibold">{movie.rating}</span>
                  <span className="text-[var(--ps-fg-dim)]">/ 10</span>
                </span>
              </DetailRow>
              <DetailRow label="Duration">
                <span className="flex items-center gap-1 text-[var(--ps-fg)]">
                  <Clock className="w-3.5 h-3.5 text-[#6c63ff]" />
                  {movie.duration}
                </span>
              </DetailRow>
              <DetailRow label="Year">
                <span className="flex items-center gap-1 text-[var(--ps-fg)]">
                  <Calendar className="w-3.5 h-3.5 text-[#6c63ff]" />
                  {movie.year}
                </span>
              </DetailRow>
              <DetailRow label="Maturity">
                <span className="px-2 py-0.5 text-xs border border-[var(--ps-border)] text-[var(--ps-fg-mid)] rounded">
                  {movie.maturity}
                </span>
              </DetailRow>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6 mb-4 h-px bg-gradient-to-r from-[var(--ps-border)] via-[#6c63ff]/20 to-[var(--ps-border)]" />

          {/* Episodes / More like this placeholder */}
          <div>
            <h3 className="text-[var(--ps-fg)] font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#6c63ff] rounded-full inline-block" />
              More Like This
            </h3>
            <p className="text-[var(--ps-fg-dim)] text-xs">
              Explore similar titles in{' '}
              {movie.genre.slice(0, 2).join(' & ')}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[var(--ps-fg-dim)] text-xs uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}
