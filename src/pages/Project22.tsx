import { Link } from 'react-router';
import { WebAudioAPIDemo } from '../web-audio/WebAudioAPIDemo';

export function Project22() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    className="viz-container-22"
                    style={{
                        width: '100%',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <WebAudioAPIDemo />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Web Audio API demo</h1>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p>
                        A demo of sound in the browser, via the Web Audio API.
                    </p>
                </div>
            </div>
        </main>
    );
}
