import { projects } from './projects';

export const SITE_URL = 'https://nate-portfolio.onrender.com';

export type PageMeta = { title: string; description: string };

const HOME: PageMeta = {
  title: 'Nate Shiff — Interactive Web Projects',
  description:
    "Nate Shiff's portfolio of interactive web projects: physics simulations, math visualizations, " +
    'audio experiments, and text adventures, many built with AI tools.',
};

/** The title and description for a page, by its URL path. Unknown paths get the home page's. */
export function pageMeta(pathname: string): PageMeta {
  const project = projects.find((p) => pathname === `/project/${p.id}`);
  return project
    ? { title: `${project.title} — Nate Shiff`, description: project.description }
    : HOME;
}
