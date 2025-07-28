<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<section class="h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 bg-gray-50 overflow-hidden">
  <div class="max-w-4xl mx-auto text-center">
    {#if mounted}
      <!-- Main Heading -->
      <h1 
        class="font-gt-walsheim-bold font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-gray-900 tracking-tight mb-3 sm:mb-4 md:mb-6 leading-tight mt-6 sm:mt-8 md:mt-12 px-2 sm:px-0"
        style="font-weight: 900;"
        in:fade={{ duration: 1000, delay: 300 }}
      >
        Unlock the Funding <br class="hidden sm:block">
        <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">
          No One Told You About
        </span>
      </h1>
      
      <!-- Subheadline -->
      <p 
        class="font-gt-walsheim text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-2 md:px-0"
        in:fade={{ duration: 1000, delay: 500 }}
      >
        Fuel your next innovation with a grant matched to your start‑up in minutes.
      </p>
      
      <!-- CTA Button -->
      <div 
        class="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0"
        in:fade={{ duration: 1000, delay: 700 }}
      >
        <a 
          href="/onboarding"
          class="inline-block bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-gt-walsheim-bold py-3 sm:py-4 px-8 sm:px-12 md:px-16 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg md:text-xl"
          aria-label="Start searching for grants"
        >
          Search Grants
        </a>
      </div>
      
      <!-- Stats Card -->
      <div 
        class="font-gt-walsheim"
        in:slide={{ duration: 1000, delay: 1000 }}
      >
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Clean card matching portal style -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 sm:p-8">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center">
                    <img src="/office.png" alt="" class="w-6 h-6 object-contain" />
                  </div>
                </div>
                <div class="text-3xl md:text-4xl font-gt-walsheim-bold text-gray-900 mb-2">500+</div>
                <div class="text-gray-600 text-sm md:text-base">active funding bodies</div>
              </div>
              
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center">
                    <img src="/magnifier.png" alt="" class="w-6 h-6 object-contain" />
                  </div>
                </div>
                <div class="text-3xl md:text-4xl font-gt-walsheim-bold text-gray-900 mb-2">2,000</div>
                <div class="text-gray-600 text-sm md:text-base">live opportunities</div>
              </div>
              
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center">
                    <img src="/pound.png" alt="" class="w-6 h-6 object-contain" />
                  </div>
                </div>
                <div class="text-3xl md:text-4xl font-gt-walsheim-bold text-gray-900 mb-2">£1bn</div>
                <div class="text-gray-600 text-sm md:text-base">in available funding</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section> 