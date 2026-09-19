import { useVideoFrame } from '../hooks/useVideoFrame';

// Renders an image sourced from a frame of the movie's local video file.
// Falls back to the provided image URL while generating / on error.
export default function VideoFrame({
  src,
  fallback,
  ratio = 16 / 9,
  maxWidth = 1280,
  ...imgProps
}) {
  const frame = useVideoFrame(src, { ratio, maxWidth });

  return <img {...imgProps} src={frame || fallback} />;
}