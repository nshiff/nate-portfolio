import { Link } from 'react-router';
import ColorToggle from '../components/ColorToggle';

export function Project23() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    className="viz-container-23"
                    style={{
                        width: '100%',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <ColorToggle />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Color Toggle</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>React</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>TypeScript</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/src/components/ColorToggle.tsx" target="_blank" rel="noopener noreferrer">Source code</a></p>
                    <p>
                        A minimal React component: one line of text and a button that toggles its color between red and blue.
                    </p>
                    <p>
                        This component was written by Claude in the <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude web interface</a> and imported into this portfolio as-is.
                    </p>
                </div>
            </div>
        </main>
    );
}
