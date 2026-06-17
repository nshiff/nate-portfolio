import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';

export function ProjectCard({ project }: { project: Project }) {
  const emojiSize = project.emojiSize ?? '3rem';

  return (
    <Link to={`/project/${project.id}`} className="card card-link">
      <div className="card-image-wrapper" style={{ background: project.background }}>
        {project.overlayGrid && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.2,
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        )}
        <span style={{ fontSize: emojiSize, zIndex: 10, ...project.emojiStyle }}>{project.emoji}</span>
      </div>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-description">{project.description}</p>
      <span className="card-action">View Details &rarr;</span>
    </Link>
  );
}
