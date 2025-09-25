<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  import { projects, activeProjectId, setActiveProject, updateProject } from '$lib/stores/projects.js';
  import NewProjectDialog from '$lib/components/NewProjectDialog.svelte';
  
  let mounted = false;
  let activeSection = 'projects';
  let sidebarExpanded = true;
  let showNewProjectDialog = false;
  let editingProject = null;
  let showEditDialog = false;

  // Get all projects from store
  $: allProjects = $projects;
  $: currentActiveProjectId = $activeProjectId;

  // Mock grant matching stats for each project
  const projectStats = {
    'project-agtech': { grants: 8, highMatches: 3, totalValue: '£1.2M' },
    'project-healthcare': { grants: 12, highMatches: 5, totalValue: '£2.8M' },
    'project-cleantech': { grants: 15, highMatches: 4, totalValue: '£4.1M' }
  };
  
  // Handle section change from sidebar
  function handleSectionChange(section: string) {
    if (section === 'matches') window.location.href = '/portal';
    else if (section === 'competitions') window.location.href = '/portal#competitions';
    else if (section === 'saved-competitions') window.location.href = '/portal#saved-competitions';
    else if (section === 'saved-writers') window.location.href = '/portal#saved-writers';
  }
  
  function openNewProjectDialog() {
    showNewProjectDialog = true;
  }

  function closeNewProjectDialog() {
    showNewProjectDialog = false;
  }

  function openEditDialog(project) {
    editingProject = project;
    showEditDialog = true;
  }

  function closeEditDialog() {
    editingProject = null;
    showEditDialog = false;
  }

  function makeProjectActive(projectId) {
    setActiveProject(projectId);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function runGrantMatch(project) {
    // Set this project as active and navigate to matches
    setActiveProject(project.id);
    window.location.href = '/portal';
  }

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Projects - Trellis</title>
  <meta name="description" content="Manage your innovation projects and run grant matches" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  {#if mounted}
    <!-- Top App Bar (behind sidebar) -->
    <TopAppBar {sidebarExpanded} />
    
    <div class="flex h-screen">
      <!-- Sidebar Component -->
      <Sidebar 
        bind:expanded={sidebarExpanded} 
        {activeSection} 
        onSectionChange={handleSectionChange}
      />

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="p-8 pt-24">
          <!-- Section Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-2">Your Projects</h2>
            <p class="text-gray-600">Manage your innovation projects and track grant matching results</p>
          </div>

          <!-- Content -->
          <div class="space-y-8" in:fade={{ duration: 300 }}>
            <!-- Projects Management -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-gt-walsheim-bold text-gray-900">Your Projects</h3>
                <button 
                  on:click={openNewProjectDialog}
                  class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-gt-walsheim-bold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Add New Project
                </button>
              </div>
              
              <div class="space-y-4">
                {#each allProjects as project}
                  <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300" class:ring-2={project.id === currentActiveProjectId} class:ring-blue-500={project.id === currentActiveProjectId} class:bg-blue-50={project.id === currentActiveProjectId}>
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                          <h4 class="text-lg font-gt-walsheim-bold text-gray-900">{project.name}</h4>
                          {#if project.id === currentActiveProjectId}
                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">Active</span>
                          {/if}
                        </div>
                        <p class="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{project.sector}</span>
                          <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{project.technology}</span>
                          <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">TRL {project.trl}</span>
                        </div>
                        <div class="text-xs text-gray-500">
                          Created: {formatDate(project.createdAt)}
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        {#if project.id !== currentActiveProjectId}
                          <button 
                            on:click={() => makeProjectActive(project.id)}
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                          >
                            Make Active
                          </button>
                        {/if}
                        <button 
                          on:click={() => runGrantMatch(project)}
                          class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200"
                        >
                          Run Grant Match
                        </button>
                        <button 
                          on:click={() => openEditDialog(project)}
                          class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    <!-- Grant Matching Results -->
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h5 class="font-medium text-gray-900 mb-3">Latest Grant Match Results</h5>
                      <div class="grid grid-cols-3 gap-4 text-sm">
                        <div class="text-center">
                          <div class="text-lg font-gt-walsheim-bold text-emerald-600">{projectStats[project.id]?.grants || 0}</div>
                          <div class="text-gray-600">Grants Found</div>
                        </div>
                        <div class="text-center">
                          <div class="text-lg font-gt-walsheim-bold text-primary-blue">{projectStats[project.id]?.highMatches || 0}</div>
                          <div class="text-gray-600">High Matches</div>
                        </div>
                        <div class="text-center">
                          <div class="text-lg font-gt-walsheim-bold text-cta-pink">{projectStats[project.id]?.totalValue || '£0'}</div>
                          <div class="text-gray-600">Total Value</div>
                        </div>
                      </div>
                    </div>

                    <!-- Project Details -->
                    <div class="bg-gray-50 rounded-lg p-4 mt-4">
                      <h5 class="font-medium text-gray-900 mb-3">Project Details</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="text-gray-600">Problem Statement:</span>
                          <p class="text-gray-900 mt-1">{project.problemStatement || 'Not specified'}</p>
                        </div>
                        <div>
                          <span class="text-gray-600">Solution Approach:</span>
                          <p class="text-gray-900 mt-1">{project.solutionApproach || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
                
                <!-- Add Project Placeholder -->
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-300">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h4 class="text-lg font-gt-walsheim-bold text-gray-900 mb-2">Add New Project</h4>
                  <p class="text-gray-600 mb-4">Create a new project to get personalized grant recommendations</p>
                  <button 
                    on:click={openNewProjectDialog}
                    class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- New Project Dialog -->
<NewProjectDialog 
  bind:isOpen={showNewProjectDialog}
  on:close={closeNewProjectDialog}
  on:project-created={closeNewProjectDialog}
/>

<!-- Edit Project Dialog (reuse NewProjectDialog with pre-filled data) -->
{#if showEditDialog && editingProject}
  <NewProjectDialog 
    bind:isOpen={showEditDialog}
    {editingProject}
    on:close={closeEditDialog}
    on:project-updated={closeEditDialog}
  />
{/if}
