<script>
  import { fade } from 'svelte/transition';
  
  export let currentStep = 1;
  export let totalSteps = 8;
  
  $: progress = (currentStep / totalSteps) * 100;
</script>

<div class="w-full bg-primary-tint/30 h-1 rounded-full overflow-hidden">
  <div 
    class="h-full bg-primary-blue rounded-full transition-all duration-500 ease-out"
    style="width: {progress}%"
    in:fade={{ duration: 300 }}
  />
</div>

<div class="flex justify-between items-center mt-2 text-xs text-white/60">
  <span>Step {currentStep} of {totalSteps}</span>
  <span>{Math.round(progress)}% complete</span>
</div> 