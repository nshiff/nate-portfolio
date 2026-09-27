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

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Web Audio API</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Canvas</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>React</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
                    <p><a href="https://github.com/nshiff/nate-portfolio/tree/main/src/web-audio" target="_blank" rel="noopener noreferrer">Source code</a></p>
                    <p>
                        An original piece of music, "Afterglow", played live in the browser by a small software
                        synthesizer, with a visualizer in the style of the Windows Media Player visualizations of the
                        2000s. Press Play to hear it: glowing Bezier ribbons thicken and speed up as the music gets
                        louder, and jump outward and shift color on every beat of the bass.
                    </p>
                    <p>
                        Every sound, drums included, comes from one instrument built on the Web Audio API: oscillators
                        and noise through a filter, shaped by an ADSR envelope, with an optional echo. The piece, in
                        A minor at 112 BPM, is written in a compact text notation and scheduled ahead on the audio
                        clock. Each animation frame, an AnalyserNode measures the mix's loudness and listens for bass
                        hits, and those two signals steer the curves.
                    </p>
                    <p>
                        The instrument, the composition, and the visualizer were all written by Claude, using <a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener noreferrer">Claude Code in VS Code</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
