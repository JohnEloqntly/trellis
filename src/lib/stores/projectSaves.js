import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { projectsStore } from './projects.js';

// Project-scoped saves store
function createProjectSavesStore() {
  // Initialize with example saves for demo
  const getInitialSaves = () => {
    if (!browser) return {
      competitions: {
        'project-agtech': [1, 2], // Agriculture grants
        'project-healthcare': [3, 4], // Healthcare grants
        'project-cleantech': [5, 6] // Clean energy grants
      },
      writers: {
        'project-agtech': [1, 3], // Writers specializing in AgTech
        'project-healthcare': [2, 4], // Writers specializing in Healthcare
        'project-cleantech': [1, 5] // Writers specializing in Clean Energy
      }
    };
    try {
      const stored = localStorage.getItem('trellisProjectSaves');
      if (stored) {
        return JSON.parse(stored);
      } else {
        // Return demo data if no stored data
        return {
          competitions: {
            'project-agtech': [1, 2],
            'project-healthcare': [3, 4], 
            'project-cleantech': [5, 6]
          },
          writers: {
            'project-agtech': [1, 3],
            'project-healthcare': [2, 4],
            'project-cleantech': [1, 5]
          }
        };
      }
    } catch {
      return {
        competitions: {
          'project-agtech': [1, 2],
          'project-healthcare': [3, 4],
          'project-cleantech': [5, 6]
        },
        writers: {
          'project-agtech': [1, 3],
          'project-healthcare': [2, 4],
          'project-cleantech': [1, 5]
        }
      };
    }
  };

  const saves = writable(getInitialSaves());

  // Save to localStorage when data changes
  if (browser) {
    saves.subscribe(value => {
      localStorage.setItem('trellisProjectSaves', JSON.stringify(value));
    });
  }

  // Derived stores for current project saves
  const currentProjectCompetitions = derived(
    [saves, projectsStore.activeProjectId],
    ([$saves, $activeProjectId]) => {
      return $saves.competitions[$activeProjectId] || [];
    }
  );

  const currentProjectWriters = derived(
    [saves, projectsStore.activeProjectId],
    ([$saves, $activeProjectId]) => {
      return $saves.writers[$activeProjectId] || [];
    }
  );

  return {
    saves,
    currentProjectCompetitions,
    currentProjectWriters,

    // Competition save actions
    saveCompetition: (competitionId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (!current.competitions[projectId]) {
          current.competitions[projectId] = [];
        }
        if (!current.competitions[projectId].includes(competitionId)) {
          current.competitions[projectId] = [...current.competitions[projectId], competitionId];
        }
        return current;
      });
    },

    unsaveCompetition: (competitionId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (current.competitions[projectId]) {
          current.competitions[projectId] = current.competitions[projectId].filter(id => id !== competitionId);
        }
        return current;
      });
    },

    isCompetitionSaved: (competitionId) => {
      const projectId = get(projectsStore.activeProjectId);
      const currentSaves = saves;
      return derived(currentSaves, $saves => {
        return $saves.competitions[projectId]?.includes(competitionId) || false;
      });
    },

    // Writer save actions
    saveWriter: (writerId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (!current.writers[projectId]) {
          current.writers[projectId] = [];
        }
        if (!current.writers[projectId].includes(writerId)) {
          current.writers[projectId] = [...current.writers[projectId], writerId];
        }
        return current;
      });
    },

    unsaveWriter: (writerId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (current.writers[projectId]) {
          current.writers[projectId] = current.writers[projectId].filter(id => id !== writerId);
        }
        return current;
      });
    },

    isWriterSaved: (writerId) => {
      const projectId = get(projectsStore.activeProjectId);
      const currentSaves = saves;
      return derived(currentSaves, $saves => {
        return $saves.writers[projectId]?.includes(writerId) || false;
      });
    },

    // Get saves for specific project
    getProjectCompetitions: (projectId) => {
      return derived(saves, $saves => $saves.competitions[projectId] || []);
    },

    getProjectWriters: (projectId) => {
      return derived(saves, $saves => $saves.writers[projectId] || []);
    },

    // Utility functions
    toggleCompetition: (competitionId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (!current.competitions[projectId]) {
          current.competitions[projectId] = [];
        }
        
        const projectSaves = current.competitions[projectId];
        if (projectSaves.includes(competitionId)) {
          current.competitions[projectId] = projectSaves.filter(id => id !== competitionId);
        } else {
          current.competitions[projectId] = [...projectSaves, competitionId];
        }
        return current;
      });
    },

    toggleWriter: (writerId) => {
      const projectId = get(projectsStore.activeProjectId);
      saves.update(current => {
        if (!current.writers[projectId]) {
          current.writers[projectId] = [];
        }
        
        const projectSaves = current.writers[projectId];
        if (projectSaves.includes(writerId)) {
          current.writers[projectId] = projectSaves.filter(id => id !== writerId);
        } else {
          current.writers[projectId] = [...projectSaves, writerId];
        }
        return current;
      });
    }
  };
}

export const projectSavesStore = createProjectSavesStore();
export const { 
  saves, 
  currentProjectCompetitions, 
  currentProjectWriters,
  saveCompetition,
  unsaveCompetition,
  isCompetitionSaved,
  saveWriter,
  unsaveWriter,
  isWriterSaved,
  getProjectCompetitions,
  getProjectWriters,
  toggleCompetition,
  toggleWriter
} = projectSavesStore;
