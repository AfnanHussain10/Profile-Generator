import React, { createContext, useContext, useState } from 'react';

// Remove type definitions
const initialData = {
  name: '',
  shortBio: '',
  aboutMe: '',
  profilePicture: '',
  skills: [],
  interests: '',
  projects: [],
  socialMedia: [],
  contactEmail: '',
};

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState(initialData);

  const updatePortfolioData = (data) => {
    setPortfolioData(prev => ({ ...prev, ...data }));
  };

  const addProject = (project) => {
    const newProject = { ...project, id: crypto.randomUUID() };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id, project) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, ...project } : p)),
    }));
  };

  const removeProject = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  const reorderProjects = (startIndex, endIndex) => {
    const projects = [...portfolioData.projects];
    const [removed] = projects.splice(startIndex, 1);
    projects.splice(endIndex, 0, removed);
    
    setPortfolioData(prev => ({
      ...prev,
      projects,
    }));
  };

  const addSocialMedia = (socialMedia) => {
    const newSocialMedia = { ...socialMedia, id: crypto.randomUUID() };
    setPortfolioData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, newSocialMedia],
    }));
  };

  const updateSocialMedia = (id, socialMedia) => {
    setPortfolioData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map(s => (s.id === id ? { ...s, ...socialMedia } : s)),
    }));
  };

  const removeSocialMedia = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter(s => s.id !== id),
    }));
  };

  const addSkill = (skill) => {
    const newSkill = { ...skill, id: crypto.randomUUID() };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const removeSkill = (id) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const resetPortfolio = () => {
    setPortfolioData(initialData);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        updatePortfolioData,
        addProject,
        updateProject,
        removeProject,
        reorderProjects,
        addSocialMedia,
        updateSocialMedia,
        removeSocialMedia,
        addSkill,
        removeSkill,
        resetPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
