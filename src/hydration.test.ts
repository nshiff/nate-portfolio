// @vitest-environment happy-dom
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { StrictMode, act, createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { PATHS, render } from './entry-server';
import { routes } from './routes';
import { ThemeProvider } from './components/theme-provider';
import { pageMeta } from './data/meta';

// Replaces the Playwright prerender suite: each page's server HTML is hydrated
// in happy-dom, and any React hydration mismatch is reported via console.error.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// happy-dom has no canvas implementation, so 2D drawing code would crash on a
// null context. A no-op context lets those components run their real code path.
// Animation frames are dropped too: they only drive post-hydration redraws, and
// letting them fire just sprays act() warnings after the test has finished.
beforeAll(() => {
  vi.stubGlobal('requestAnimationFrame', () => 0);
  vi.stubGlobal('cancelAnimationFrame', () => {});
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string,
  ) {
    if (contextId !== '2d') return null;
    const noop = () => undefined;
    return new Proxy(
      { canvas: this },
      {
        get: (target, prop) => (prop in target ? target[prop as never] : noop),
        set: () => true,
      },
    ) as unknown as CanvasRenderingContext2D;
  });
});

function clientApp(pathname: string) {
  const router = createMemoryRouter(routes, { initialEntries: [pathname] });
  return createElement(
    StrictMode,
    null,
    createElement(ThemeProvider, null, createElement(RouterProvider, { router })),
  );
}

async function hydrate(pathname: string) {
  const serverHtml = await render(pathname);
  const container = document.createElement('div');
  container.id = 'root';
  container.innerHTML = serverHtml;
  document.body.appendChild(container);

  const errors: string[] = [];
  const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
  });

  let root: { unmount: () => void };
  try {
    await act(async () => {
      root = hydrateRoot(container, clientApp(pathname));
    });
    await act(async () => {});
  } finally {
    errorSpy.mockRestore();
  }

  return {
    errors,
    cleanup: () => {
      root!.unmount();
      container.remove();
    },
  };
}

afterEach(() => {
  document.body.innerHTML = '';
});

afterAll(() => {
  document.documentElement.className = '';
});

describe('hydration', () => {
  it.each(PATHS)('%s hydrates without a mismatch', async (pathname) => {
    const { errors, cleanup } = await hydrate(pathname);
    try {
      expect(errors, errors.join('\n')).toEqual([]);
    } finally {
      cleanup();
    }
  });
});

describe('page metadata', () => {
  it('every project page has its own title and description', () => {
    const home = pageMeta('/');
    for (const pathname of PATHS.filter((p) => p !== '/')) {
      const meta = pageMeta(pathname);
      expect(meta.title, pathname).not.toBe(home.title);
      expect(meta.title, pathname).toMatch(/ — Nate Shiff$/);
      expect(meta.description, pathname).not.toBe('');
    }
  });
});
