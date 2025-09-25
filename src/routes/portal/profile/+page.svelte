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
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    id="email"
                    type="email" 
                    value="john.smith@company.com"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel" 
                    value="+44 7700 900 123"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
              </div>
              
              <div class="mt-6">
                <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                  Update Personal Info
                </button>
              </div>
            </div>

            <!-- Company Information -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h3 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Company Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">Company or Organisation Name</label>
                  <input 
                    id="companyName"
                    type="text" 
                    value="Tech Innovations Ltd"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label for="website" class="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                  <input 
                    id="website"
                    type="url" 
                    value="https://techinnovations.co.uk"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div>
                  <label for="employeeCount" class="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                  <select id="employeeCount" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white">
                    <option value="1">1 person</option>
                    <option value="2-5" selected>2-5 people</option>
                    <option value="6-9">6-9 people</option>
                    <option value="10-19">10-19 people</option>
                    <option value="20-49">20-49 people</option>
                    <option value="50-99">50-99 people</option>
                    <option value="100-249">100-249 people</option>
                    <option value="250+">250+ people</option>
                  </select>
                </div>
                
                <div>
                  <label for="companyAge" class="block text-sm font-medium text-gray-700 mb-2">How long has your company been around?</label>
                  <select id="companyAge" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white">
                    <option value="0-1">0-1 years</option>
                    <option value="2-5" selected>2-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-20">11-20 years</option>
                    <option value="21+">21+ years</option>
                  </select>
                </div>
                
                <div>
                  <label for="previousGrantFunding" class="block text-sm font-medium text-gray-700 mb-2">Previous Grant Funding</label>
                  <select id="previousGrantFunding" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white">
                    <option value="never">Never received grant funding</option>
                    <option value="applied">Applied but not successful</option>
                    <option value="received" selected>Previously received grants</option>
                    <option value="regular">Regular grant recipient</option>
                  </select>
                </div>
              </div>
              
              <div class="mt-6">
                <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                  Update Company Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
