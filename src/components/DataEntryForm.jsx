import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { X, Plus, Upload, Check, RefreshCw, Github } from 'lucide-react';
import { fetchGitHubProjects } from '@/lib/api';
import { Button } from '@/components/ui/button';

const DataEntryForm = () => {
  const navigate = useNavigate();
  const { 
    portfolioData, 
    updatePortfolioData, 
    addSocialMedia, 
    removeSocialMedia, 
    addProject, 
    removeProject,
    addSkill,
    removeSkill,
    resetPortfolio
  } = usePortfolio();
  
  const [newSocial, setNewSocial] = useState({ name: '', url: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    githubLink: ''
  });
  const [currentSection, setCurrentSection] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);

  const handleLoadDemoData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchPortfolioData();
      
      if (error || !data) {
        toast.error(error || 'Failed to load demo data');
        return;
      }
      
      resetPortfolio();
      updatePortfolioData(data);
      toast.success('Demo data loaded successfully');
    } catch (err) {
      toast.error('An error occurred while loading demo data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadGithubProjects = async () => {
    if (!githubUsername.trim()) {
      toast.error('Please enter a GitHub username');
      return;
    }
    
    setIsLoadingGithub(true);
    try {
      const { data, error } = await fetchGitHubProjects(githubUsername);
      
      if (error || !data) {
        toast.error(error || 'Failed to load GitHub projects');
        return;
      }
      
      portfolioData.projects.forEach(project => {
        removeProject(project.id);
      });
      
      data.forEach(project => {
        addProject(project);
      });
      
      toast.success(`Loaded ${data.length} projects from GitHub`);
    } catch (err) {
      toast.error('An error occurred while loading GitHub projects');
      console.error(err);
    } finally {
      setIsLoadingGithub(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    updatePortfolioData({ [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      updatePortfolioData({ profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setNewSocial(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSocialMedia = () => {
    if (!newSocial.name || !newSocial.url) {
      toast.error('Please provide both name and URL');
      return;
    }
    
    if (!newSocial.url.startsWith('http')) {
      toast.error('URL must start with http:// or https://');
      return;
    }
    
    addSocialMedia(newSocial);
    setNewSocial({ name: '', url: '' });
    toast.success('Social media added');
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a skill');
      return;
    }
    
    addSkill({ name: newSkill.trim() });
    setNewSkill('');
    toast.success('Skill added');
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setNewProject(prev => ({ ...prev, image: reader.result}));
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Project title and description are required');
      return;
    }
    
    if (newProject.githubLink && !newProject.githubLink.startsWith('http')) {
      toast.error('GitHub link must start with http:// or https://');
      return;
    }
    
    addProject(newProject);
    setNewProject({
      title: '',
      description: '',
      image: '',
      githubLink: ''
    });
    toast.success('Project added');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!portfolioData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!portfolioData.shortBio.trim()) {
      newErrors.shortBio = 'Short bio is required';
    }
    
    if (portfolioData.projects.length === 0) {
      newErrors.projects = 'At least one project is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Portfolio generated successfully!');
    navigate('/portfolio');
  };

  const renderDataSourceSelection = () => (
    <div className="mb-6 bg-muted/30 rounded-lg p-4 border border-border">
      <h3 className="text-sm font-medium mb-3">GitHub Project Integration</h3>
      
      <p className="text-xs text-muted-foreground mb-3">
        Import your projects directly from GitHub by entering your username below.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="GitHub username"
          className="flex-1 px-3 py-1.5 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <Button 
          onClick={handleLoadGithubProjects}
          disabled={isLoadingGithub || !githubUsername.trim()}
          variant="outline"
          size="sm"
        >
          {isLoadingGithub ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        This will fetch your public repositories and import them as portfolio projects.
      </p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold">Create Your Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to generate your personalized portfolio.
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderDataSourceSelection()}
            
            <div className="flex border-b border-border mb-6">
              <button
                type="button"
                onClick={() => setCurrentSection('basic')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  currentSection === 'basic' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection('aboutMe')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  currentSection === 'aboutMe' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About Me
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection('projects')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  currentSection === 'projects' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection('social')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  currentSection === 'social' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Social & Contact
              </button>
            </div>
            
            {/* Basic Info Section */}
            {currentSection === 'basic' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={portfolioData.name}
                    onChange={handleBasicInfoChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.name ? 'border-destructive' : 'border-input'
                    } bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="shortBio" className="block text-sm font-medium mb-1">
                    Short Bio <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="shortBio"
                    name="shortBio"
                    value={portfolioData.shortBio}
                    onChange={handleBasicInfoChange}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-md border ${
                      errors.shortBio ? 'border-destructive' : 'border-input'
                    } bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none`}
                    placeholder="A brief introduction about yourself (1-2 sentences)"
                  />
                  {errors.shortBio && (
                    <p className="mt-1 text-sm text-destructive">{errors.shortBio}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={portfolioData.contactEmail}
                    onChange={handleBasicInfoChange}
                    className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="yourname@example.com"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentSection('aboutMe')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Next: About Me
                  </button>
                </div>
              </div>
            )}
            
            {/* About Me Section */}
            {currentSection === 'aboutMe' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium mb-1">
                    Profile Picture
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="w-24 h-24 rounded-md border border-input overflow-hidden bg-muted flex items-center justify-center">
                      {portfolioData.profilePicture ? (
                        <img 
                          src={portfolioData.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs text-center">
                          No image selected
                        </span>
                      )}
                    </div>
                    <label 
                      htmlFor="profile-upload"
                      className="ml-4 px-3 py-1.5 bg-secondary text-foreground rounded-md text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
                    >
                      <Upload size={14} />
                      <span>Upload</span>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: Square image, max 2MB
                  </p>
                </div>
                
                <div>
                  <label htmlFor="aboutMe" className="block text-sm font-medium mb-1">
                    About Me Description
                  </label>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    value={portfolioData.aboutMe}
                    onChange={handleBasicInfoChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell your story, including your background, experience, and what drives you"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {portfolioData.skills.map((skill) => (
                      <div 
                        key={skill.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-foreground text-sm"
                      >
                        <span>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-1.5 bg-secondary text-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium mb-1">
                    Interests
                  </label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    value={portfolioData.interests}
                    onChange={handleBasicInfoChange}
                    className="w-full px-4 py-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your hobbies and interests, separated by commas"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection('basic')}
                    className="px-4 py-2 bg-secondary text-foreground rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection('projects')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Next: Projects
                  </button>
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {currentSection === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Your Projects</h3>
                    {errors.projects && (
                      <p className="text-sm text-destructive">{errors.projects}</p>
                    )}
                  </div>
                  
                  {portfolioData.projects.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {portfolioData.projects.map((project) => (
                        <div 
                          key={project.id}
                          className="flex items-start gap-3 p-3 border border-border rounded-md bg-card"
                        >
                          <div 
                            className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0"
                          >
                            {project.image ? (
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{project.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {project.description}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeProject(project.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove project"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-dashed border-border rounded-md bg-muted/30 mb-6">
                      <p className="text-muted-foreground">No projects added yet.</p>
                    </div>
                  )}
                  
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                    <h4 className="text-sm font-medium mb-3">Add New Project</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="projectTitle" className="block text-xs font-medium mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          id="projectTitle"
                          name="title"
                          value={newProject.title}
                          onChange={handleProjectChange}
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="Enter project title"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="projectDescription" className="block text-xs font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id="projectDescription"
                          name="description"
                          value={newProject.description}
                          onChange={handleProjectChange}
                          rows={3}
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                          placeholder="Brief description of your project"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="projectImage" className="block text-xs font-medium mb-1">
                            Project Image
                          </label>
                          <div className="flex items-center">
                            <label 
                              htmlFor="project-image-upload"
                              className="px-3 py-1.5 bg-secondary text-foreground rounded-md text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
                            >
                              <Upload size={14} />
                              <span>Upload Image</span>
                              <input
                                id="project-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleProjectImageChange}
                                className="sr-only"
                              />
                            </label>
                            
                            {newProject.image && (
                              <button
                                type="button"
                                onClick={() => setNewProject(prev => ({ ...prev, image: '' }))}
                                className="ml-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          
                          {newProject.image && (
                            <div className="mt-2 w-full h-16 rounded overflow-hidden bg-muted">
                              <img 
                                src={newProject.image} 
                                alt="Project preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="projectGithub" className="block text-xs font-medium mb-1">
                            GitHub Link
                          </label>
                          <input
                            type="url"
                            id="projectGithub"
                            name="githubLink"
                            value={newProject.githubLink}
                            onChange={handleProjectChange}
                            className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="https://github.com/yourusername/project"
                          />
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus size={16} />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection('aboutMe')}
                    className="px-4 py-2 bg-secondary text-foreground rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection('social')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Next: Social Media
                  </button>
                </div>
              </div>
            )}
            
            {/* Social Media Section */}
            {currentSection === 'social' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-medium mb-3">Social Media Links</h3>
                  
                  {portfolioData.socialMedia.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {portfolioData.socialMedia.map((social) => (
                        <div 
                          key={social.id}
                          className="flex items-center justify-between p-3 border border-border rounded-md bg-card"
                        >
                          <div>
                            <p className="font-medium">{social.name}</p>
                            <a 
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {social.url}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSocialMedia(social.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove social media"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-border rounded-md bg-muted/30 mb-4">
                      <p className="text-muted-foreground">No social media links added yet.</p>
                    </div>
                  )}
                  
                  <div className="border border-border rounded-md p-4 bg-muted/20">
                    <h4 className="text-sm font-medium mb-3">Add Social Media</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="socialName" className="block text-xs font-medium mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          id="socialName"
                          name="name"
                          value={newSocial.name}
                          onChange={handleSocialMediaChange}
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="e.g. LinkedIn, GitHub, Twitter"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="socialUrl" className="block text-xs font-medium mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          id="socialUrl"
                          name="url"
                          value={newSocial.url}
                          onChange={handleSocialMediaChange}
                          className="w-full px-3 py-1.5 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddSocialMedia}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus size={16} />
                        <span>Add Social Media</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection('projects')}
                    className="px-4 py-2 bg-secondary text-foreground rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    <span>Generate Portfolio</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataEntryForm;
