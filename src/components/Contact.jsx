
import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      
      setIsSuccess(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <div className="h-1 w-12 bg-primary mx-auto mt-4 rounded-full"></div>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Have a question or want to work together? Feel free to contact me.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Your message"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-primary text-primary-foreground font-medium transition-all ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-primary/90'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-r-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              {isSuccess && (
                <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm animate-fade-in">
                  Thank you for your message! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border h-full">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {portfolioData.contactEmail && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                    <p className="text-foreground">{portfolioData.contactEmail}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Connect with me</h4>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {portfolioData.socialMedia.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md bg-secondary text-foreground/90 text-sm hover:bg-secondary/80 transition-colors"
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-muted-foreground text-sm">
                    I am currently {portfolioData.name ? 'available' : ''} for freelance work or full-time positions. 
                    Let's create something amazing together!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
