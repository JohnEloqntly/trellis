import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { projectsStore } from './projects.js';

// Project-scoped saves store
function createProjectSavesStore() {
  // Initialize with clean slate for demo
  const getInitialSaves = () => {
    if (!browser) return {
      competitions: {},
      writers: {}
    };
    
    // Clear any old cached data to prevent conflicts
    localStorage.removeItem('trellisProjectSaves');
    localStorage.removeItem('savedCompetitions');
    localStorage.removeItem('savedWriters');
    
    return {
      competitions: {},
      writers: {}
    };
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
