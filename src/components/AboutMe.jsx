
import { usePortfolio } from '@/context/PortfolioContext';

const AboutMe = () => {
  const { portfolioData } = usePortfolio();
  const { name, aboutMe, profilePicture, skills, interests } = portfolioData;

  return (
    <section id="about" className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">About Me</h2>
          <div className="h-1 w-12 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1 animate-fade-in-up">
            <div className="rounded-lg overflow-hidden bg-secondary p-2 shadow-sm">
              {profilePicture ? (
                <img 
                  src={profilePicture}
                  alt={name}
                  className="rounded w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                  Profile Picture Placeholder
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-lg bg-primary/10 dark:bg-primary/20"></div>
          </div>
          
          <div className="order-1 md:order-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-medium mb-4">Hello, I'm {name || 'Your Name'}</h3>
            
            <div className="prose prose-sm md:prose-base dark:prose-invert">
              <p className="text-muted-foreground mb-6">
                {aboutMe || 'Share your story, background, and what drives you.'}
              </p>
            </div>
            
            {skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill.id}
                      className="px-3 py-1 rounded-full bg-secondary text-foreground/90 text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {interests && (
              <div>
                <h4 className="text-lg font-medium mb-3">Interests</h4>
                <p className="text-muted-foreground">
                  {interests}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
