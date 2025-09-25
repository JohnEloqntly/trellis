<script lang="ts">
  import AccountDropdown from './AccountDropdown.svelte';
  import ProjectDropdown from './ProjectDropdown.svelte';
  import NewProjectDialog from './NewProjectDialog.svelte';
  
  export let sidebarExpanded = true;
  
  let showAccountDropdown = false;
  let showNewProjectDialog = false;
  
  function toggleAccountDropdown() {
    showAccountDropdown = !showAccountDropdown;
  }
  
  function closeDropdown() {
    showAccountDropdown = false;
  }

  function openNewProjectDialog() {
    showNewProjectDialog = true;
  }

  function closeNewProjectDialog() {
    showNewProjectDialog = false;
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-dropdown-container') && !target.closest('.project-dropdown-container')) {
      showAccountDropdown = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div 
  class="fixed top-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-10 transition-all duration-300"
  class:left-80={sidebarExpanded}
  class:left-20={!sidebarExpanded}
>
  <div class="h-full flex items-center justify-end px-6 space-x-4">
    <!-- Project Dropdown -->
    <ProjectDropdown on:new-project={openNewProjectDialog} />
    
    <!-- Company Logo / Account Trigger -->
    <div class="account-dropdown-container relative">
      <button 
        on:click={toggleAccountDropdown}
        class="w-10 h-10 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-lg flex items-center justify-center hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
        title="Account settings"
        aria-label="Account settings"
      >
        <span class="text-white font-gt-walsheim-bold text-lg">T</span>
      </button>
      
      <!-- Account Dropdown -->
      {#if showAccountDropdown}
        <div class="absolute top-full right-0 mt-2 z-50">
          <AccountDropdown on:close={closeDropdown} />
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- New Project Dialog -->
<NewProjectDialog 
  bind:isOpen={showNewProjectDialog}
  on:close={closeNewProjectDialog}
  on:project-created={closeNewProjectDialog}
/>

<style>
  :global(.account-dropdown-container) {
    position: relative;
  }
</style>
