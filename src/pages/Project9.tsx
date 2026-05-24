import { Link } from 'react-router-dom';

export function Project9() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          minHeight: '600px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/galton-board.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Galton Board Simulation"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Galton Board Simulation</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML Canvas</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>JavaScript</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/galton-board.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            This interactive Galton Board simulation provides a real-time visualization of probability and statistics in action. As each ball drops, it encounters a series of pegs, with an equal chance of bouncing left or right at each collision. While the path of any single ball is governed by simulated physics—making its exact trajectory chaotic and effectively unpredictable—the collective behavior of the balls is entirely predictable. As they settle into the bins below, they inevitably form a classic bell curve, or normal distribution. It is a mesmerizing, visual demonstration of the Central Limit Theorem, revealing how profound mathematical order naturally emerges from underlying randomness.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://gemini.google/overview/canvas/" target="_blank" rel="noopener noreferrer">Gemini Canvas</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
