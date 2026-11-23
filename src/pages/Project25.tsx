import { Link } from 'react-router';

export function Project25() {
    return (
        <main style={{ flex: 1, padding: '2rem 0' }}>
            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    &larr; Back to Portfolio
                </Link>

                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '60vh',
                        minHeight: '400px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        marginBottom: '3rem',
                        overflow: 'hidden',
                    }}>
                    <iframe
                        src="/demo/android-nexus-wallpaper.html"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        title="Nexus Live Wallpaper Demo"
                    />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Nexus Live Wallpaper</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Canvas</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>JavaScript</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/android-nexus-wallpaper.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
                    <p>
                        A Canvas 2D recreation of the "Nexus" live wallpaper from Android 2.1: colored light pulses glide across
                        a grid of pyramid studs, catching each facet as they pass. Plain JavaScript, no dependencies.
                    </p>
                    <p>
                        Tap or click to send out a burst of pulses.
                    </p>
                    <p>
                        This project was created using AI-assisted development with the <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude web interface</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
