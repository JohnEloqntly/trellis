<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createProject, updateProject } from '$lib/stores/projects.js';
  import { fade, scale } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  export let editingProject = null; // Pass existing project data for editing

  let formData = {
    name: '',
    description: '',
    sector: '',
    technology: '',
    trl: 1,
    problemStatement: '',
    solutionApproach: '',
    crossSectors: [],
    marketSize: '',
    commercialValidation: ''
  };

  let isSubmitting = false;

  // Pre-fill form when editing
  $: if (editingProject) {
    formData = {
      name: editingProject.name || '',
      description: editingProject.description || '',
      sector: editingProject.sector || '',
      technology: editingProject.technology || '',
      trl: editingProject.trl || 1,
      problemStatement: editingProject.problemStatement || '',
      solutionApproach: editingProject.solutionApproach || '',
      crossSectors: editingProject.crossSectors || [],
      marketSize: editingProject.marketSize || '',
      commercialValidation: editingProject.commercialValidation || ''
    };
  }

  const sectors = [
    'Healthcare & Life Sciences',
    'Technology & Software',
    'Energy & Environment',
    'Manufacturing & Industrial',
    'Financial Services',
    'Education & Training',
    'Agriculture & Food',
    'Transportation & Logistics',
    'Creative & Media',
    'Social Impact & Non-profit',
    'Defense & Security',
    'Aerospace',
    'Other'
  ];

  const technologies = [
    'Artificial Intelligence & Machine Learning',
    'Biotechnology & Life Sciences',
    'Clean Energy & Sustainability',
    'Digital Health & MedTech',
    'Financial Technology (FinTech)',
    'Advanced Manufacturing',
    'Robotics & Automation',
    'Quantum Computing',
    'Cybersecurity',
    'Space Technology',
    'Materials Science',
    'Internet of Things (IoT)',
    'Blockchain & Distributed Ledger',
    'Augmented/Virtual Reality',
    'Other'
  ];

  // Cross-sector options (all sectors except the selected one)
  $: crossSectorOptions = sectors.filter(s => s !== formData.sector);

  const marketSizeOptions = [
    'Tens of customers',
    'Hundreds of customers',
    'Thousands of customers',
    'Tens of thousands of customers',
    'Hundreds of thousands of customers',
    'Millions of customers',
    'Not sure yet'
  ];

  const validationOptions = [
    'No validation yet - just an idea',
    'Some initial research/surveys',
    'Prototype tested with users',
    'Pilot customers or partners',
    'Paying customers',
    'Market traction with revenue',
    'Proven business model'
  ];

  // TRL descriptions
  const trlDescriptions = {
    1: "Basic principles observed - Scientific research begins",
    2: "Technology concept formulated - Practical application is identified",
    3: "Experimental proof of concept - Active R&D is initiated",
    4: "Technology validated in lab - Basic components are integrated",
    5: "Technology validated in relevant environment - Large scale components integrated",
    6: "Technology demonstrated in relevant environment - Representative model tested",
    7: "System prototype demonstration - Demonstration in operational environment",
    8: "System complete and qualified - Technology proven to work",
    9: "Actual system proven in operational environment - Ready for deployment"
  };

  // Get TRL description safely
  function getTrlDescription(trl) {
    return trlDescriptions[trl] || "Unknown TRL level";
  }

  // Handle cross-sector checkbox changes
  function handleCrossSectorChange(sector, checked) {
    if (checked) {
      formData.crossSectors = [...formData.crossSectors, sector];
    } else {
      formData.crossSectors = formData.crossSectors.filter(s => s !== sector);
    }
  }

  // Enhanced TRL slider changes with ultra-smooth updates
  function handleTrlChange(event) {
    const newValue = parseInt(event.target.value);
    if (newValue !== formData.trl) {
      formData.trl = newValue;
      // Force immediate reactivity for smooth UI updates
      formData = { ...formData };
      
      // Add haptic feedback on supported devices
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }

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
      solutionApproach: '',
      crossSectors: [],
      marketSize: '',
      commercialValidation: ''
    };
    isSubmitting = false;
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.name.trim() || !formData.sector || !formData.technology || 
        !formData.problemStatement.trim() || !formData.solutionApproach.trim() ||
        !formData.marketSize || !formData.commercialValidation || 
        formData.crossSectors.length === 0) {
      return;
    }

    isSubmitting = true;

    try {
      if (editingProject) {
        // Update existing project
        updateProject(editingProject.id, formData);
        dispatch('project-updated', editingProject);
      } else {
        // Create new project
        const newProject = createProject(formData);
        dispatch('project-created', newProject);
      }
      
      // Close dialog
      closeDialog();
    } catch (error) {
      console.error('Error saving project:', error);
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

<style>
  /* Enhanced TRL slider styles for ultra-smooth interaction */
  .trl-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 6px;
    outline: none;
    background: #E5E7EB;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
  }

  .trl-slider:hover {
    background: #D1D5DB;
  }

  .trl-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    cursor: grab;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
  }

  .trl-slider::-webkit-slider-thumb:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: grab;
  }

  .trl-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.12);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5), 0 4px 16px rgba(0, 0, 0, 0.2);
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .trl-slider::-moz-range-thumb {
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    cursor: grab;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    -moz-appearance: none;
  }

  .trl-slider::-moz-range-thumb:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .trl-slider::-moz-range-thumb:active {
    cursor: grabbing;
    transform: scale(1.12);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5), 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .trl-slider:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .trl-slider:focus::-webkit-slider-thumb {
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  /* Enhanced track styling */
  .trl-slider::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 6px;
    background: transparent;
  }

  .trl-slider::-moz-range-track {
    height: 12px;
    border-radius: 6px;
    background: transparent;
    border: none;
  }

  /* Add discrete step indicators */
  .trl-track-container {
    position: relative;
    width: 100%;
  }

  .trl-step-indicators {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    pointer-events: none;
    transform: translateY(-50%);
  }

  .trl-step {
    position: absolute;
    width: 2px;
    height: 8px;
    background: #9CA3AF;
    border-radius: 1px;
    top: -3px;
    transition: all 0.2s ease;
  }
