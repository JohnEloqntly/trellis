<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  
  let mounted = false;
  let activeSection = 'profile';
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
  <title>Profile Settings - Trellis</title>
  <meta name="description" content="Manage your account profile and personal details" />
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
            <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-2">Profile Settings</h2>
            <p class="text-gray-600">Manage your account details and personal information</p>
          </div>

          <!-- Content -->
          <div class="space-y-8" in:fade={{ duration: 300 }}>
            <!-- Profile Settings -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h3 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Personal Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    id="fullName"
                    type="text" 
                    value="John Smith"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    id="email"
                    type="email" 
                    value="john.smith@company.com"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label for="company" class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input 
                    id="company"
                    type="text" 
                    value="Tech Innovations Ltd"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label for="sector" class="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <select id="sector" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200">
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Defense & Security">Defense & Security</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-6">
                <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
