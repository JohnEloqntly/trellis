<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  
  const dispatch = createEventDispatcher();
  
  function closeDropdown() {
    dispatch('close');
  }
  
  function handleSignOut() {
    goto('/');
    closeDropdown();
  }
</script>

<div class="bg-white rounded-xl shadow-lg border border-gray-200 min-w-80 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-lg flex items-center justify-center">
        <span class="text-white font-gt-walsheim-bold text-sm">T</span>
      </div>
      <div>
        <h3 class="font-gt-walsheim-bold text-gray-900">Tech Innovations Ltd</h3>
        <p class="text-sm text-gray-600">john.smith@company.com</p>
      </div>
    </div>
  </div>
  
  <!-- Menu Items -->
  <div class="py-2">
    <button class="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
      <div>
        <div class="font-medium text-gray-900">Profile Settings</div>
        <div class="text-sm text-gray-500">Manage your account details</div>
      </div>
    </button>
    
    <button class="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <div>
        <div class="font-medium text-gray-900">Projects</div>
        <div class="text-sm text-gray-500">Manage your projects</div>
      </div>
    </button>
    
    <button class="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3">
      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
      </svg>
      <div>
        <div class="font-medium text-gray-900">Preferences</div>
        <div class="text-sm text-gray-500">Notification settings</div>
      </div>
    </button>
    
    <div class="border-t border-gray-200 mt-2 pt-2">
      <button 
        on:click={handleSignOut}
        class="w-full px-6 py-3 text-left hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3 text-red-600"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <div>
          <div class="font-medium">Sign Out</div>
          <div class="text-sm text-red-500">Sign out of your account</div>
        </div>
      </button>
    </div>
  </div>
</div>
