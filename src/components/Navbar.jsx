import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = ({ navItems = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight"
          aria-label="Home"
        >
          <span className="text-primary">Portfolio</span>
          <span className="text-foreground">Generator</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {navItems.length > 0 && (
            <>
              {/* Mobile menu button */}
              {isMobile && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md hover:bg-secondary transition-colors ml-1"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
              
              {/* Desktop navigation */}
              {!isMobile && (
                <nav className="flex items-center space-x-6 ml-6">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Mobile navigation overlay */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-background/98 backdrop-blur-sm z-50 pt-20 px-4 pb-6 animate-fade-in">
          <nav className="flex flex-col space-y-6 items-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
