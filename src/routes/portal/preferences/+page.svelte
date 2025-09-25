<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  
  let mounted = false;
  let activeSection = 'preferences';
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
  <title>Preferences - Trellis</title>
  <meta name="description" content="Manage your grant matching preferences and notifications" />
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
            <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-2">Preferences</h2>
            <p class="text-gray-600">Customize your grant matching preferences and notification settings</p>
          </div>

          <!-- Content -->
          <div class="space-y-8" in:fade={{ duration: 300 }}>
            <!-- Matching Preferences -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h3 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Matching Preferences</h3>
              
              <div class="space-y-6">
                <div>
                  <label for="grantSize" class="block text-sm font-medium text-gray-700 mb-2">Preferred Grant Size</label>
                  <select id="grantSize" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200">
                    <option>Any size</option>
                    <option>£10k - £100k</option>
                    <option>£100k - £500k</option>
                    <option>£500k - £2M</option>
                    <option>£2M+</option>
                  </select>
                </div>
                
                <div>
                  <label for="notificationFreq" class="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
                  <select id="notificationFreq" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>On demand only</option>
                  </select>
                </div>
                
                <div>
                  <label class="flex items-center space-x-3">
                    <input type="checkbox" checked class="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue" />
                    <span class="text-sm text-gray-700">Email me about new grant opportunities</span>
                  </label>
                </div>
                
                <div>
                  <label class="flex items-center space-x-3">
                    <input type="checkbox" class="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue" />
                    <span class="text-sm text-gray-700">Include EU and international grants</span>
                  </label>
                </div>
              </div>
              
              <div class="mt-6">
                <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
