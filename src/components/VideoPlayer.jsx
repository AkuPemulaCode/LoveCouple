import { useEffect, useRef, useState } from 'react';
import {
  X, ChevronLeft, Play, Pause, Volume2, VolumeX,
  Maximize, Minimize, SkipBack, SkipForward, ListVideo,
} from 'lucide-react';
import VideoFrame from './VideoFrame';

const TRAILER_MAP = {
  1:  'vI9tna8uJgU',
  2:  'ByXV9GWB7NE',
  3:  'b9oJcUNiXSY',
  4:  'WQNkooKrDis',
  5:  'D_Vg4AodExE',
  6:  'egM5AGQOS2g',
  7:  'M7XM597XO94',
  8:  'c30aNaGICAs',
  9:  '3WHlAk8QLRU',
  10: 'vhVD8HoSQFs',
  11: 'eWzkkQ5BPSQ',
  12: 'LRBe4Thq_Tg',
  13: 'b9oJcUNiXSY',
  14: 'zSWdZVtXT7E',
  15: 'D_Vg4AodExE',
  16: 'eDQcoMbExAk',
  17: 'kJQP7kiw5Fk',
  18: 'ZKpF1v-fnpM',
  19: 'c-uo5S9OOqA',
  20: 'EAq00o4DFEY',
  21: 'HaZPSZpEgKw',
  22: 'S-1QgOMQ-ls',
  23: 'kCc8FmEb1nY',
  24: 'D_Vg4AodExE',
  25: 'wqnU0BRqy0k',
  26: 'w4c_njGXhb8',
};

const GENRE_FALLBACK = {
  'Sci-Fi':     'vhVD8HoSQFs',
  'Action':     'egM5AGQOS2g',
  'Cyberpunk':  'b9oJcUNiXSY',
  'Thriller':   'eDQcoMbExAk',
  'Horror':     'HaZPSZpEgKw',
  'Anime':      'ZKpF1v-fnpM',
  'Documentary':'kCc8FmEb1nY',
  'Romance':    'wqnU0BRqy0k',
  'Comedy':     'w4c_njGXhb8',
};

function getTrailerId(movie) {
  if (TRAILER_MAP[movie.id]) return TRAILER_MAP[movie.id];
  for (const g of movie.genre) {
    if (GENRE_FALLBACK[g]) return GENRE_FALLBACK[g];
  }
  return 'vhVD8HoSQFs';
}

let ytApiPromise = null;
function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

