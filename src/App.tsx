import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  ScrollRestoration
} from 'react-router-dom';
import { Home } from './pages/Home';
import { Project01 } from './pages/Project01';
import { Project02 } from './pages/Project02';
import { Project03 } from './pages/Project03';
import { Project04 } from './pages/Project04';
import { Project05 } from './pages/Project05';
import { Project06 } from './pages/Project06';
import { Project07 } from './pages/Project07';
import { Project08 } from './pages/Project08';
import { Project09 } from './pages/Project09';
import { Project10 } from './pages/Project10';
import { Project11 } from './pages/Project11';
import { Project12 } from './pages/Project12';
import { Project13 } from './pages/Project13';
import { Project14 } from './pages/Project14';
import { Project15 } from './pages/Project15';
import { Project16 } from './pages/Project16';
import { Project17 } from './pages/Project17';
import { Project18 } from './pages/Project18';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/ThemeToggle';

// Create a layout component that includes the header, footer, and ScrollRestoration
function Layout() {
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
        path: "/project/01",
        element: <Project01 />,
      },
      {
        path: "/project/02",
        element: <Project02 />,
      },
      {
        path: "/project/03",
        element: <Project03 />,
      },
      {
        path: "/project/04",
        element: <Project04 />,
      },
      {
        path: "/project/05",
        element: <Project05 />,
      },
      {
        path: "/project/06",
        element: <Project06 />,
      },
      {
        path: "/project/07",
        element: <Project07 />,
      },
      {
        path: "/project/08",
        element: <Project08 />,
      },
      {
        path: "/project/09",
        element: <Project09 />,
      },
      {
        path: "/project/10",
        element: <Project10 />,
      },
      {
        path: "/project/11",
        element: <Project11 />,
      },
      {
        path: "/project/12",
        element: <Project12 />,
      },
      {
        path: "/project/13",
        element: <Project13 />,
      },
      {
        path: "/project/14",
        element: <Project14 />,
      },
      {
        path: "/project/15",
        element: <Project15 />,
      },
      {
        path: "/project/16",
        element: <Project16 />,
      },
      {
        path: "/project/17",
        element: <Project17 />,
      },
      {
        path: "/project/18",
        element: <Project18 />,
      },
    ],
  },
]);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
