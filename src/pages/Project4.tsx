import { Link } from 'react-router-dom';

export function Project4() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Project 4</h1>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p>
            This is a stub for Project 4. Content coming soon!
          </p>
        </div>
      </div>
    </main>
  );
}
