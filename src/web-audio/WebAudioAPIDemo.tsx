import { useEffect, useRef, useState } from 'react';
import { AFTERGLOW } from './composition';
import { createReactor } from './reactor';
import { perform } from './score';
import { DEFAULT_PARAMS, createVisualizer } from './visualizer';
import type { VisualParams } from './visualizer';

type Audio = {
  ctx: AudioContext;
  // Each performance plays into this, through the analyser and a limiter to the speakers.
  master: GainNode;
  read: (dt: number) => VisualParams;
};

// Browsers only allow audio after a user gesture, so this is only called from a click.
function openAudio(): Audio {
  const ctx = new AudioContext();
  const master = new GainNode(ctx, { gain: 0.7 });
  const analyser = new AnalyserNode(ctx);
  master.connect(analyser).connect(new DynamicsCompressorNode(ctx, { threshold: -6, ratio: 12 })).connect(ctx.destination);
  return { ctx, master, read: createReactor(analyser) };
}

/**
 * Web Audio API demo: plays "Afterglow" on the instrument in ./instrument.ts, and runs
 * the visualizer every animation frame, steered by what the analyser hears.
 */
export function WebAudioAPIDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<Audio | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const draw = createVisualizer();

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
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.max(0, now - last) / 1000;
      last = now;
      // Before the first Play there's nothing to listen to; afterwards silence reads as the resting look.
      const params = audioRef.current?.read(dt) ?? DEFAULT_PARAMS;
      draw(ctx, canvas.clientWidth, canvas.clientHeight, dt, params);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Leaving the page stops the music.
  useEffect(
    () => () => {
      stopRef.current?.();
      stopRef.current = null;
      void audioRef.current?.ctx.close();
      audioRef.current = null;
    },
    [],
  );

  function toggle() {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
      setPlaying(false);
      return;
    }

    const audio = (audioRef.current ??= openAudio());
    void audio.ctx.resume();
    // A fresh gain per performance, so stopping can fade out notes already scheduled ahead.
    const run = new GainNode(audio.ctx);
    run.connect(audio.master);
    const stopScore = perform(audio.ctx, run, AFTERGLOW);
    stopRef.current = () => {
      stopScore();
      run.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.05);
      setTimeout(() => run.disconnect(), 3000);
    };
    setPlaying(true);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Glowing curves drifting across a black background"
        style={{ display: 'block', width: '100%', height: '100%', background: '#000' }}
      />
      <button
        type="button"
        onClick={toggle}
        style={{
          position: 'absolute',
          left: '1rem',
          bottom: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          font: 'inherit',
          cursor: 'pointer',
        }}>
        <span aria-hidden="true">{playing ? '■ ' : '▶ '}</span>
        {playing ? 'Stop' : 'Play'}
      </button>
    </div>
  );
}
