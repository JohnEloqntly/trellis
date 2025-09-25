<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createProject } from '$lib/stores/projects.js';
  import { fade, scale } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let isOpen = false;

  let formData = {
    name: '',
    description: '',
    sector: '',
    technology: '',
    trl: 1,
    problemStatement: '',
    solutionApproach: ''
  };

  let isSubmitting = false;

  const sectors = [
    'Technology',
    'Healthcare',
    'Manufacturing',
    'Financial Services',
    'Defense & Security',
    'Energy & Environment',
    'AgTech',
    'Education',
    'Transportation',
    'Construction'
  ];

  const technologies = [
    'AI/ML',
    'Biotechnology & Life Sciences',
    'Clean Energy & Sustainability',
    'Robotics & Automation',
    'Advanced Materials',
    'Quantum Technology',
    'Blockchain & Distributed Systems',
    'IoT & Connected Devices',
    'Cybersecurity',
    'Space Technology'
  ];

  function closeDialog() {
    isOpen = false;
    dispatch('close');
    resetForm();
  }

  function resetForm() {
    formData = {
      name: '',
      description: '',
      sector: '',
      technology: '',
      trl: 1,
      problemStatement: '',
      solutionApproach: ''
    };
    isSubmitting = false;
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.name.trim() || !formData.sector || !formData.technology) {
      return;
    }

    isSubmitting = true;

    try {
      // Create the project
      const newProject = createProject(formData);
      
      // Close dialog and notify parent
      closeDialog();
      dispatch('project-created', newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      isSubmitting = false;
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 200 }}
  >
    <!-- Dialog -->
    <div 
      class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      transition:scale={{ duration: 300, start: 0.95 }}
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-gt-walsheim-bold text-gray-900">Create New Project</h2>
          <button 
            on:click={closeDialog}
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-1">Add a new project to organize your grant applications</p>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleSubmit} class="px-6 py-6 space-y-6">
        <!-- Project Name -->
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            id="projectName"
            type="text"
            bind:value={formData.name}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            placeholder="e.g., AI-Powered Crop Monitoring System"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            placeholder="Brief description of your project..."
          ></textarea>
        </div>

        <!-- Sector and Technology -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="sector" class="block text-sm font-medium text-gray-700 mb-2">
              Sector *
            </label>
            <select
              id="sector"
              bind:value={formData.sector}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select sector</option>
              {#each sectors as sector}
                <option value={sector}>{sector}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="technology" class="block text-sm font-medium text-gray-700 mb-2">
              Technology *
            </label>
            <select
              id="technology"
              bind:value={formData.technology}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select technology</option>
              {#each technologies as technology}
                <option value={technology}>{technology}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- TRL Level -->
        <div>
          <label for="trl" class="block text-sm font-medium text-gray-700 mb-2">
            Technology Readiness Level (TRL)
          </label>
          <div class="flex items-center space-x-4">
            <input
              id="trl"
              type="range"
              min="1"
              max="9"
              bind:value={formData.trl}
              class="flex-1"
            />
            <span class="font-medium text-primary-blue w-8">TRL {formData.trl}</span>
          </div>
        </div>

        <!-- Problem Statement -->
        <div>
          <label for="problemStatement" class="block text-sm font-medium text-gray-700 mb-2">
            Problem Statement
          </label>
          <textarea
            id="problemStatement"
            bind:value={formData.problemStatement}
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            placeholder="What problem does this project solve?"
          ></textarea>
        </div>

        <!-- Solution Approach -->
        <div>
          <label for="solutionApproach" class="block text-sm font-medium text-gray-700 mb-2">
            Solution Approach
          </label>
          <textarea
            id="solutionApproach"
            bind:value={formData.solutionApproach}
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            placeholder="How will you solve this problem?"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            on:click={closeDialog}
            class="px-6 py-3 border border-gray-300 text-gray-700 font-gt-walsheim-bold rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.sector || !formData.technology}
            class="px-6 py-3 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
