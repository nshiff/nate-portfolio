export interface Project {
  id: string;
  title: string;
  description: string;
  emoji: string;
  emojiSize?: string;
  background: string;
  category: 'Physics' | 'Mathematics' | 'Miscellaneous';
  featured?: boolean;
  overlayGrid?: boolean;
  emojiStyle?: React.CSSProperties;
}

import type React from 'react';

export const projects: Project[] = [
  {
    id: '01',
    title: 'Stable Fluids',
    description: "An interactive real-time fluid simulation leveraging WebGL, based on Jos Stam's Stable Fluids paper.",
    emoji: '🌊',
    emojiSize: '2rem',
    background: 'linear-gradient(45deg, #050505, #1a1a2e)',
    category: 'Physics',
  },
  {
    id: '04',
    title: 'Lorenz Attractor',
    description: 'An interactive 3D visualization of the Lorenz Attractor chaos theory mathematical model.',
    emoji: '🦋',
    background: 'linear-gradient(135deg, #080a10 0%, #1e2330 100%)',
    category: 'Physics',
  },
  {
    id: '05',
    title: 'Double Slit Experiment',
    description: 'An interactive visualization of wave interference in the famous double slit experiment.',
    emoji: '〰️',
    background: 'linear-gradient(135deg, #09203f 0%, #537895 100%)',
    category: 'Physics',
    featured: true,
  },
  {
    id: '06',
    title: "Maxwell's Demon",
    description: 'An interactive simulation exploring entropy and the second law of thermodynamics.',
    emoji: '👹',
    background: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)',
    category: 'Physics',
  },
  {
    id: '02',
    title: 'Turing Machine',
    description: 'An interactive visualization of a Turing Machine, featuring state transitions and an animated tape execution.',
    emoji: '[ q0 ]',
    emojiSize: '2.5rem',
    emojiStyle: { fontFamily: 'monospace', color: '#3C3489', fontWeight: 'bold' },
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    category: 'Mathematics',
  },
  {
    id: '08',
    title: 'Platonic Solids Viewer',
    description: 'An interactive 3D viewer for the five Platonic solids, built using Three.js.',
    emoji: '🧊',
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    category: 'Mathematics',
    featured: true,
  },
  {
    id: '09',
    title: 'Galton Board Simulation',
    description: 'An interactive physics simulation of a Galton Board demonstrating the Central Limit Theorem.',
    emoji: '🎯',
    background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    category: 'Mathematics',
  },
  {
    id: '12',
    title: 'Towers of Hanoi',
    description: 'An interactive playable visualization and automated solver for the classic mathematical puzzle.',
    emoji: '🗼',
    background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
    category: 'Mathematics',
  },
  {
    id: '13',
    title: 'Monte Carlo Pi Estimation',
    description: 'A high-performance visual simulation estimating Pi by randomly scattering points.',
    emoji: '🥧',
    background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)',
    category: 'Mathematics',
  },
  {
    id: '14',
    title: 'Noise Visualizer',
    description: 'An interactive gallery of procedural generation noise algorithms like Perlin and Worley noise.',
    emoji: '🌌',
    background: 'linear-gradient(135deg, #0f1520 0%, #000000 100%)',
    category: 'Mathematics',
  },
  {
    id: '03',
    title: 'WebModular Synth',
    description: 'A browser-based modular synthesizer built with React and the Web Audio API, featuring dynamic routing and interactive modules.',
    emoji: '🎛️',
    background: 'linear-gradient(to right, #1f2937, #111827)',
    category: 'Miscellaneous',
    overlayGrid: true,
  },
  {
    id: '07',
    title: 'TI-83 Fortune Teller',
    description: 'A retro TI-83 calculator styled Magic 8-Ball program built with HTML, CSS, and jQuery.',
    emoji: '🔮',
    background: 'linear-gradient(135deg, #8ba888 0%, #363a3f 100%)',
    category: 'Miscellaneous',
    featured: true,
  },
  {
    id: '10',
    title: 'Navigator Dashboard',
    description: "A real-time dashboard visualizing system metrics exposed by the browser's navigator APIs.",
    emoji: '💻',
    background: 'linear-gradient(135deg, #0f172a 0%, #164e63 100%)',
    category: 'Miscellaneous',
  },
  {
    id: '11',
    title: 'Alien Caretaker',
    description: 'A virtual pet simulation featuring procedurally generated SVG aliens.',
    emoji: '👽',
    background: 'linear-gradient(135deg, #0d0d14 0%, #a78bfa 100%)',
    category: 'Miscellaneous',
  },
  {
    id: '15',
    title: 'Traffic Simulation',
    description: 'An interactive roundabout traffic simulation featuring autonomous agents.',
    emoji: '🚗',
    background: 'linear-gradient(135deg, #6B9E5A 0%, #4A4D54 100%)',
    category: 'Miscellaneous',
  },
  {
    id: '16',
    title: 'Chord Progression Generator',
    description: 'An interactive tool for generating and exploring chord progressions.',
    emoji: '🎵',
    background: 'linear-gradient(135deg, #1a0a2e 0%, #3b1f5e 100%)',
    category: 'Miscellaneous',
  },
  {
    id: '17',
    title: 'New Project',
    description: 'A stub for a new browser-based demo. Replace with the real project.',
    emoji: '🚧',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    category: 'Miscellaneous',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectsByCategory = (category: Project['category']) =>
  projects.filter((p) => p.category === category);
