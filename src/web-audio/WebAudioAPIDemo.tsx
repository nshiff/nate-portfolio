import { useEffect, useRef } from 'react';
import { DEFAULT_PARAMS, drawFrame } from './visualizer';

/** Web Audio API demo: a full-size canvas running the visualizer every animation frame. */
export function WebAudioAPIDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Match the backing store to the displayed size, so lines stay crisp on high-DPI screens.
    // Resizing clears the canvas and its transform, so both are set up again here.
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let frame = 0;
    function tick(now: number) {
      drawFrame(ctx, canvas.clientWidth, canvas.clientHeight, now / 1000, DEFAULT_PARAMS);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Glowing curves drifting across a black background"
      style={{ display: 'block', width: '100%', height: '100%', background: '#000' }}
    />
  );
}
