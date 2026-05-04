import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  ScrollRestoration
} from 'react-router-dom';
import { Home } from './pages/Home';
import { Project1 } from './pages/Project1';
import { Project2 } from './pages/Project2';
import { Project3 } from './pages/Project3';

// Create a layout component that includes the header, footer, and ScrollRestoration
function Layout() {
  return (
    <>
      <ScrollRestoration />
      {/* Header / Nav */}
      <header style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }} className="text-gradient">
            Nate's Portfolio
          </Link>
          <nav>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem' }}>
              <li><Link to="/#about" style={{ color: 'var(--text-primary)' }}>About</Link></li>
              <li><Link to="/#projects" style={{ color: 'var(--text-primary)' }}>Projects</Link></li>
              <li><a href="#contact" style={{ color: 'var(--text-primary)' }}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Renders the current route's component */}
      <Outlet />

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

// Define the routes using the data router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/project/1",
        element: <Project1 />,
      },
      {
        path: "/project/2",
        element: <Project2 />,
      },
      {
        path: "/project/3",
        element: <Project3 />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
