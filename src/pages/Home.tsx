import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main style={{ flex: 1 }}>

      {/* Hero Section */}
      <section id="hero" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Follow your curiosity and enjoy this collection of simulations. All demos are optimized for both mobile and desktop viewports.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ paddingTop: '0' }}>
        <div className="container">

          {/* Physics */}
          <h2 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Physics</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Project 1: Stable Fluids */}
            <Link to="/project/01" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(45deg, #050505, #1a1a2e)' }}>
                <span style={{ fontSize: '2rem' }}>🌊</span>
              </div>
              <h3 className="card-title">Stable Fluids</h3>
              <p className="card-description">
                An interactive real-time fluid simulation leveraging WebGL, based on Jos Stam's Stable Fluids paper.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 4: Lorenz Attractor */}
            <Link to="/project/04" className="card card-link">
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
            <Link to="/project/05" className="card card-link">
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
            <Link to="/project/06" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)' }}>
                <span style={{ fontSize: '3rem' }}>👹</span>
              </div>
              <h3 className="card-title">Maxwell's Demon</h3>
              <p className="card-description">
                An interactive simulation exploring entropy and the second law of thermodynamics.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>
          </div>

          {/* Mathematics */}
          <h2 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Mathematics</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Project 2: Turing Machine Simulator */}
            <Link to="/project/02" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <span style={{ fontSize: '2.5rem', fontFamily: 'monospace', color: '#3C3489', fontWeight: 'bold' }}>{'[ q0 ]'}</span>
              </div>
              <h3 className="card-title">Turing Machine</h3>
              <p className="card-description">
                An interactive visualization of a Turing Machine, featuring state transitions and an animated tape execution.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 8: Platonic Solids */}
            <Link to="/project/08" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🧊</span>
              </div>
              <h3 className="card-title">Platonic Solids Viewer</h3>
              <p className="card-description">
                An interactive 3D viewer for the five Platonic solids, built using Three.js.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 9: Galton Board */}
            <Link to="/project/09" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🎯</span>
              </div>
              <h3 className="card-title">Galton Board Simulation</h3>
              <p className="card-description">
                An interactive physics simulation of a Galton Board demonstrating the Central Limit Theorem.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 12: Towers of Hanoi */}
            <Link to="/project/12" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🗼</span>
              </div>
              <h3 className="card-title">Towers of Hanoi</h3>
              <p className="card-description">
                An interactive playable visualization and automated solver for the classic mathematical puzzle.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 13: Monte Carlo Pi */}
            <Link to="/project/13" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🥧</span>
              </div>
              <h3 className="card-title">Monte Carlo Pi Estimation</h3>
              <p className="card-description">
                A high-performance visual simulation estimating Pi by randomly scattering points.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 14: Noise Visualizer */}
            <Link to="/project/14" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #0f1520 0%, #000000 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🌌</span>
              </div>
              <h3 className="card-title">Noise Visualizer</h3>
              <p className="card-description">
                An interactive gallery of procedural generation noise algorithms like Perlin and Worley noise.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>
          </div>

          {/* Miscellaneous */}
          <h2 style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Miscellaneous</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Project 3: WebModular Synth */}
            <Link to="/project/03" className="card card-link">
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

            {/* Project 7: TI-83 Fortune Teller */}
            <Link to="/project/07" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #8ba888 0%, #363a3f 100%)' }}>
                <span style={{ fontSize: '3rem' }}>🔮</span>
              </div>
              <h3 className="card-title">TI-83 Fortune Teller</h3>
              <p className="card-description">
                A retro TI-83 calculator styled Magic 8-Ball program built with HTML, CSS, and jQuery.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 10: Navigator Dashboard */}
            <Link to="/project/10" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #164e63 100%)' }}>
                <span style={{ fontSize: '3rem' }}>💻</span>
              </div>
              <h3 className="card-title">Navigator Dashboard</h3>
              <p className="card-description">
                A real-time dashboard visualizing system metrics exposed by the browser's navigator APIs.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>

            {/* Project 11: Alien Caretaker */}
            <Link to="/project/11" className="card card-link">
              <div className="card-image-wrapper" style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #a78bfa 100%)' }}>
                <span style={{ fontSize: '3rem' }}>👽</span>
              </div>
              <h3 className="card-title">Alien Caretaker</h3>
              <p className="card-description">
                A virtual pet simulation featuring procedurally generated SVG aliens.
              </p>
              <span className="card-action">View Details &rarr;</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
