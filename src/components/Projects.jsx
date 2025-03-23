import { useEffect, useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import ProjectCard from './ProjectCard';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Projects = () => {
  const { portfolioData, reorderProjects } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [draggingId, setDraggingId] = useState(null);

  const { isLoading, error } = useQuery({
    queryKey: ['portfolioProjects'],
    queryFn: async () => {
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return the projects from context
      return portfolioData.projects;
    },
    onSuccess: (data) => {
      setProjects(data);
      console.log('Projects fetched successfully:', data);
    },
    onError: (err) => {
      console.error('Error fetching projects:', err);
      toast.error('Failed to load projects');
    },
    // Only fetch if there are projects to avoid unnecessary API calls
    enabled: portfolioData.projects.length > 0,
    // Refetch on window focus
    refetchOnWindowFocus: true,
  });

  // Update local projects state when portfolio data changes
  useEffect(() => {
    setProjects(portfolioData.projects);
  }, [portfolioData.projects]);

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    
    if (!draggingId || draggingId === targetId) return;
    
    const dragIndex = projects.findIndex(p => p.id === draggingId);
    const hoverIndex = projects.findIndex(p => p.id === targetId);
    
    if (dragIndex === -1 || hoverIndex === -1) return;
    
    // Reorder locally for immediate UI update
    const newProjects = [...projects];
    const [draggedProject] = newProjects.splice(dragIndex, 1);
    newProjects.splice(hoverIndex, 0, draggedProject);
    
    setProjects(newProjects);
  };

  const handleDragEnd = () => {
    if (!draggingId) return;
    
    const dragIndex = portfolioData.projects.findIndex(p => p.id === draggingId);
    const newIndex = projects.findIndex(p => p.id === draggingId);
    
    if (dragIndex !== newIndex) {
      // Update the context with the new order
      reorderProjects(dragIndex, newIndex);
      toast.success('Project order updated');
    }
    
    setDraggingId(null);
  };

  return (
    <section id="projects" className="py-20 px-4 md:px-6 bg-secondary/50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Projects</h2>
          <div className="h-1 w-12 bg-primary mx-auto mt-4 rounded-full"></div>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Showcasing my latest work. Drag and drop to reorder projects.
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load projects. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No projects added yet.</p>
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => handleDragStart(project.id)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragEnd={handleDragEnd}
                className="animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <ProjectCard 
                  project={project} 
                  isDragging={draggingId === project.id}
                  dragHandleProps={{
                    onMouseDown: (e) => {
                      e.currentTarget.parentElement?.setAttribute('draggable', 'true');
                    },
                    onMouseUp: (e) => {
                      e.currentTarget.parentElement?.setAttribute('draggable', 'false');
                    },
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
