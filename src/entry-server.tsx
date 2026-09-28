/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { routes } from './routes';
import { ThemeProvider } from './components/theme-provider';
import { SITE_URL } from './data/meta';

export { PATHS } from './routes';
export { pageMeta, SITE_URL } from './data/meta';

const handler = createStaticHandler(routes);

/** Render one page to an HTML string, for scripts/prerender.js to write into dist/. */
export async function render(pathname: string): Promise<string> {
  const context = await handler.query(new Request(SITE_URL + pathname));
  if (context instanceof Response) {
    throw new Error(`${pathname} answered with a redirect or response, not a page`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        {/* No loaders, so there is no router data for the browser to pick up */}
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </ThemeProvider>
    </StrictMode>,
  );
}
