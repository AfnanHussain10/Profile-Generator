
import { usePortfolio } from '@/context/PortfolioContext';
import { Github, Linkedin, Twitter, Instagram, Facebook, ExternalLink } from 'lucide-react';

const iconMap = {
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
};

const Footer = () => {
  const { portfolioData } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const getIconForSocial = (name) => {
    const lowercaseName = name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowercaseName.includes(key)) {
        return icon;
      }
    }
    return <ExternalLink className="h-5 w-5" />;
  };

  return (
    <footer className="w-full py-8 border-t border-border mt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-4 mb-4">
            {portfolioData.socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-foreground/80 hover:text-primary hover:bg-secondary/80 transition-all duration-300"
                aria-label={social.name}
              >
                {getIconForSocial(social.name)}
              </a>
            ))}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} {portfolioData.name || 'Portfolio Generator'}</p>
            <p className="mt-1">Built with portfolio generator</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
