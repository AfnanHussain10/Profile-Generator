// Google Form Submission helper
export const submitToGoogleForm = async (formData) => {
  try {
    // Google Forms URL format with form ID
    const googleFormUrl = `https://docs.google.com/forms/u/0/d/e/1FAIpQLSdbKshYeMJzT9vK_f1-Kv5MgKsrx38r_PsScdFC96hrBVanBQ/formResponse`;
    
    // Entry IDs for each field in the Google Form
    const nameEntryId = 'entry.509883359';
    const emailEntryId = 'entry.1448404709'; 
    const messageEntryId = 'entry.1667764568'; 
    
    // Create form data for submission
    const formDataObj = new FormData();
    formDataObj.append(nameEntryId, formData.name);
    formDataObj.append(emailEntryId, formData.email);
    formDataObj.append(messageEntryId, formData.message);

    const response = await fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors', // This is important for Google Forms
      body: formDataObj
    });
    console.log('Form submitted:', formData);
    return { success: true, error: null };
    
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: 'Failed to submit form. Please try again later.' };
  }
};

export const fetchGitHubProjects = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    const projects = data.map((repo) => ({
      id: repo.id.toString(),
      title: repo.name,
      description: repo.description || 'No description available',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&auto=format&fit=crop', // Placeholder image
      githubLink: repo.html_url,
    }));
    
    return { data: projects, error: null };
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return { data: null, error: 'Failed to fetch GitHub projects. Please try again later.' };
  }
};

// Add the fetchPortfolioData function
export const fetchPortfolioData = async () => {
  try {

    const response = await fetch('/api/portfolio-data');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return { data: null, error: 'Failed to fetch portfolio data. Please try again later.' };
  }
};
