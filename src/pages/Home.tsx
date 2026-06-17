import { ProjectCard } from '../components/ProjectCard';
import { featuredProjects, projectsByCategory } from '../data/projects';
import type { Project } from '../data/projects';

const GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  marginBottom: '4rem',
};

const SECTION_HEADING: React.CSSProperties = {
  fontSize: '2rem',
  marginTop: '2rem',
  marginBottom: '1.5rem',
  borderBottom: '1px solid #333',
  paddingBottom: '0.5rem',
};

function ProjectSection({ title, projects, headingStyle }: {
  title: string;
  projects: Project[];
  headingStyle?: React.CSSProperties;
}) {
  return (
    <>
      <h2 style={{ ...SECTION_HEADING, ...headingStyle }}>{title}</h2>
      <div style={GRID_STYLE}>
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </>
  );
}

export function Home() {
  return (
    <main style={{ flex: 1 }}>
      <section id="projects" style={{ paddingTop: '0' }}>
        <div className="container">
          <ProjectSection
            title="Featured"
            projects={featuredProjects}
            headingStyle={{ borderBottomColor: 'rgb(51,51,51)', color: 'var(--text-primary)' }}
          />
          <ProjectSection title="Physics" projects={projectsByCategory('Physics')} />
          <ProjectSection title="Mathematics" projects={projectsByCategory('Mathematics')} />
          <ProjectSection title="Miscellaneous" projects={projectsByCategory('Miscellaneous')} />
        </div>
      </section>
    </main>
  );
}
