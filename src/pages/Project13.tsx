import { Link } from 'react-router-dom';

function pi() {
  return <span style={{ fontFamily: "serif" }}>π</span>;
}

export function Project13() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div className="viz-container-13" style={{
          position: 'relative',
          width: '100%',
          minHeight: '830px',
          backgroundColor: '#121212',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/monte-carlo-pi.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Monte Carlo Pi Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Monte Carlo Pi Estimation</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML Canvas</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Vanilla JS</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Mathematics</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            <a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/monte-carlo-pi.html" target="_blank" rel="noopener noreferrer">Source code</a>
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            A high-performance visual simulation estimating the value of Pi using the Monte Carlo method.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            Because the area of a circle is <strong>{pi()}r&sup2;</strong> and the area of its bounding square is <strong>(2r)&sup2;</strong> (or <strong>4r&sup2;</strong>), the ratio of the circle's area to the square's area is exactly <strong>{pi()} / 4</strong>. If we randomly scatter dots across the square, the ratio of dots that land <em>inside</em> the circle to the total number of dots will naturally approach this <strong>{pi()} / 4</strong> ratio. By simply multiplying our observed ratio by 4, we get an easy and elegant approximation of Pi!
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://gemini.google/overview/canvas/" target="_blank" rel="noopener noreferrer">Gemini Canvas</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
