import { Link } from 'react-router-dom';

export function Project11() {
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
          minHeight: '700px',
          backgroundColor: '#0d0d14',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/alien-caretaker.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Alien Caretaker Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Alien Caretaker</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML/CSS</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Vanilla JS</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>SVG</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/alien-caretaker.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            Meet your new alien companion! This project is a virtual pet simulation inspired by Tamagotchi, featuring procedurally generated SVG aliens. Each pet's visual traits (shape, antennae, eyes, limbs, and colors) are derived deterministically from a unique seed, yielding over 2,000 possible combinations.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
