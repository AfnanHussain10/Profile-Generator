import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { toast } from 'sonner';
import { submitToGoogleForm } from '@/lib/api';
import { Send, Mail, Users } from 'lucide-react';

// Create a custom hook for form logic to separate concerns
const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSuccess: false,
    errors: {
      name: '',
      email: '',
      message: '',
    },
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      message: '',
    };

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFormState(prev => ({ ...prev, errors }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: '',
        },
      }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setFormState(prev => ({
      ...prev,
      errors: { name: '', email: '', message: '' },
    }));
  };

  return {
    formData,
    formState,
    setFormState,
    handleChange,
    validateForm,
    resetForm,
  };
};

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const {
    formData,
    formState,
    setFormState,
    handleChange,
    validateForm,
    resetForm,
  } = useContactForm();

  // Reset success message after delay
  useEffect(() => {
    if (formState.isSuccess) {
      const timer = setTimeout(() => {
        setFormState(prev => ({ ...prev, isSuccess: false }));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [formState.isSuccess, setFormState]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const { success, error } = await submitToGoogleForm(formData);
      
      if (!success) {
        throw new Error(error || 'Failed to submit form');
      }
      
      // Reset form and show success message
      resetForm();
      setFormState(prev => ({ 
        ...prev, 
        isSuccess: true,
        isSubmitting: false 
      }));
      toast.success('Message sent successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Extract availability text
  const availabilityText = portfolioData.name 
    ? 'I am currently available for freelance work or full-time positions.'
    : 'I am currently accepting new opportunities.';

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
            <form onSubmit={handleSubmit} className="space-y-6" id="contactForm" aria-label="Contact form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!formState.errors.name}
                    aria-describedby={formState.errors.name ? "name-error" : undefined}
                    className={`w-full pl-10 pr-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      formState.errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-input'
                    }`}
                    placeholder="Your name"
                  />
                  <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                {formState.errors.name && (
                  <p id="name-error" className="text-red-500 text-xs mt-1">{formState.errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!formState.errors.email}
                    aria-describedby={formState.errors.email ? "email-error" : undefined}
                    className={`w-full pl-10 pr-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      formState.errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-input'
                    }`}
                    placeholder="Your email"
                  />
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                {formState.errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">{formState.errors.email}</p>
                )}
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
                  aria-required="true"
                  aria-invalid={!!formState.errors.message}
                  aria-describedby={formState.errors.message ? "message-error" : undefined}
                  rows={5}
                  className={`w-full px-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                    formState.errors.message ? 'border-red-500 focus:ring-red-500/50' : 'border-input'
                  }`}
                  placeholder="Your message"
                />
                {formState.errors.message && (
                  <p id="message-error" className="text-red-500 text-xs mt-1">{formState.errors.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-primary text-primary-foreground font-medium transition-all ${
                  formState.isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2'
                }`}
              >
                {formState.isSubmitting ? (
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
              
              {formState.isSuccess && (
                <div role="alert" className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm animate-fade-in">
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
                    <a 
                      href={`mailto:${portfolioData.contactEmail}`} 
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {portfolioData.contactEmail}
                    </a>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Connect with me</h4>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {portfolioData.socialMedia?.length > 0 ? (
                      portfolioData.socialMedia.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit my ${social.name} profile`}
                          className="px-3 py-1.5 rounded-md bg-secondary text-foreground/90 text-sm hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          {social.name}
                        </a>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Social media links coming soon</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-muted-foreground text-sm">
                    {availabilityText} Let's create something amazing together!
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