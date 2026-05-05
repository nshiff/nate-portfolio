import { Link } from 'react-router-dom';

export function Project2() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '60vh',
          minHeight: '600px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/turing-machine.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'white',
            }}
            title="Turing Machine Simulator"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Turing Machine Simulator</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML5</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>JavaScript</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            This project is an interactive Turing Machine simulator. It visualizes the core concepts of theoretical computer science, including the infinite tape, read/write head, and state transitions.
          </p>
          <p>
            You can load various pre-defined programs, control the execution speed, and watch the state machine evaluate the input tape step-by-step.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
