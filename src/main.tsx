import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { routes } from './routes.tsx'
import { ThemeProvider } from './components/theme-provider'

const router = createBrowserRouter(routes)

const app = (
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)

// A production build prerenders every page (see scripts/prerender.js), so take over
// that HTML. The dev server serves only a placeholder comment, so render from scratch there.
const root = document.getElementById('root')!
if (root.firstElementChild) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
