import { Link } from 'react-router';
import { SearchParty2 } from '../search-party/SearchParty2';

export function Project21() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    className="viz-container-21"
                    style={{
                        width: '100%',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <SearchParty2 />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Search Party 2.0</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Zork-like</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Text Adventure</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>React</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p><a href="https://github.com/nshiff/nate-portfolio/tree/main/src/search-party" target="_blank" rel="noopener noreferrer">Source code</a></p>
                    <p>
                        A Zork-like text adventure, and a rebuild of the original <Link to="/project/20">Search Party</Link>.
                    </p>
                    <p>
                        The original is a single script on a standalone page. 2.0 runs inside the portfolio's React
                        app and is written in TypeScript. Rooms, items, and color zones are plain data, and the game
                        itself is one pure function that takes the current state and a line of input and returns the
                        output and the next state. The terminal component knows nothing about the game. Browser tests
                        play through it end to end.
                    </p>
                    <p>
                        Search Party 2.0 is built with <a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener noreferrer">Claude Code in VS Code</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
