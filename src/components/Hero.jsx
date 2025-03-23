import { ArrowDown } from 'lucide-react';

const Hero = ({ name, shortBio }) => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 relative overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-70"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center fade-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          {name || "Hello, I'm..."}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
          {shortBio || "Welcome to my portfolio showcase."}
        </p>
        
        <button
          onClick={scrollToProjects}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          View My Work
        </button>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse-subtle">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;