export default function VideoPlayer({
  movie,
  onClose,
  onPrev,
  onNext,
  upNext,
  autoPlay = true,
  defaultMuted = true,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const endedFiredRef = useRef(false);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(defaultMuted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ytError, setYtError] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const hideTimer = useRef(null);

  const localVideo = movie.video || null;
  const trailerId = getTrailerId(movie);
  const isLocal = !!localVideo;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3500);
  };

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, []);

  // Create / (re)load the YouTube player (only used when movie.video is absent)
  useEffect(() => {
    if (isLocal) return;
    let cancelled = false;
    setReady(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setYtError(false);
    endedFiredRef.current = false;

    loadYouTubeAPI().then(() => {
      if (cancelled) return;

      const existing = playerRef.current;
      if (existing && existing.loadYouTubeVideoById) {
        existing.loadYouTubeVideoById({
          videoId: trailerId,
          rel: 0,
          modestbranding: 1,
        });
        if (autoPlay) existing.playVideo();
        setReady(true);
        return;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: trailerId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(100);
            event.target.setPlaybackQuality('hd720');
            if (defaultMuted) event.target.mute();
            setMuted(event.target.isMuted());
            if (autoPlay) event.target.playVideo();
            setReady(true);
          },
          onStateChange: (event) => {
            const { YT } = window;
            if (event.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              endedFiredRef.current = false;
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (event.data === YT.PlayerState.ENDED) {
              setPlaying(false);
              if (!endedFiredRef.current && onNextRef.current) {
                endedFiredRef.current = true;
                setTimeout(() => onNextRef.current(), 1200);
              }
            }
          },
          onError: () => setYtError(true),
        },
      });
    });

    return () => { cancelled = true; };
  }, [trailerId, autoPlay, defaultMuted, isLocal]);

  // Poll current time / duration for the progress bar (YouTube only)
  useEffect(() => {
    if (!ready || isLocal) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const cur = p.getCurrentTime?.() || 0;
        const dur = p.getDuration?.() || 0;
        if (dur) {
          setDuration(dur);
          setCurrentTime(cur);
          setProgress((cur / dur) * 100);
        }
      } catch {
        /* ignore rare race conditions */
      }
    }, 500);
    return () => clearInterval(id);
  }, [ready, isLocal]);

  // Force muted + autoplay for local video (browsers only autoplay muted media)
  useEffect(() => {
    if (!isLocal) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = defaultMuted;
    setMuted(defaultMuted);
    if (autoPlay) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [isLocal, localVideo, autoPlay, defaultMuted]);

  const togglePlay = () => {
    if (isLocal) {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        if (v.muted) {
          v.muted = false;
          setMuted(false);
        }
        v.play();
      } else if (v.muted) {
        v.muted = false;
        setMuted(false);
      } else {
        v.pause();
      }
    } else {
      const p = playerRef.current;
      if (!p) return;
      if (playing) {
        if (p.isMuted()) {
          p.unMute();
          setMuted(false);
        } else {
          p.pauseVideo();
        }
      } else {
        if (p.isMuted()) {
          p.unMute();
          setMuted(false);
        }
        p.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (isLocal) {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !v.muted;
      setMuted(v.muted);
    } else {
      const p = playerRef.current;
      if (!p) return;
      if (p.isMuted()) p.unMute();
      else p.mute();
      setMuted(p.isMuted());
    }
  };

  const handleVideoClick = () => {
    resetHideTimer();
    togglePlay();
  };

const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (isLocal) {
      const v = videoRef.current;
      if (!v || !duration) return;
      v.currentTime = ratio * duration;
      setProgress(ratio * 100);
      setCurrentTime(ratio * duration);
    } else {
      const p = playerRef.current;
      if (!p || !duration) return;
      const target = ratio * duration;
      p.seekTo(target, true);
      setProgress(ratio * 100);
      setCurrentTime(target);
    }
  };

  const retry = () => {
    if (isLocal) {
      setLoadError(false);
      videoRef.current?.load();
    } else {
      setYtError(false);
      loadYouTubeAPI().then(() => playerRef.current?.cueVideoById && playerRef.current.cueVideoById(trailerId));
    }
  };

  const handleTimeUpdate = (e) => {
    const v = e.currentTarget;
    setCurrentTime(v.currentTime);
    if (v.duration) {
      setDuration(v.duration);
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--ps-bg-track)] flex flex-col">
      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center gap-4 px-4 md:px-8 py-4 bg-gradient-to-b from-[var(--ps-bg)] to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors group"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        <div className="flex flex-col ml-2">
          <span
            className="text-[var(--ps-fg)] font-black text-sm md:text-base uppercase tracking-widest"
            style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 20px rgba(108,99,255,0.8)' }}
          >
            {movie.title}
          </span>
          <span className="text-[var(--ps-fg-mid)] text-xs">{movie.year} · {movie.duration} · {movie.maturity}</span>
        </div>

        <button
          onClick={onClose}
          className="ml-auto p-2 rounded-full bg-[var(--ps-bg-mid-70)] hover:bg-[var(--ps-bg-mid)] text-[var(--ps-fg)] transition-colors"
          aria-label="Close player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video area */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center bg-[var(--ps-bg-track)]"
        onMouseMove={resetHideTimer}
        onClick={handleVideoClick}
      >
        {isLocal ? (
          <video
            ref={videoRef}
            key={localVideo}
            src={localVideo}
            className="w-full h-full object-contain"
            autoPlay={autoPlay}
            muted={defaultMuted}
            playsInline
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration || 0);
              setCurrentTime(0);
              setProgress(0);
              setMuted(e.currentTarget.muted);
            }}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => {
              setPlaying(true);
              endedFiredRef.current = false;
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              if (!endedFiredRef.current && onNextRef.current) {
                endedFiredRef.current = true;
                setTimeout(() => onNextRef.current(), 1200);
              }
            }}
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="w-full h-full" />
        )}

        {/* Glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(108,63,255,0.15)' }}
        />

        {/* Load error fallback */}
        {(ytError || loadError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
            <p className="text-[var(--ps-fg)] font-semibold text-lg">
              {isLocal ? 'Video could not be loaded' : 'Trailer unavailable right now'}
            </p>
            <p className="text-[var(--ps-fg-mid)] text-sm">
              {isLocal ? 'Check the file inside the public/videos folder.' : 'This video could not be loaded.'}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); retry(); }}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--ps-fg)] text-[var(--ps-bg)] font-bold text-sm rounded hover:bg-[var(--ps-fg-mid)] transition-colors active:scale-95"
            >
              <SkipForward className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Up next indicator */}
        {upNext && showControls && (
          <button
            onClick={onNext}
            onMouseMove={(e) => e.stopPropagation()}
            className="hidden md:flex absolute right-6 bottom-24 z-20 items-center gap-3 bg-black/70 backdrop-blur-md border border-white/15 hover:border-[#6c63ff]/60 rounded-lg p-3 pr-5 text-left transition-all duration-200 group/upnext"
          >
            <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-white/20">
              <VideoFrame
                src={upNext.video}
                fallback={upNext.poster}
                ratio={1}
                maxWidth={160}
                alt={upNext.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-1">
                <ListVideo className="w-3.5 h-3.5" />
                Up Next
              </p>
              <p className="text-white text-sm font-semibold truncate max-w-[180px]">{upNext.title}</p>
              <p className="text-white/60 text-xs mt-0.5">Auto-plays in a few seconds</p>
            </div>
          </button>
        )}
      </div>

      {/* Bottom controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-6 pt-16 bg-gradient-to-t from-[var(--ps-bg)] to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-[var(--ps-bg-mid)] rounded-full mb-4 cursor-pointer group"
          onClick={seek}
        >
          <div className="h-full bg-[#6c63ff] rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--ps-fg)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(108,99,255,0.8)]" />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              className="text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors"
              aria-label="Previous video"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2.5 bg-[var(--ps-fg)] text-[var(--ps-bg)] rounded-full hover:bg-[var(--ps-fg-mid)] transition-colors shadow-[0_0_15px_rgba(108,99,255,0.35)]"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={onNext}
              className="text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors"
              aria-label="Next video"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMute}
              className="text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors ml-1"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="text-[var(--ps-fg-mid)] text-sm hidden sm:inline tabular-nums">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}