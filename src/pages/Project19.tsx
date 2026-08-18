import { Link } from 'react-router';

export function Project19() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    className="viz-container-19"
                    style={{
                        position: 'relative',
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <iframe
                        src="/demo/wave-function-collapse.html"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        title="Wave Function Collapse Demo"
                    />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Wave Function Collapse</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Mathematics</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Canvas</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>JavaScript</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p>
                        An interactive visualization of the Wave Function Collapse algorithm — a constraint-based procedural
                        generation technique. Each grid cell starts able to become any tile from a 9-tile set; every step, the
                        least-uncertain cell collapses to a single tile via weighted random selection, and that choice ripples
                        outward through the grid via constraint propagation, eliminating incompatible options from neighboring
                        cells until the whole grid resolves.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        This project was created using AI-assisted development with <a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener noreferrer">Claude Code in VS Code</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
