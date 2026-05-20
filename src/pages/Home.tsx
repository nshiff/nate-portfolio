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
              <Link to="/project/1" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(45deg, #050505, #1a1a2e)' }}>
                  <span style={{ fontSize: '2rem' }}>🌊</span>
                </div>
                <h3 className="card-title">Stable Fluids</h3>
                <p className="card-description">
                  An interactive real-time fluid simulation leveraging WebGL, based on Jos Stam's Stable Fluids paper.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>

              {/* Project 2: Turing Machine Simulator */}
              <Link to="/project/2" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                  <span style={{ fontSize: '2.5rem', fontFamily: 'monospace', color: '#3C3489', fontWeight: 'bold' }}>{'[ q0 ]'}</span>
                </div>
                <h3 className="card-title">Turing Machine</h3>
                <p className="card-description">
                  An interactive visualization of a Turing Machine, featuring state transitions and an animated tape execution.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>

              {/* Project 3: WebModular Synth */}
              <Link to="/project/3" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(to right, #1f2937, #111827)' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <span style={{ fontSize: '3rem', zIndex: 10 }}>🎛️</span>
                </div>
                <h3 className="card-title">WebModular Synth</h3>
                <p className="card-description">
                  A browser-based modular synthesizer built with React and the Web Audio API, featuring dynamic routing and interactive modules.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>
              {/* Project 4: Lorenz Attractor */}
              <Link to="/project/4" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #080a10 0%, #1e2330 100%)' }}>
                  <span style={{ fontSize: '3rem' }}>🦋</span>
                </div>
                <h3 className="card-title">Lorenz Attractor</h3>
                <p className="card-description">
                  An interactive 3D visualization of the Lorenz Attractor chaos theory mathematical model.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>
              {/* Project 5: Double Slit Experiment */}
              <Link to="/project/5" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #09203f 0%, #537895 100%)' }}>
                  <span style={{ fontSize: '3rem' }}>〰️</span>
                </div>
                <h3 className="card-title">Double Slit Experiment</h3>
                <p className="card-description">
                  An interactive visualization of wave interference in the famous double slit experiment.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>
              {/* Project 6: Maxwell's Demon */}
              <Link to="/project/6" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)' }}>
                  <span style={{ fontSize: '3rem' }}>👹</span>
                </div>
                <h3 className="card-title">Maxwell's Demon</h3>
                <p className="card-description">
                  An interactive simulation exploring entropy and the second law of thermodynamics.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>
              {/* Project 7: TI-83 Fortune Teller */}
              <Link to="/project/7" className="card card-link">
                <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #8ba888 0%, #363a3f 100%)' }}>
                  <span style={{ fontSize: '3rem' }}>🔮</span>
                </div>
                <h3 className="card-title">TI-83 Fortune Teller</h3>
                <p className="card-description">
                  A retro TI-83 calculator styled Magic 8-Ball program built with HTML, CSS, and jQuery.
                </p>
                <span className="card-action">View Details &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
