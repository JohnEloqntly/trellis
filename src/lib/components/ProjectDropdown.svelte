<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { activeProject, projects, setActiveProject } from '$lib/stores/projects.js';
  import { fade, slide } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  
  let showDropdown = false;
  
  $: currentActiveProject = $activeProject;
  $: allProjects = $projects;

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function selectProject(projectId: string) {
    setActiveProject(projectId);
    showDropdown = false;
  }

  function openNewProjectDialog() {
    dispatch('new-project');
    showDropdown = false;
  }

  function closeDropdown() {
    showDropdown = false;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.project-dropdown-container')) {
      showDropdown = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="project-dropdown-container relative">
  <!-- Project Selector Button -->
  <button 
    on:click={toggleDropdown}
    class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 bg-white shadow-sm"
    title="Switch project"
  >
    <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
    <span class="font-medium text-gray-900 max-w-48 truncate">
      {currentActiveProject?.name || 'Select Project'}
    </span>
    <svg class="w-4 h-4 text-gray-500 transition-transform duration-200" class:rotate-180={showDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>

  <!-- Dropdown Menu -->
  {#if showDropdown}
    <div 
      class="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
      transition:slide={{ duration: 200 }}
    >
      <!-- Header -->
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 class="font-gt-walsheim-bold text-gray-900">Switch Project</h3>
        <p class="text-sm text-gray-600">Select a project to switch context</p>
      </div>

      <!-- Projects List -->
      <div class="max-h-64 overflow-y-auto">
        {#each allProjects as project}
          <button
            on:click={() => selectProject(project.id)}
            class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
            class:bg-blue-50={project.id === currentActiveProject?.id}
            class:border-blue-200={project.id === currentActiveProject?.id}
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full flex-shrink-0" class:bg-emerald-500={project.id === currentActiveProject?.id} class:bg-gray-300={project.id !== currentActiveProject?.id}></div>
                  <h4 class="font-medium truncate" class:text-gray-900={project.id === currentActiveProject?.id} class:text-gray-500={project.id !== currentActiveProject?.id}>{project.name}</h4>
                  {#if project.id === currentActiveProject?.id}
                    <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  {/if}
                </div>
                <p class="text-sm mt-1 truncate" class:text-gray-600={project.id === currentActiveProject?.id} class:text-gray-400={project.id !== currentActiveProject?.id}>{project.description}</p>
                <div class="flex items-center space-x-3 mt-2 text-xs" class:text-gray-500={project.id === currentActiveProject?.id} class:text-gray-400={project.id !== currentActiveProject?.id}>
                  <span>{project.sector}</span>
                  <span>•</span>
                  <span>{project.technology}</span>
                  <span>•</span>
                  <span>TRL {project.trl}</span>
                </div>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <!-- New Project Button -->
      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          on:click={openNewProjectDialog}
          class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold rounded-lg hover:shadow-md transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>New Project</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.project-dropdown-container) {
    position: relative;
  }
</style>
