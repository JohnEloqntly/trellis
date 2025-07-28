<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Wizard from '$lib/components/onboarding/Wizard.svelte';
  
  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Complete Your Profile - Trellis</title>
</svelte:head>

<!-- Beautiful single-column design -->
<div class="min-h-screen bg-gray-50 overflow-auto">
  {#if mounted}
    <div class="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12">
      <!-- Header Section -->
      <div class="text-center mb-12" in:fade={{ duration: 800, delay: 200 }}>
        <!-- Trellis Logo -->
        <div class="flex justify-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg p-3">
            <img src="/trellis_logo_correct.png" alt="Trellis Logo" class="h-12 w-auto object-contain" />
          </div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-gt-walsheim-bold text-gray-900 mb-6 leading-tight">
          Let's Find Your
          <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">
            Perfect
          </span>
          Grants
        </h1>
        
        <p class="text-xl sm:text-2xl text-gray-600 font-gt-walsheim leading-relaxed mb-12 max-w-3xl mx-auto">
          Tell us about your innovation and we'll match you with funding opportunities where you're most likely to succeed.
        </p>
      </div>

      <!-- Wizard Form Section - Moved Up -->
      <div class="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 sm:p-12 mb-16" in:fade={{ duration: 800, delay: 400 }}>
        <Wizard />
      </div>


    </div>
  {/if}
</div> 