<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  
  let mounted = false;
  let activeSection = 'projects';
  let sidebarExpanded = true;
  
  // Handle section change from sidebar
  function handleSectionChange(section: string) {
    if (section === 'matches') window.location.href = '/portal';
    else if (section === 'competitions') window.location.href = '/portal#competitions';
    else if (section === 'saved-competitions') window.location.href = '/portal#saved-competitions';
    else if (section === 'saved-writers') window.location.href = '/portal#saved-writers';
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
    
    <div class="flex h-screen pt-16">
      <!-- Sidebar Component -->
      <Sidebar 
        bind:expanded={sidebarExpanded} 
        {activeSection} 
        onSectionChange={handleSectionChange}
      />

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="p-8">
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
                <h3 class="text-2xl font-gt-walsheim-bold text-gray-900">Active Projects</h3>
                <button class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-gt-walsheim-bold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                  Add New Project
                </button>
              </div>
              
              <div class="space-y-4">
                <!-- Existing Project -->
                <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-gt-walsheim-bold text-gray-900 mb-2">AI-Powered Analytics Platform</h4>
                      <p class="text-gray-600 text-sm mb-3">Machine learning platform for real-time data analytics</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Technology: AI/ML</span>
                        <span>•</span>
                        <span>Maturity: Stage 5</span>
                        <span>•</span>
                        <span>Updated: 2 days ago</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button class="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-blue/90 transition-colors duration-200">
                        Run New Match
                      </button>
                      <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h5 class="font-medium text-gray-900 mb-2">Last Match Results</h5>
                    <div class="grid grid-cols-3 gap-4 text-sm">
                      <div class="text-center">
                        <div class="text-lg font-gt-walsheim-bold text-emerald-600">12</div>
                        <div class="text-gray-600">Grants Found</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-gt-walsheim-bold text-primary-blue">3</div>
                        <div class="text-gray-600">High Matches</div>
                      </div>
                      <div class="text-center">
                        <div class="text-lg font-gt-walsheim-bold text-cta-pink">£2.8M</div>
                        <div class="text-gray-600">Total Value</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Add Project Placeholder -->
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-300">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <h4 class="text-lg font-gt-walsheim-bold text-gray-900 mb-2">Add New Project</h4>
                  <p class="text-gray-600 mb-4">Create a new project to get personalized grant recommendations</p>
                  <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
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
