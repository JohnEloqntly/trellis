<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  
  export let searchData = {
    sector: '',
    technologyType: '',
    innovationMaturity: 5,
    companyName: ''
  };
  
  let mounted = false;
  let currentStage = 0;
  let progress = 0;
  let currentInsight = 0;
  
  // Enhanced stages with more personality
  const stages = [
    { 
      text: "Analysing your innovation profile", 
      duration: 3500, 
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
             </svg>` 
    },
    { 
      text: "Scanning 2,000+ funding opportunities", 
      duration: 4000, 
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"/>
             </svg>` 
    },
    { 
      text: "Matching with perfect grants", 
      duration: 3500, 
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
             </svg>` 
    },
    { 
      text: "Preparing your personalised results", 
      duration: 2000, 
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
             </svg>` 
    }
  ];
  
  // Dynamic insights that rotate while loading
  const insights = [
    {
      title: "Success Story",
      icon: `<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`,
      content: "Trellis helped CloudTech find £2.3M in funding they didn't know existed. The process was seamless!",
      author: "- CloudTech UK, Healthcare Technology"
    },
    {
      title: "Did You Know?",
      icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>`,
      content: "Over £47 billion in grants go unclaimed every year because businesses don't know they exist.",
      author: ""
    },
    {
      title: "Perfect Matching",
      icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
             </svg>`,
      content: "Our smart algorithms analyse your profile against thousands of live grants to find your perfect matches.",
      author: ""
    },
    {
      title: "Innovation Funding",
      icon: `<svg class="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
             </svg>`,
      content: "95% of our matched companies receive funding within 6 months of finding their perfect grant.",
      author: ""
    }
  ];
  
  onMount(() => {
    mounted = true;
    startLoadingSequence();
    
    // Rotate insights every 3 seconds
    const insightInterval = setInterval(() => {
      currentInsight = (currentInsight + 1) % insights.length;
    }, 3000);
    
    return () => clearInterval(insightInterval);
  });
  
  async function startLoadingSequence() {
    for (let i = 0; i < stages.length; i++) {
      currentStage = i;
      
      // Smooth progress animation
      const stageProgress = ((i + 1) / stages.length) * 100;
      const startProgress = (i / stages.length) * 100;
      const duration = stages[i].duration;
      const startTime = Date.now();
      
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min(elapsed / duration, 1);
        progress = startProgress + (stageProgress - startProgress) * progressPercent;
        
        if (progressPercent < 1) {
          requestAnimationFrame(animateProgress);
        }
      };
      
      animateProgress();
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    
    // Complete the loading
    progress = 100;
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Navigate to results with search parameters
    const searchParams = new URLSearchParams({
      sector: searchData.sector || '',
      technology: searchData.technologyType || '',
      maturity: searchData.innovationMaturity?.toString() || '5',
      company: searchData.companyName || ''
    });
    
    goto(`/results?${searchParams.toString()}`);
  }
</script>

<!-- Beautiful single-column loading design -->
<div class="min-h-screen bg-gray-50 overflow-auto">
  {#if mounted}
    <div class="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 py-16">
      
      <!-- Header Section -->
      <div class="text-center mb-16" in:fade={{ duration: 800, delay: 200 }}>
        <!-- Trellis Logo -->
        <div class="flex justify-center mb-8" in:scale={{ duration: 600, delay: 200 }}>
          <div class="w-20 h-20 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg p-3">
            <img src="/trellis_logo_correct.png" alt="Trellis Logo" class="h-12 w-auto object-contain" />
          </div>
        </div>

        <!-- Dynamic Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-gt-walsheim-bold text-gray-900 mb-6 leading-tight">
          Finding Your 
          <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">
            Perfect
          </span>
          Grants
        </h1>
        
        <p class="text-xl sm:text-2xl text-gray-600 font-gt-walsheim leading-relaxed mb-8 max-w-3xl mx-auto">
          Our smart matching algorithm is analysing thousands of opportunities to find your ideal funding matches.
        </p>
      </div>

      <!-- Loading Status Section -->
      <div class="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 sm:p-12 mb-16" in:fade={{ duration: 800, delay: 400 }}>
        
        <!-- Current Stage with Icon -->
        <div class="text-center mb-12">
          <div class="h-24 flex items-center justify-center relative">
            {#if currentStage < stages.length}
              {#key currentStage}
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="flex flex-col items-center space-y-4" in:fly={{ y: 20, duration: 500 }} out:fly={{ y: -20, duration: 500 }}>
                    <div class="w-16 h-16 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg">
                      {@html stages[currentStage].icon}
                    </div>
                    <div class="text-2xl sm:text-3xl font-gt-walsheim-bold bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent text-center">
                      {stages[currentStage].text}
                    </div>
                  </div>
                </div>
              {/key}
            {:else}
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex flex-col items-center space-y-4" in:fade={{ duration: 400 }}>
                  <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div class="text-2xl sm:text-3xl font-gt-walsheim-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent text-center">
                    Complete! Taking you to results...
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-12 max-w-2xl mx-auto" in:fade={{ duration: 800, delay: 600 }}>
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-600">Progress</span>
            <span class="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary-blue to-secondary-blue rounded-full transition-all duration-700 ease-out relative"
              style="width: {progress}%"
            >
              <!-- Shimmer effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Stage Indicators -->
        <div class="flex justify-center flex-wrap gap-3" in:fade={{ duration: 800, delay: 800 }}>
          {#each stages as stage, index}
            <div class="flex items-center bg-white rounded-full px-6 py-3 border border-gray-200 shadow-sm transition-all duration-300 {index <= currentStage ? 'border-primary-blue bg-primary-blue/10' : ''}">
              <div class="w-3 h-3 rounded-full mr-3 {index <= currentStage ? 'bg-primary-blue' : 'bg-gray-300'}"></div>
              <span class="text-sm font-medium {index <= currentStage ? 'text-primary-blue' : 'text-gray-500'}">Step {index + 1}</span>
            </div>
          {/each}
        </div>
      </div>


      
    </div>
  {/if}
</div> 