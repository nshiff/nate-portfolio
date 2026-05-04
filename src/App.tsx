import React from 'react';

export function App() {
  return (
    <>
      {/* Header / Nav */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-gradient">
            Portfolio
          </div>
          <nav>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem' }}>
              <li><a href="#about" style={{ color: 'var(--text-primary)' }}>About</a></li>
              <li><a href="#projects" style={{ color: 'var(--text-primary)' }}>Projects</a></li>
              <li><a href="#contact" style={{ color: 'var(--text-primary)' }}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section id="about">
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
              Hi, I build <span className="text-gradient">amazing things</span> for the web.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
              I'm a software engineer passionate about creating beautiful, responsive, and user-centric digital experiences. 
              Currently exploring modern web technologies and building scalable applications.
            </p>
            <a href="#projects" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'var(--gradient-primary)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-sm)'
            }}>
              View My Work
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Selected Projects</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {/* Project Stub 1 */}
              <div className="card">
                <div style={{ 
                  height: '200px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  [Project Image Stub]
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Project Title 1</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A brief description of the project goes here. Explain what it does and the tech stack used.
                </p>
                <a href="#" style={{ fontWeight: 'bold' }}>View Details &rarr;</a>
              </div>

              {/* Project Stub 2 */}
              <div className="card">
                <div style={{ 
                  height: '200px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  [Project Image Stub]
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Project Title 2</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A brief description of the project goes here. Explain what it does and the tech stack used.
                </p>
                <a href="#" style={{ fontWeight: 'bold' }}>View Details &rarr;</a>
              </div>

              {/* Project Stub 3 */}
              <div className="card">
                <div style={{ 
                  height: '200px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  [Project Image Stub]
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Project Title 3</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A brief description of the project goes here. Explain what it does and the tech stack used.
                </p>
                <a href="#" style={{ fontWeight: 'bold' }}>View Details &rarr;</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" style={{ padding: '3rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Let's Connect</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
          <a href="mailto:hello@example.com" style={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid var(--accent-color)' }}>
            hello@example.com
          </a>
          <div style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} Your Name. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
