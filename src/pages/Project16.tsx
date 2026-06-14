import { Link } from 'react-router-dom';

export function Project16() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div className="viz-container-16" style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          minHeight: '700px',
          backgroundColor: '#000',
          borderRadius: '12px',
          marginBottom: '3rem',
          overflow: 'hidden',
        }}>
          <iframe
            src="/demo/chord-progression-gen.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Chord Progression Generator Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Chord Progression Generator</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>WebAudio API</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Music theory</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/chord-progression-gen.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            An interactive chord progression generator that applies real music theory rules to produce
            playable 4-chord progressions in any key. Choose between Jazz and Country genres: Jazz mode
            uses diatonic ii–V–I movement with programmatic alterations like secondary dominants and tritone
            substitutions, while Country mode draws from classic Nashville Number System paths such as
            I–IV–V–I and I–V–vi–IV.
          </p>
          <p>
            Each chord is voiced with smooth inversions and rendered in real time using the Web Audio API,
            mixing sine and triangle oscillators with an ADSR envelope to approximate an electric piano tone.
            Click any chord card to hear it played back, or tap Generate to explore a new progression.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://gemini.google/overview/canvas/" target="_blank" rel="noopener noreferrer">Gemini Canvas</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
