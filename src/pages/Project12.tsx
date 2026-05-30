import { Link } from 'react-router-dom';

export function Project12() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div className="viz-container-12" style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          minHeight: '700px',
          backgroundColor: '#1a1a2e',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/towers-of-hanoi.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Towers of Hanoi Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Towers of Hanoi</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML/CSS</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Vanilla JS</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Algorithms</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/towers-of-hanoi.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            An interactive visualization of the classic Towers of Hanoi mathematical puzzle. Features both a playable game mode where you can move the disks yourself, and an automated solver that visually demonstrates the recursive algorithm step-by-step.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://gemini.google/overview/canvas/" target="_blank" rel="noopener noreferrer">Gemini Canvas</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
