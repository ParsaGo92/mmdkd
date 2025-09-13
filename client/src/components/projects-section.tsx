import { Gamepad2, Palette } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export default function ProjectsSection() {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Retro Game Engine',
      description: 'A pixel-perfect 2D game engine built with TypeScript and Canvas API',
      icon: Gamepad2,
      tags: ['TypeScript', 'Canvas']
    },
    {
      id: '2',
      name: 'Pixel Art Creator',
      description: 'Web-based pixel art editor with layer support and export options',
      icon: Palette,
      tags: ['React', 'WebGL']
    }
  ];

  return (
    <section className="retro-border bg-card rounded-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide" data-testid="text-projects-title">Featured Projects</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-secondary p-4 rounded-lg border border-border hover:border-primary transition-colors"
            data-testid={`card-project-${project.id}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <project.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground" data-testid={`text-project-name-${project.id}`}>{project.name}</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-3" data-testid={`text-project-description-${project.id}`}>
              {project.description}
            </p>
            <div className="flex space-x-2">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-muted text-xs rounded border border-border"
                  data-testid={`tag-${tag.toLowerCase()}-${project.id}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
