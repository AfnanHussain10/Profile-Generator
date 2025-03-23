
import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const { portfolioData } = usePortfolio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    // Simulate loading time for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Build navigation items based on available sections
    const items = [
      { label: 'Home', href: '#' },
    ];

    if (portfolioData.aboutMe || portfolioData.skills.length > 0) {
      items.push({ label: 'About', href: '#about' });
    }

    if (portfolioData.projects.length > 0) {
      items.push({ label: 'Projects', href: '#projects' });
    }

    items.push({ label: 'Contact', href: '#contact' });
    
    setNavItems(items);

    return () => clearTimeout(timer);
  }, [portfolioData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar navItems={navItems} />
      
      <main className="pt-16">
        <Hero
          name={portfolioData.name || 'Your Name'}
          shortBio={portfolioData.shortBio || 'Your short bio will appear here'}
        />
        
        <AboutMe />
        
        <Projects />
        
        <Contact />
      </main>
      
      <Footer />
      
      <Link
        to="/"
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Edit portfolio"
      >
        <Edit size={20} />
      </Link>
    </div>
  );
};

export default Portfolio;
