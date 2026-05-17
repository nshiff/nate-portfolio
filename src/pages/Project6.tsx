import { Link } from 'react-router-dom';

export function Project6() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '73vh',
          minHeight: '400px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/maxwells-demon.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Maxwell's Demon Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Maxwell's Demon</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML5 Canvas</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>jQuery</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/maxwells-demon.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            This project is an interactive simulation of Maxwell's Demon, a famous thought experiment that appears to violate the second law of thermodynamics.
          </p>
          <p>
            You can interact with the simulation to see how the demon selectively allows fast and slow particles to pass through a gate, decreasing the total entropy of the system.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
