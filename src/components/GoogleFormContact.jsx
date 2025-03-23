
import { useState, useEffect } from 'react';
import { submitToGoogleForm } from '@/lib/api';
import { toast } from 'sonner';
import { Send, RefreshCw } from 'lucide-react';

const GoogleFormContact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Reset submission status after showing success message
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await submitToGoogleForm(formData);
      
      if (!success) {
        throw new Error(error || 'Failed to submit form');
      }
      
      // Reset form and show success message
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {isSubmitted ? (
        <div className="text-center py-12 px-4 animate-fade-in">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Send className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for your message. I'll get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 p-8 border border-border rounded-lg bg-card animate-fade-in"
        >
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
              className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Your name"
              required
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
              className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="your.email@example.com"
              required
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
              rows={4}
              className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Your message here..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            This form is connected to Google Forms for message submission.
          </p>
        </form>
      )}
    </div>
  );
};

export default GoogleFormContact;