</style>

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
          <h2 class="text-2xl font-gt-walsheim-bold text-gray-900">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button 
            on:click={closeDialog}
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-1">
          {editingProject ? 'Update your project information' : 'Add a new project to organize your grant applications'}
        </p>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleSubmit} class="px-6 py-6 space-y-6">
        <!-- Project Name -->
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            What is the name of your project? *
          </label>
          <input
            id="projectName"
            type="text"
            bind:value={formData.name}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
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
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
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
              What technology are you leveraging? *
            </label>
            <select
              id="technology"
              bind:value={formData.technology}
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              required
            >
              <option value="">Select technology</option>
              {#each technologies as technology}
                <option value={technology}>{technology}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Cross-sector Benefits -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            What other sectors outside your own benefit? *
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each crossSectorOptions as sector}
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.crossSectors.includes(sector)}
                  on:change={(e) => handleCrossSectorChange(sector, e.target.checked)}
                  class="rounded border-gray-300 text-primary-blue focus:ring-primary-blue focus:ring-2"
                />
                <span class="text-sm text-gray-700">{sector}</span>
              </label>
            {/each}
          </div>
        </div>

        <!-- Market Size -->
        <div>
          <label for="marketSize" class="block text-sm font-medium text-gray-700 mb-2">
            What size is the market you're targeting? *
          </label>
          <select
            id="marketSize"
            bind:value={formData.marketSize}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
            required
          >
            <option value="">Select market size</option>
            {#each marketSizeOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </div>

        <!-- Commercial Validation -->
        <div>
          <label for="commercialValidation" class="block text-sm font-medium text-gray-700 mb-2">
            How much commercial validation do you have? *
          </label>
          <select
            id="commercialValidation"
            bind:value={formData.commercialValidation}
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
            required
          >
            <option value="">Select validation level</option>
            {#each validationOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </div>

        <!-- TRL Level with Enhanced UX -->
        <div>
          <label for="trl" class="block text-sm font-medium text-gray-700 mb-2">
            What is your TRL level? *
          </label>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <!-- TRL Slider -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">TRL 1</span>
                <span class="font-medium text-primary-blue bg-blue-50 px-2 py-1 rounded-lg">TRL {formData.trl}</span>
                <span class="text-sm text-gray-600">TRL 9</span>
              </div>
              <div class="relative py-3">
                <div class="trl-track-container">
                  <!-- Step indicators -->
                  <div class="trl-step-indicators">
                    {#each Array(9) as _, i}
                      <div 
                        class="trl-step" 
                        style="left: {(i / 8) * 100}%; background: {i + 1 <= formData.trl ? '#3B82F6' : '#9CA3AF'}"
                      ></div>
                    {/each}
                  </div>
                  
                  <!-- Enhanced TRL Slider -->
                  <input
                    id="trl"
                    type="range"
                    min="1"
                    max="9"
                    step="1"
                    bind:value={formData.trl}
                    on:input={handleTrlChange}
                    on:mousedown={() => formData = {...formData}}
                    on:touchstart={() => formData = {...formData}}
                    class="w-full trl-slider"
                    style="background: linear-gradient(to right, #3B82F6 0%, #3B82F6 {((formData.trl - 1) / 8) * 100}%, #E5E7EB {((formData.trl - 1) / 8) * 100}%, #E5E7EB 100%)"
                    aria-label="Technology Readiness Level from 1 to 9"
                    aria-valuemin="1"
                    aria-valuemax="9"
                    aria-valuenow="{formData.trl}"
                    tabindex="0"
                  />
                </div>
                
                <!-- Enhanced instruction with visual cues -->
                <div class="flex items-center justify-center mt-3 space-x-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <p class="text-xs text-gray-500 text-center">Drag the slider or click any point to adjust TRL level smoothly</p>
                </div>
              </div>
            </div>
            
            <!-- TRL Description -->
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <p class="text-sm text-gray-700 font-medium mb-1">TRL {formData.trl}: Current Stage</p>
              <p class="text-sm text-gray-600">{getTrlDescription(formData.trl)}</p>
            </div>
          </div>
        </div>

        <!-- Problem Statement -->
        <div>
          <label for="problemStatement" class="block text-sm font-medium text-gray-700 mb-2">
            What problem are you solving? *
          </label>
          <textarea
            id="problemStatement"
            bind:value={formData.problemStatement}
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
            placeholder="Describe the problem your project addresses..."
            required
          ></textarea>
        </div>

        <!-- Solution Approach -->
        <div>
          <label for="solutionApproach" class="block text-sm font-medium text-gray-700 mb-2">
            What's the solution? *
          </label>
          <textarea
            id="solutionApproach"
            bind:value={formData.solutionApproach}
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
            placeholder="Describe your solution approach..."
            required
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
            disabled={isSubmitting || !formData.name.trim() || !formData.sector || !formData.technology || 
                     !formData.problemStatement.trim() || !formData.solutionApproach.trim() ||
                     !formData.marketSize || !formData.commercialValidation || 
                     formData.crossSectors.length === 0}
            class="px-6 py-3 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              {editingProject ? 'Updating...' : 'Creating...'}
            {:else}
              {editingProject ? 'Update Project' : 'Create Project'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
