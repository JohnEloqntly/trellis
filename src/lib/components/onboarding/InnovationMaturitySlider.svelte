<script>
  import { createEventDispatcher } from 'svelte';
  import { trlDescriptions } from '$lib/stores/onboarding.js';
  
  export let value = 5;
  export let min = 1;
  export let max = 9;
  
  const dispatch = createEventDispatcher();
  
  let isDragging = false;
  let sliderElement;
  let percentage = 50; // Default percentage
  
  // Adjust percentage calculation to keep thumb within track bounds
  $: {
    const rawPercentage = ((value - min) / (max - min)) * 100;
    // Add padding to prevent thumb from going off edges
    const thumbPadding = 3.5; // Half of thumb width (w-7 = 28px, so 14px = 3.5% of typical track)
    percentage = thumbPadding + (rawPercentage * (100 - 2 * thumbPadding)) / 100;
  }
  $: currentDescription = Object.entries(trlDescriptions).find(([key]) => parseInt(key) === value)?.[1] || 'Description not available';
  
  function handleInput(event) {
    const target = event.target;
    const newValue = parseInt(target.value);
    value = newValue;
    dispatch('change', { value: newValue });
  }
  
  function handleMouseDown() {
    isDragging = true;
    document.body.style.userSelect = 'none';
  }
  
  function handleMouseUp() {
    isDragging = false;
    document.body.style.userSelect = '';
  }
</script>

<div class="space-y-6">
  <!-- Current Level Display -->
  <div class="text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-blue rounded-full border-4 border-white/20 mb-3">
      <span class="text-2xl font-gt-walsheim-bold text-white">{value}</span>
    </div>
    <h3 class="text-lg font-gt-walsheim-bold text-gray-900 mb-2">
      Level {value} Innovation Maturity
    </h3>
    <p class="text-gray-600 font-gt-walsheim text-sm leading-relaxed max-w-md mx-auto">
      {currentDescription}
    </p>
  </div>

  <!-- Custom Slider -->
  <div class="relative py-6">
    <!-- Track Container -->
    <div class="relative px-4">
      <!-- Track -->
      <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <!-- Progress -->
        <div 
          class="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-blue to-cta-pink rounded-full shadow-sm"
          style="width: {percentage}%"
        ></div>
        
        <!-- Hidden input for interaction -->
        <input
          bind:this={sliderElement}
          type="range"
          {min}
          {max}
          step="1"
          {value}
          on:input={handleInput}
          on:mousedown={handleMouseDown}
          on:mouseup={handleMouseUp}
          class="absolute inset-0 w-full h-full opacity-0 cursor-grab focus:outline-none"
          style="cursor: {isDragging ? 'grabbing' : 'grab'}"
          aria-label="Innovation maturity level"
        />
      </div>
      
      <!-- Thumb -->
      <div 
        class="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-lg pointer-events-none"
        class:border-4={!isDragging}
        class:border-primary-blue={!isDragging}
        class:border-[5px]={isDragging}
        class:border-cta-pink={isDragging}
        class:shadow-xl={isDragging}
        style="left: {percentage}%"
      ></div>
    </div>
  </div>

  <!-- Level Indicators -->
  <div class="flex justify-between items-center px-1">
    {#each Array.from({length: max - min + 1}, (_, i) => i + min) as level}
      <button
        type="button"
        on:click={() => {
          value = level;
          dispatch('change', { value: level });
        }}
        class="flex flex-col items-center group {value === level ? 'scale-110' : 'hover:scale-105'}"
      >
        <div class="w-3 h-3 rounded-full {
          value === level 
            ? 'bg-primary-blue scale-125 shadow-md' 
            : 'bg-gray-300 group-hover:bg-gray-400'
        }"></div>
        <span class="text-xs font-gt-walsheim mt-1 {
          value === level 
            ? 'text-primary-blue font-semibold' 
            : 'text-gray-400 group-hover:text-gray-600'
        }">{level}</span>
      </button>
    {/each}
  </div>

  <!-- Quick Reference Guide -->
  <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
    <h4 class="font-gt-walsheim-bold text-gray-900 mb-3 text-sm">Quick Reference:</h4>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
      <div class="text-center p-2 bg-white rounded-lg border">
        <span class="font-gt-walsheim-bold text-gray-700">1-3</span>
        <div class="text-gray-500 font-gt-walsheim">Research & Concept</div>
      </div>
      <div class="text-center p-2 bg-white rounded-lg border">
        <span class="font-gt-walsheim-bold text-gray-700">4-6</span>
        <div class="text-gray-500 font-gt-walsheim">Development & Testing</div>
      </div>
      <div class="text-center p-2 bg-white rounded-lg border">
        <span class="font-gt-walsheim-bold text-gray-700">7-9</span>
        <div class="text-gray-500 font-gt-walsheim">Deployment Ready</div>
      </div>
    </div>
  </div>
</div>

 