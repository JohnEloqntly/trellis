<script>
  import { onMount } from 'svelte';
  
  let scrollY = 0;
  let isScrolled = false;
  let mobileMenuOpen = false;
  
  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY;
      isScrolled = scrollY > 50;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<svelte:window bind:scrollY />

<nav 
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"
  aria-label="Main navigation"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 md:h-20">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a 
          href="/" 
          class="flex items-center focus-ring rounded-lg p-2 -m-2"
          aria-label="Trellis homepage"
        >
          <img 
            src="/favicon.png" 
            alt="Trellis logo" 
            class="h-10 md:h-12 w-auto transition-transform duration-200 hover:scale-105"
            loading="eager"
          />
        </a>
      </div>
      
      <!-- Navigation Links -->
      <div class="hidden md:flex items-center space-x-8">
        <span 
          class="text-gray-700 font-medium px-3 py-2"
        >
          Pricing
        </span>
        <span class="text-gray-700 font-medium px-3 py-2">
          Our Team
        </span>
        <span 
          class="text-gray-700 font-medium px-3 py-2"
        >
          About
        </span>
        <span 
          class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white px-4 py-2 rounded-2xl font-gt-walsheim-bold shadow-sm"
        >
          Sign In
        </span>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          on:click={toggleMobileMenu}
          class="text-gray-700 hover:text-gray-900 focus-ring rounded p-2"
          aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Mobile menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
        <div class="px-4 py-6 space-y-4">
          <span 
            class="block text-gray-700 font-medium px-3 py-3 text-lg"
          >
            Pricing
          </span>
          <span class="block text-gray-700 font-medium px-3 py-3 text-lg">
            Our Team
          </span>
          <span 
            class="block text-gray-700 font-medium px-3 py-3 text-lg"
          >
            About
          </span>
          <span 
            class="block bg-gradient-to-r from-primary-blue to-secondary-blue text-white px-4 py-3 rounded-2xl font-gt-walsheim-bold shadow-sm text-center text-lg"
          >
            Sign In
          </span>
        </div>
      </div>
    {/if}
  </div>
</nav> 