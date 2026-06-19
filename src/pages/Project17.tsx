import { Link } from 'react-router-dom';

export function Project17() {
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
          minHeight: '400px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/cloth-sim.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Cloth Simulation Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Cloth Simulation</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Three.js</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Physics</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>JavaScript</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p>
            An interactive 3D cloth simulation where a fabric mesh drapes and collides with a sphere.
            Built with Three.js using a mass-spring system — each vertex is connected to its neighbors
            by structural, shear, and bend springs.
          </p>
          <p style={{ marginTop: '1rem' }}>
            One finger touch to move the cloth, two-finger pinch to zoom. Associated controls on desktop
            (left-click to interact with cloth, right-click hold to pan, scroll wheel to zoom).
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
