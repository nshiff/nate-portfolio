import type { RouteObject } from 'react-router';
import { Layout } from './components/Layout';
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
import { Project18 } from './pages/Project18';
import { Project19 } from './pages/Project19';
import { Project20 } from './pages/Project20';
import { Project21 } from './pages/Project21';
import { Project22 } from './pages/Project22';

// Shared by the browser router (main.tsx) and the build-time prerender (entry-server.tsx)
export const routes: RouteObject[] = [
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
        path: "/project/18",
        element: <Project18 />,
      },
      {
        path: "/project/19",
        element: <Project19 />,
      },
      {
        path: "/project/20",
        element: <Project20 />,
      },
      {
        path: "/project/21",
        element: <Project21 />,
      },
      {
        path: "/project/22",
        element: <Project22 />,
      },
    ],
  },
];

// Every page's URL, for the prerender to write one HTML file each
export const PATHS = routes[0].children!.map((route) => route.path!);
