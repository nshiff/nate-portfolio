// Draws a Windows Media Player-style visualization: glowing Bezier ribbons whose
// control points drift on slow Lissajous paths, leaving fading trails.
// Everything the picture does is driven by VisualParams, so audio can steer it.

export type VisualParams = {
  // Multiplies how fast the curves move.
  speed: number;
  // Hue offset in degrees, and how many degrees it drifts per second.
  hue: number;
  hueSpeed: number;
  // Stroke width in CSS pixels.
  lineWidth: number;
  // How far the control points reach, as a fraction of the half-width / half-height.
  spread: number;
  // How much of the previous frame is wiped every 60th of a second, 0-1. Lower means longer trails.
  fade: number;
  // 1 = no mirroring, 2 = point symmetry, 4 = mirrored in both axes.
  symmetry: 1 | 2 | 4;
};

export const DEFAULT_PARAMS: VisualParams = {
  speed: 1,
  hue: 200,
  hueSpeed: 12,
  lineWidth: 2,
  spread: 0.85,
  fade: 0.08,
  symmetry: 4,
};

// Each ribbon's four Bezier points trace their own Lissajous path, in radians per second.
const RIBBONS = [
  { fx: [0.31, 0.53, 0.47, 0.29], fy: [0.37, 0.41, 0.59, 0.43], phase: 0 },
  { fx: [0.43, 0.27, 0.61, 0.39], fy: [0.33, 0.57, 0.35, 0.51], phase: 2.1 },
  { fx: [0.23, 0.49, 0.37, 0.55], fy: [0.47, 0.29, 0.53, 0.31], phase: 4.2 },
];

// A ribbon is several copies of its curve, each lagging slightly behind the last.
const STRANDS = 6;
const STRAND_LAG = 0.15;

// Scale factors for each mirrored copy.
const MIRRORS = { 1: [[1, 1]], 2: [[1, 1], [-1, -1]], 4: [[1, 1], [-1, -1], [-1, 1], [1, -1]] };

// Longest frame step honoured, so returning to a background tab doesn't lurch.
const MAX_DT = 0.1;

/**
 * Returns a draw function for one canvas. It keeps its own motion and colour clocks,
 * so speed and hueSpeed can change every frame without the picture jumping.
 */
export function createVisualizer() {
  let motion = 0;
  let drift = 0;

  return (ctx: CanvasRenderingContext2D, width: number, height: number, dt: number, params: VisualParams) => {
    dt = Math.min(dt, MAX_DT);
    motion += dt * params.speed;
    drift += dt * params.hueSpeed;

    // Scale the wipe by frame time, so trails are the same length at any refresh rate.
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - (1 - params.fade) ** (dt * 60)})`;
    ctx.fillRect(0, 0, width, height);

    const rx = (width / 2) * params.spread;
    const ry = (height / 2) * params.spread;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = params.lineWidth;
    ctx.lineCap = 'round';

    RIBBONS.forEach((ribbon, i) => {
      const hue = params.hue + drift + i * 40;
      for (let s = 0; s < STRANDS; s++) {
        const t = motion - s * STRAND_LAG;
        const [a, b, c, d] = [0, 1, 2, 3].map((k) => [
          rx * Math.sin(ribbon.fx[k] * t + ribbon.phase + k),
          ry * Math.sin(ribbon.fy[k] * t + ribbon.phase * 1.3 + k * 2),
        ]);
        ctx.strokeStyle = `hsla(${hue + s * 6}, 100%, 60%, ${0.5 * (1 - s / STRANDS)})`;
        for (const [sx, sy] of MIRRORS[params.symmetry]) {
          ctx.save();
          ctx.scale(sx, sy);
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    ctx.restore();
  };
}
