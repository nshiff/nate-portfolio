import { Link } from 'react-router-dom';

export function Project3() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div style={{
          height: '400px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '1.5rem'
        }}>
          [Project 3 Hero Image]
        </div>

        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Project Title 3</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>React</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>TypeScript</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            This is the dedicated page for Project 3. Here you can elaborate on the problem you were trying to solve, the technologies you chose, and the challenges you faced during development.
          </p>
          <p>
            You can add more sections here like "Key Features", "Architecture", or links to the live demo and GitHub repository.
          </p>
        </div>
      </div>
    </main>
  );
}
