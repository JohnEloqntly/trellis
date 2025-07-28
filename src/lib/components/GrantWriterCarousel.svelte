<script lang="ts">
  import GrantWriterCard from './GrantWriterCard.svelte';
  import { onMount } from 'svelte';
  
  interface GrantWriter {
    id?: number;
    name: string;
    title: string;
    yearsExperience: number;
    sector: string;
    avatar: string;
    successRate?: number;
    totalFunding?: string;
  }
  
  export let grantWriters: GrantWriter[] = [];
  
  let carouselContainer: HTMLElement;
  let canScrollLeft = false;
  let canScrollRight = true;
  let isScrolling = false;
  
  // Throttle scroll check for better performance
  let scrollTimer: ReturnType<typeof setTimeout>;
  
  onMount(() => {
    checkScrollButtons();
    
    // Simple, efficient image preloading
    const imageUrls = grantWriters.slice(0, 6).map(writer => writer.avatar);
    
    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        imageUrls.forEach(url => {
          const img = new Image();
          img.src = url;
        });
      });
    } else {
      // Fallback with timeout
      setTimeout(() => {
        imageUrls.forEach(url => {
          const img = new Image();
          img.src = url;
        });
      }, 100);
    }
  });
  
  function scrollLeft() {
    if (isScrolling) return;
    isScrolling = true;
    carouselContainer.scrollBy({ left: -320, behavior: 'smooth' });
    setTimeout(() => { isScrolling = false; }, 300);
  }
  
  function scrollRight() {
    if (isScrolling) return;
    isScrolling = true;
    carouselContainer.scrollBy({ left: 320, behavior: 'smooth' });
    setTimeout(() => { isScrolling = false; }, 300);
  }
  
  function checkScrollButtons() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (carouselContainer) {
        canScrollLeft = carouselContainer.scrollLeft > 0;
        canScrollRight = carouselContainer.scrollLeft < (carouselContainer.scrollWidth - carouselContainer.clientWidth);
      }
    }, 50);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollLeft();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollRight();
    }
  }
</script>

<section class="py-16 md:py-24 bg-gray-50" aria-label="Meet our expert grant writers">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
      <h2 class="font-gt-walsheim-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">
        Expert Grant Writers
      </h2>
      <p class="text-gray-600 font-gt-walsheim text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
        Our team of experienced professionals have helped secure millions in funding across various sectors
      </p>
    </div>
    
    <!-- Carousel Controls -->
    <div class="flex justify-center md:justify-end mb-4 sm:mb-6 space-x-4">
      <button 
        on:click={scrollLeft}
        disabled={!canScrollLeft || isScrolling}
        class="carousel-button"
        aria-label="Previous grant writer"
      >
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button 
        on:click={scrollRight}
        disabled={!canScrollRight || isScrolling}
        class="carousel-button"
        aria-label="Next grant writer"
      >
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <!-- Carousel Container -->
    <div 
      bind:this={carouselContainer}
      on:scroll={checkScrollButtons}
      on:keydown={handleKeydown}
      class="carousel-container"
      role="region"
      aria-label="Grant writers carousel"
      tabindex="0"
    >
      {#each grantWriters.slice(0, 6) as grantWriter, index (grantWriter.id || index)}
        <div class="snap-start">
          <GrantWriterCard {grantWriter} />
        </div>
      {/each}
    </div>
    
    <!-- Mobile scroll indicator -->
    <div class="md:hidden text-center mt-6 text-gray-500 text-sm">
      Swipe to see more →
    </div>
  </div>
</section>

<style>
  .carousel-button {
    padding: 0.75rem;
    border-radius: 9999px;
    background-color: white;
    border: 1px solid #e5e7eb;
    color: #374151;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .carousel-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .carousel-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .carousel-button:hover:not(:disabled) {
    background-color: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .carousel-button:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  .carousel-container {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 1rem 0;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .carousel-container::-webkit-scrollbar {
    display: none;
  }
  
  .carousel-container:focus {
    outline: none;
  }
</style> 