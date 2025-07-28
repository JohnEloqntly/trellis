<script lang="ts">
  import { goto } from '$app/navigation';
  
  export let expanded = true;
  export let activeSection = 'matches';
  export let onSectionChange: (section: string) => void;
  
  const sections = [
    { 
      id: 'matches', 
      label: 'My Matches', 
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      description: 'Personalized grant recommendations'
    },
    { 
      id: 'competitions', 
      label: 'All Competitions', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      description: 'Browse all available grants'
    },
    { 
      id: 'saved-competitions', 
      label: 'Saved Competitions', 
      icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
      description: 'Your bookmarked grants'
    },
    { 
      id: 'saved-writers', 
      label: 'Saved Writers', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      description: 'Your favorite grant writers'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      description: 'Profile and settings'
    }
  ];
  
  function selectSection(sectionId: string) {
    onSectionChange(sectionId);
  }
  
  function toggleSidebar() {
    expanded = !expanded;
  }
</script>

<div class="bg-white h-full border-r border-gray-200 shadow-sm transition-all duration-300" class:w-20={!expanded} class:w-80={expanded}>
  <div class="p-4">
    <!-- Header with Logo and Toggle -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-3">
        {#if expanded}
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-lg flex items-center justify-center">
              <span class="text-white font-gt-walsheim-bold text-sm">T</span>
            </div>
            <img src="/trellis_logo_correct.png" alt="Trellis" class="h-8 w-auto" />
          </div>
        {:else}
          <div class="w-8 h-8 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-lg flex items-center justify-center">
            <span class="text-white font-gt-walsheim-bold text-sm">T</span>
          </div>
        {/if}
      </div>
      
      <button 
        on:click={toggleSidebar}
        class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
        title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if expanded}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          {/if}
        </svg>
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="space-y-2">
      {#each sections as section}
        <button
          on:click={() => selectSection(section.id)}
          class="w-full rounded-xl transition-all duration-200 text-left group relative overflow-hidden {expanded ? 'flex items-center space-x-3 px-3 py-3' : 'flex items-center justify-center p-3'}"
          class:bg-gradient-to-r={activeSection === section.id}
          class:from-primary-blue={activeSection === section.id}
          class:to-secondary-blue={activeSection === section.id}
          class:text-white={activeSection === section.id}
          class:text-gray-600={activeSection !== section.id}
          class:hover:bg-gray-50={activeSection !== section.id}
          class:shadow-lg={activeSection === section.id}
          title={expanded ? '' : section.label}
        >
          {#if expanded}
            <div class="flex items-center space-x-3 flex-1 relative z-10">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.icon}/>
              </svg>
              <div class="flex-1">
                <div class="font-medium">{section.label}</div>
                <div class="text-xs opacity-75 mt-0.5">{section.description}</div>
              </div>
            </div>
          {:else}
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.icon}/>
            </svg>
          {/if}
        </button>
      {/each}
    </nav>
  </div>
</div> 