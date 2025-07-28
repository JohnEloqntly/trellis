<script lang="ts">
  interface Logo {
    src: string;
    alt: string;
  }
  
  export let logos: Logo[] = [];
  
  // Duplicate the logos array to create seamless infinite scroll
  $: duplicatedLogos = [...logos, ...logos];
</script>

<section class="py-16 md:py-20 bg-gray-50" aria-label="Featured funding bodies">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-center text-gray-900 font-gt-walsheim-bold text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 px-4 sm:px-0">
      Featuring leading UK funding bodies
    </h2>
    
    <!-- Clean container with blue tint styling -->
    <div class="rounded-2xl border border-gray-200 shadow-sm py-12 md:py-16 relative overflow-hidden" style="background-color: #d5e4fd;">
      <!-- Gradient overlays for smooth edge effect -->
      <div class="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none" style="background: linear-gradient(to right, #d5e4fd, transparent);"></div>
      <div class="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none" style="background: linear-gradient(to left, #d5e4fd, transparent);"></div>
      
      <!-- Scrolling container -->
      <div class="flex space-x-8 md:space-x-12 animate-marquee px-8">
        {#each duplicatedLogos as logo, index}
          <div 
            class="flex-shrink-0 flex items-center justify-center"
            role="img"
            aria-label={logo.alt}
          >
            <img 
              src={logo.src} 
              alt={logo.alt}
              class="h-8 sm:h-10 md:h-12 lg:h-16 w-auto logo-hover transition-all duration-300 object-contain opacity-70 hover:opacity-100"
              loading="lazy"
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .animate-marquee {
    animation: marquee 25s linear infinite;
  }
  
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-marquee {
      animation: none;
    }
  }
</style> 