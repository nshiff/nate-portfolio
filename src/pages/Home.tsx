import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
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
              <Link to="/project/1" className="card" style={{ display: 'block', color: 'inherit' }}>
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
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>

              {/* Project Stub 2 */}
              <Link to="/project/2" className="card" style={{ display: 'block', color: 'inherit' }}>
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
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>

              {/* Project Stub 3 */}
              <Link to="/project/3" className="card" style={{ display: 'block', color: 'inherit' }}>
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
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>View Details &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
