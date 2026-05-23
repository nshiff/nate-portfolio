import { Link } from 'react-router-dom';

export function Project8() {
  return (
    <main style={{ flex: 1, padding: '2rem 0' }}>
      <div className="container">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          &larr; Back to Portfolio
        </Link>

        <div style={{
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
            src="/demo/platonic-solids.html"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Platonic Solids Viewer Demo"
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Platonic Solids Viewer</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>Three.js</span>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px', fontSize: '0.875rem' }}>HTML/CSS</span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.8', maxWidth: '800px' }}>
          <p><a href="https://github.com/nshiff/nate-portfolio/blob/main/public/demo/platonic-solids.html" target="_blank" rel="noopener noreferrer">Source code</a></p>
          <p>
            Named after the ancient Greek philosopher Plato, Platonic solids are unique, perfectly symmetrical 3D shapes. For a shape to be considered Platonic, every single one of its faces must be the exact same regular polygon, and the same number of faces must meet at every corner. Remarkably, the laws of geometry dictate that there can only ever be <em>exactly five</em> such shapes in our universe: the tetrahedron (4 triangles), the cube (6 squares), the octahedron (8 triangles), the dodecahedron (12 pentagons), and the icosahedron (20 triangles).
          </p>
          <p>
            These mathematical marvels have fascinated thinkers for millennia. Plato himself theorized that they were the fundamental building blocks of nature, associating them with the classical elements of fire, earth, air, the cosmos, and water. Today, we know they aren't the literal building blocks of matter, but their elegant symmetry continues to appear everywhere in the natural world—from the molecular crystal structures of minerals to the geometric shells of certain viruses.
          </p>
          <p>
            This project was created using AI-assisted development with <a href="https://gemini.google/overview/canvas/" target="_blank" rel="noopener noreferrer">Gemini Canvas</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
