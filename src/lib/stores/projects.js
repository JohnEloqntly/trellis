import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize projects with default project
function createProjectsStore() {
  // Default project data
  const defaultProject = {
    id: 'default-project',
    name: 'AI-Powered Analytics Platform',
    description: 'Machine learning platform for real-time data analytics',
    sector: 'Technology',
    technology: 'AI/ML',
    trl: 5,
    problemStatement: 'Data analytics is too slow and reactive',
    solutionApproach: 'Real-time ML processing with predictive insights',
    createdAt: new Date().toISOString()
  };

  // Load from localStorage or use defaults
  const getInitialProjects = () => {
    if (!browser) return [defaultProject];
    try {
      const stored = localStorage.getItem('trellisProjects');
      return stored ? JSON.parse(stored) : [defaultProject];
    } catch {
      return [defaultProject];
    }
  };

  const getInitialActiveId = () => {
    if (!browser) return defaultProject.id;
    try {
      const stored = localStorage.getItem('trellisActiveProjectId');
      return stored || defaultProject.id;
    } catch {
      return defaultProject.id;
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
