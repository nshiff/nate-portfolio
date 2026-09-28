import { useEffect } from 'react';
import { Outlet, Link, ScrollRestoration, useLocation } from 'react-router';
import { pageMeta } from '../data/meta';
import { ThemeToggle } from './ThemeToggle';

// Create a layout component that includes the header, footer, and ScrollRestoration
export function Layout() {
  // Prerendered pages arrive with the right <title>; this keeps it right while navigating in the app.
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pageMeta(pathname).title;
  }, [pathname]);

  return (
    <>
      <ScrollRestoration />
      {/* Header / Nav */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }} className="text-gradient">
            Nate's Portfolio
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Renders the current route's component */}
      <Outlet />

      {/* Footer */}
      <footer id="contact" style={{ padding: '3rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">

          <h2>Let's Connect</h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
            <a href="https://x.com/nateradetunes" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: '500' }}>
              𝕏
            </a>
            <a href="https://github.com/nshiff" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: '500' }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nate-shiff/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: '500' }}>
              LinkedIn
            </a>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} Nate Shiff. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
