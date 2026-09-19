import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, onMovieSelect, onPlay, showRank = false }) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  // Mouse-drag to scroll
  const onMouseDown = (e) => {
    const el = rowRef.current;
    if (!el) return;
    setIsDragging(false);
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = 'grabbing';

    const onMove = (ev) => {
      const delta = ev.pageX - dragStart.current.x;
      if (Math.abs(delta) > 4) {
        setIsDragging(true);
        dragStart.current.moved = true;
      }
      el.scrollLeft = dragStart.current.scrollLeft - delta;
    };
    const onUp = () => {
      el.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      updateScrollState();
      setTimeout(() => setIsDragging(false), 50);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative group/row mb-10">
      {/* Row header */}
      <div className="flex items-center gap-3 px-8 md:px-16 mb-4">
        <h2
          className="text-[var(--ps-fg)] font-bold text-base md:text-lg tracking-wide"
        >
          {title}
        </h2>
        {/* Animated "Explore All" link */}
        <span className="flex items-center gap-1 text-[#6c63ff] text-xs font-semibold opacity-0 group-hover/row:opacity-100 translate-x-2 group-hover/row:translate-x-0 transition-all duration-300 cursor-pointer hover:text-[#00d4ff]">
          Explore All
          <ChevronRight className="w-3.5 h-3.5" />
        </span>

        {/* Decorative line */}
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--ps-border)] to-transparent ml-2" />
      </div>

      {/* Left fade + chevron */}
      <div
        className={`absolute left-0 top-8 bottom-0 w-16 md:w-20 z-20 flex items-center justify-start pl-2 md:pl-4 transition-opacity duration-200 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(to right, var(--ps-bg) 40%, transparent)',
        }}
      >
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full bg-[var(--ps-bg-80)] border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:border-[#6c63ff]/60 hover:bg-[#6c63ff]/10 hover:shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-all duration-200 active:scale-90 opacity-0 group-hover/row:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Right fade + chevron */}
      <div
        className={`absolute right-0 top-8 bottom-0 w-16 md:w-20 z-20 flex items-center justify-end pr-2 md:pr-4 transition-opacity duration-200 ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'linear-gradient(to left, var(--ps-bg) 40%, transparent)',
        }}
      >
        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-full bg-[var(--ps-bg-80)] border border-[var(--ps-border)] text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:border-[#6c63ff]/60 hover:bg-[#6c63ff]/10 hover:shadow-[0_0_15px_rgba(108,99,255,0.3)] transition-all duration-200 active:scale-90 opacity-0 group-hover/row:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable cards */}
      <div
        ref={rowRef}
        onMouseDown={onMouseDown}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-8 md:px-16 pb-6 select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {movies.map((movie, i) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={isDragging ? undefined : onMovieSelect}
            onPlay={isDragging ? undefined : onPlay}
            rank={showRank ? i + 1 : undefined}
          />
        ))}

        {/* Trailing spacer so last card isn't clipped by fade */}
        <div className="shrink-0 w-4 md:w-8" />
      </div>
    </section>
  );
}
