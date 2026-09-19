import { useEffect, useState } from 'react';

const cache = new Map();
const inFlight = new Map();

// Extract a still frame from a local video file and return it as a data URL.
// Frames are centre-cropped to the requested aspect ratio and cached in memory.
export function useVideoFrame(src, { ratio = 16 / 9, seekRatio = 0.2, maxWidth = 1280 } = {}) {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    if (!src) return;

    const key = `${src}|${ratio}|${maxWidth}`;
    if (cache.has(key)) {
      setFrame(cache.get(key));
      return;
    }

    let cancelled = false;

    const generate = () =>
      new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = src;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('crossorigin', 'anonymous');

        const release = () => {
          video.removeEventListener('loadedmetadata', onLoaded);
          video.removeEventListener('seeked', onSeeked);
          video.removeEventListener('error', onError);
          video.removeAttribute('src');
          try { video.load(); } catch { /* ignore */ }
        };

        const onLoaded = () => {
          const dur = video.duration;
          if (!isFinite(dur) || dur <= 0) {
            release();
            resolve(null);
            return;
          }
          video.currentTime = Math.min(Math.max(seekRatio, 0), 0.95) * dur;
        };

        const onSeeked = () => {
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (!w || !h) {
            release();
            resolve(null);
            return;
          }

          const targetW = Math.min(Math.round(maxWidth), w);
          const targetH = Math.max(Math.round(targetW / ratio), 1);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          const scale = Math.max(targetW / w, targetH / h);
          const sw = targetW / scale;
          const sh = targetH / scale;

          ctx.drawImage(video, (w - sw) / 2, (h - sh) / 2, sw, sh, 0, 0, targetW, targetH);

          let url = null;
          try {
            url = canvas.toDataURL('image/jpeg', 0.82);
          } catch {
            url = null;
          }

          release();
          resolve(url);
        };

        const onError = () => {
          release();
          resolve(null);
        };

        video.addEventListener('loadedmetadata', onLoaded);
        video.addEventListener('seeked', onSeeked);
        video.addEventListener('error', onError);
        video.load();
      });

    const existing = inFlight.get(key);
    const promise = existing || generate().then((url) => {
      cache.set(key, url);
      return url;
    });
    inFlight.set(key, promise);

    promise
      .then((url) => {
        inFlight.delete(key);
        if (!cancelled) setFrame(url);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [src, ratio, maxWidth, seekRatio]);

  return frame;
}