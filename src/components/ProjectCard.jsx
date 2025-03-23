import { Github, ExternalLink, Grip } from 'lucide-react';
import { forwardRef } from 'react';

const ProjectCard = forwardRef(
  ({ project, isDragging, dragHandleProps }, ref) => {
    const { title, description, image, githubLink } = project;

    return (
      <div
        ref={ref}
        className={`group relative bg-card text-card-foreground rounded-lg overflow-hidden shadow-sm border border-border transition-all duration-300 ${
          isDragging 
            ? 'scale-105 shadow-md rotate-2' 
            : 'hover:shadow-md hover:transform hover:translate-y-[-5px]'
        }`}
      >
        <div 
          {...dragHandleProps}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground cursor-grab z-10"
        >
          <Grip size={16} />
        </div>
        
        <div className="relative h-48 overflow-hidden bg-muted">
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Project Image Placeholder
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {description}
          </p>
          
          <div className="flex items-center mt-auto">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mr-4"
              >
                <Github size={16} />
                <span>View Code</span>
              </a>
            )}
            
          </div>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
