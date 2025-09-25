import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize projects with default project
function createProjectsStore() {
  // Example projects with different sectors/technologies for demo
  const exampleProjects = [
    {
      id: 'project-agtech',
      name: 'AI for Crop Yield Optimisation',
      description: 'Machine learning platform for precision agriculture and crop monitoring',
      sector: 'AgTech',
      technology: 'AI/ML',
      trl: 6,
      problemStatement: 'Farmers lack real-time insights for optimal crop management',
      solutionApproach: 'AI-powered sensors and predictive analytics for precision farming',
      createdAt: new Date().toISOString()
    },
    {
      id: 'project-healthcare',
      name: 'Digital Health Monitoring System',
      description: 'IoT-based remote patient monitoring with predictive health analytics',
      sector: 'Healthcare',
      technology: 'Digital Health & MedTech',
      trl: 4,
      problemStatement: 'Remote patient monitoring is inefficient and reactive',
      solutionApproach: 'Continuous monitoring with AI-driven early warning systems',
      createdAt: new Date().toISOString()
    },
    {
      id: 'project-cleantech',
      name: 'Smart Grid Energy Storage',
      description: 'Advanced battery management system for renewable energy storage',
      sector: 'Energy & Environment',
      technology: 'Clean Energy & Sustainability',
      trl: 7,
      problemStatement: 'Renewable energy storage is inefficient and costly',
      solutionApproach: 'Smart algorithms for optimal energy storage and distribution',
      createdAt: new Date().toISOString()
    }
  ];

  // Load from localStorage or use defaults
  const getInitialProjects = () => {
    if (!browser) return exampleProjects;
    try {
      const stored = localStorage.getItem('trellisProjects');
      return stored ? JSON.parse(stored) : exampleProjects;
    } catch {
      return exampleProjects;
    }
  };

  const getInitialActiveId = () => {
    if (!browser) return exampleProjects[0].id;
    try {
      const stored = localStorage.getItem('trellisActiveProjectId');
      return stored || exampleProjects[0].id;
    } catch {
      return exampleProjects[0].id;
    }
  };

  // Create stores
  const projects = writable(getInitialProjects());
  const activeProjectId = writable(getInitialActiveId());

  // Derived store for active project
  const activeProject = derived(
    [projects, activeProjectId],
    ([$projects, $activeProjectId]) => {
      return $projects.find(p => p.id === $activeProjectId) || $projects[0];
    }
  );

  // Save to localStorage when data changes
  if (browser) {
    projects.subscribe(value => {
      localStorage.setItem('trellisProjects', JSON.stringify(value));
    });

    activeProjectId.subscribe(value => {
      localStorage.setItem('trellisActiveProjectId', value);
    });
  }

  return {
    projects,
    activeProjectId,
    activeProject,
    
    // Actions
    createProject: (projectData) => {
      const newProject = {
        ...projectData,
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      projects.update(list => [...list, newProject]);
      activeProjectId.set(newProject.id); // Make new project active
      return newProject;
    },

    setActiveProject: (projectId) => {
      activeProjectId.set(projectId);
    },

    updateProject: (projectId, updates) => {
      projects.update(list => 
        list.map(p => p.id === projectId ? { ...p, ...updates } : p)
      );
    },

    deleteProject: (projectId) => {
      projects.update(list => {
        const filtered = list.filter(p => p.id !== projectId);
        // If deleting active project, switch to first available
        activeProjectId.update(activeId => {
          if (activeId === projectId && filtered.length > 0) {
            return filtered[0].id;
          }
          return activeId;
        });
        return filtered;
      });
    }
  };
}

export const projectsStore = createProjectsStore();
export const { projects, activeProjectId, activeProject, createProject, setActiveProject, updateProject, deleteProject } = projectsStore;
