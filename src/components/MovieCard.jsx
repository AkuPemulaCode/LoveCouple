import { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Star } from 'lucide-react';
import VideoFrame from './VideoFrame';

export default function MovieCard({ movie, onSelect, onPlay, rank }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div
      className="relative shrink-0 w-[160px] md:w-[200px] cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect?.(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(movie)}
      aria-label={`Play ${movie.title}`}
    >
      {/* Rank number (for Top 10 row) */}
      {rank !== undefined && (
        <div
          className="absolute -left-4 bottom-0 z-10 font-black text-[var(--ps-bg-mid)] select-none pointer-events-none leading-none"
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            WebkitTextStroke: '2px var(--ps-fg-dim)',
          }}
        >
          {rank}
        </div>
      )}

      {/* Poster */}
      <div
        className={`relative rounded-md overflow-hidden transition-all duration-300 ${
          hovered
            ? 'scale-110 z-30 shadow-[0_0_30px_rgba(108,99,255,0.5),0_8px_32px_rgba(0,0,0,0.8)]'
            : 'scale-100 z-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
        }`}
        style={{ aspectRatio: '2/3' }}
      >
        <VideoFrame
          src={movie.video}
          fallback={movie.poster}
          ratio={2 / 3}
          maxWidth={400}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay — always visible at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--ps-bg)] to-transparent" />

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* PixelSync border glow */}
          <div className="absolute inset-0 border-2 border-[#6c63ff]/60 rounded-md" />

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {movie.new && (
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#6c63ff] text-white rounded"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                New
              </span>
            )}
            {movie.top10 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/40 rounded">
                Top 10
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            {/* Play button */}
            <button
              onClick={(e) => { e.stopPropagation(); onPlay?.(movie); }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 mb-2 bg-[var(--ps-fg)] text-[var(--ps-bg)] font-bold text-xs rounded hover:bg-[var(--ps-fg-mid)] transition-colors active:scale-95"
              aria-label={`Play ${movie.title}`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Add to list */}
                <button
                  onClick={(e) => { e.stopPropagation(); setAdded(!added); }}
                  className={`p-1.5 rounded-full border transition-all duration-200 active:scale-90 ${
                    added
                      ? 'bg-[#6c63ff]/20 border-[#6c63ff] text-[#6c63ff]'
                      : 'bg-black/40 border-white/40 text-white hover:border-white hover:text-white hover:bg-black/60'
                  }`}
                  aria-label={added ? 'Remove from list' : 'Add to list'}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {/* Like */}
                <button
                  onClick={(e) => e.stopPropagation()}
className="p-1.5 rounded-full border border-white/40 bg-black/40 text-white hover:border-white hover:text-white hover:bg-black/60 transition-all duration-200 active:scale-90"
                  aria-label="Like"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* More info */}
              <button
                onClick={(e) => { e.stopPropagation(); onSelect?.(movie); }}
                className="p-1.5 rounded-full border border-white/40 bg-black/40 text-white hover:border-white hover:text-white hover:bg-black/60 transition-all duration-200 active:scale-90"
                aria-label="More info"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title + rating below poster (visible when not hovered) */}
      <div
        className={`mt-2 px-0.5 transition-opacity duration-200 ${hovered ? 'opacity-0' : 'opacity-100'}`}
      >
        <p className="text-[var(--ps-fg)] text-xs font-semibold truncate">{movie.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 text-[#ffd700] fill-current" />
          <span className="text-[var(--ps-fg-mid)] text-[10px]">{movie.rating}</span>
          <span className="text-[var(--ps-fg-dim)] text-[10px]">·</span>
          <span className="text-[var(--ps-fg-dim)] text-[10px]">{movie.year}</span>
        </div>
      </div>
    </div>
  );
}
