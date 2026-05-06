import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <main style={{ flex: 1 }}>

        {/* Projects Section */}
        <section id="projects" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="container">

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* Project 1: Stable Fluids */}
              <Link to="/project/1" className="card" style={{ display: 'block', color: 'inherit' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #050505, #1a1a2e)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ fontSize: '2rem' }}>🌊</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Stable Fluids</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  An interactive real-time fluid simulation leveraging WebGL, based on Jos Stam's Stable Fluids paper.
                </p>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>

              {/* Project 2: Turing Machine Simulator */}
              <Link to="/project/2" className="card" style={{ display: 'block', color: 'inherit' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ fontSize: '2.5rem', fontFamily: 'monospace', color: '#3C3489', fontWeight: 'bold' }}>{'[ q0 ]'}</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Turing Machine</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  An interactive visualization of a Turing Machine, featuring state transitions and an animated tape execution.
                </p>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>

              {/* Project 3: WebModular Synth */}
              <Link to="/project/3" className="card" style={{ display: 'block', color: 'inherit' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(to right, #1f2937, #111827)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <span style={{ fontSize: '3rem', zIndex: 10 }}>🎛️</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>WebModular Synth</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A browser-based modular synthesizer built with React and the Web Audio API, featuring dynamic routing and interactive modules.
                </p>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>
              {/* Project 4: Coming Soon */}
              <Link to="/project/4" className="card" style={{ display: 'block', color: 'inherit' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ fontSize: '3rem' }}>🚀</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Project 4</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A placeholder for an upcoming project. Stay tuned!
                </p>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
