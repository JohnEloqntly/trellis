<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade, slide, fly, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  
  let searchParams: {
    sector: string;
    technology: string;
    maturity: string;
    company: string;
  } = {
    sector: '',
    technology: '',
    maturity: '',
    company: ''
  };
  let grants: any[] = [];
  let loading = false;
  let hasPaid = false; // Payment status
  let mounted = false;
  let activeSection = 'results';
  let savedCompetitions: number[] = [];
  
  // Create a reactive lookup for saved status that updates when savedCompetitions changes
  $: savedStatus = grants.reduce((acc, grant) => {
    acc[grant.id] = savedCompetitions.includes(grant.id);
    return acc;
  }, {} as { [key: number]: boolean });
  
  onMount(() => {
    mounted = true;
    // Get search parameters from URL
    searchParams = {
      sector: $page.url.searchParams.get('sector') || '',
      technology: $page.url.searchParams.get('technology') || '',
      maturity: $page.url.searchParams.get('maturity') || '',
      company: $page.url.searchParams.get('company') || ''
    };
    
    // Check payment status from localStorage
    const paymentStatus = localStorage.getItem('trellisPaymentStatus');
    hasPaid = paymentStatus === 'paid';
    
    // Load existing saved competitions from localStorage
    const existingSaved = localStorage.getItem('savedCompetitions');
    savedCompetitions = existingSaved ? JSON.parse(existingSaved) : [];
    
    // Generate results immediately - no loading delay
      grants = generateMockGrants(searchParams);
  });
  
  function generateMockGrants(params: any) {
    const mockGrants = [
      {
        id: 1,
        title: 'Innovate UK Smart Grants',
        funder: 'Innovate UK',
        amount: '£100k - £2M',
        deadline: '2024-03-15',
        match: 95,
        description: 'Game-changing and commercially viable R&D innovations that can significantly impact the UK economy.',
        sector: params.sector,
        eligibility: ['UK-based SMEs', 'Research organizations', 'Collaborative projects'],
        tags: ['R&D', 'Innovation', 'Technology']
      },
      {
        id: 2,
        title: 'EPSRC Impact Acceleration Account',
        funder: 'EPSRC',
        amount: '£25k - £500k',
        deadline: '2024-02-28',
        match: 88,
        description: 'Accelerate the economic and societal impact of EPSRC research through knowledge exchange.',
        sector: params.sector,
        eligibility: ['Universities', 'Research institutions', 'Industry partnerships'],
        tags: ['Impact', 'Knowledge Exchange', 'Research Translation']
      },
      {
        id: 3,
        title: 'Sustainable Innovation Fund',
        funder: 'Department for Energy Security',
        amount: '£50k - £1M',
        deadline: '2024-04-30',
        match: 82,
        description: 'Supporting innovations that contribute to net zero and sustainable development goals.',
        sector: params.sector,
        eligibility: ['All UK organizations', 'International partnerships welcome'],
        tags: ['Sustainability', 'Net Zero', 'Green Tech']
      }
    ];
    
    return mockGrants;
  }
  
  function getMatchColor(match: number) {
    if (match >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (match >= 75) return 'text-primary-blue bg-blue-50 border-blue-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  }
  
  function startPaymentFlow() {
    // Navigate to payment page with current search params
    const currentParams = new URLSearchParams(window.location.search);
    goto(`/payment?${currentParams.toString()}`);
  }
  
  function handleSectionChange(section: string) {
    if (section !== 'results') {
      goto(`/portal?section=${section}`);
    }
  }
  
  function toggleSave(grantId: number) {
    if (savedCompetitions.includes(grantId)) {
      // Remove from saved list
      savedCompetitions = savedCompetitions.filter((id: number) => id !== grantId);
    } else {
      // Add to saved list
      savedCompetitions = [...savedCompetitions, grantId];
    }
    localStorage.setItem('savedCompetitions', JSON.stringify(savedCompetitions));
  }
  
  function isSaved(grantId: number) {
    return savedCompetitions.includes(grantId);
  }
  
  function goToPortalWithSavedMatches() {
    // Save all current matches to localStorage
    const allMatchIds = grants.map(grant => grant.id);
    const existingSaved = JSON.parse(localStorage.getItem('savedCompetitions') || '[]');
    
    // Merge with existing saved competitions (avoiding duplicates)
    const updatedSaved = [...new Set([...existingSaved, ...allMatchIds])];
    localStorage.setItem('savedCompetitions', JSON.stringify(updatedSaved));
    
    // Navigate to portal
    goto('/portal');
  }
</script>

<svelte:head>
  <title>Your Grant Matches - Trellis</title>
  <meta name="description" content="Personalized grant opportunities matched to your innovation" />
</svelte:head>

<!-- Portal-Style Layout -->
<div class="bg-gray-50">
  <!-- Top App Bar (behind sidebar) -->
  <TopAppBar sidebarExpanded={false} />
  
  <div class="flex h-screen pt-16 bg-gray-50">
    <!-- Sidebar -->
    <Sidebar expanded={false} {activeSection} onSectionChange={handleSectionChange} />
    
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
    <div class="p-6 lg:p-8">
      
      {#if mounted}
        <!-- Header Section -->
        <div class="mb-8" in:fade={{ duration: 500, delay: 200 }}>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-2">
                Your Grant Matches
              </h1>
            </div>
            
            <!-- Developer Reset Button (for testing) -->
            <button 
              on:click={() => {
                localStorage.removeItem('trellisPaymentStatus');
                window.location.reload();
              }}
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xs bg-gray-100 px-3 py-1 rounded-lg border"
              title="Reset payment status for testing"
            >
              Reset Payment
            </button>
          </div>
          
        </div>
        
        <!-- Portal CTA Section -->
        {#if hasPaid}
          <div class="mb-8" in:fade={{ duration: 600, delay: 400 }}>
            <div class="bg-gradient-to-r from-primary-blue/5 to-secondary-blue/5 border border-gray-200 rounded-2xl p-6 text-center">
              <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">
                Ready to manage your grants?
              </h3>
              <p class="text-gray-600 mb-4 text-sm">
                Access your full portal to track applications, save opportunities, and connect with expert writers
              </p>
              <button 
                on:click={() => goto('/portal')}
                class="bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-gt-walsheim-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue to Portal
              </button>
            </div>
          </div>
        {/if}

        <!-- Results Content -->
        {#if !hasPaid}
          <!-- Free Trial Gate -->
          <div class="relative">
            <!-- Blurred Content Preview -->
            <div class="space-y-6 filter blur-sm pointer-events-none select-none opacity-60">
              {#each grants as grant, index}
                <div 
                  class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                  in:slide={{ duration: 400, delay: index * 100 }}
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h2 class="text-xl font-gt-walsheim-bold text-gray-900">
                          {grant.title}
                        </h2>
                        <span class="px-3 py-1 text-xs font-medium rounded-full border {getMatchColor(grant.match)}">
                          {grant.match}% match
                        </span>
                      </div>
                      <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span class="font-medium">{grant.funder}</span>
                        <span>•</span>
                        <span class="font-semibold text-emerald-600">{grant.amount}</span>
                        <span>•</span>
                        <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 mb-4 leading-relaxed">
                    {grant.description}
                  </p>
                  
                  <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Eligibility</h3>
                      <ul class="text-sm text-gray-600 space-y-1">
                        {#each grant.eligibility as requirement}
                          <li class="flex items-center space-x-2">
                            <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            <span>{requirement}</span>
                          </li>
                        {/each}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Tags</h3>
                      <div class="flex flex-wrap gap-2">
                        {#each grant.tags as tag}
                          <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        {/each}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex space-x-3">
                    <button class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg">
                      View Details
                    </button>
                    <button class="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-colors duration-200">
                      Save for Later
                    </button>
                  </div>
                </div>
              {/each}
            </div>
            
            <!-- Free Trial Overlay -->
            <div 
              class="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md"
              in:fade={{ duration: 800, delay: 600 }}
            >
              <div class="text-center max-w-2xl mx-auto px-6">
                <!-- Lock Icon -->
                <div class="mb-8" in:scale={{ duration: 600, delay: 800 }}>
                  <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl shadow-xl">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Headline -->
                <div in:fly={{ y: 30, duration: 600, delay: 1000 }}>
                  <h2 class="text-4xl md:text-5xl font-gt-walsheim-bold text-gray-900 mb-4">
                    Start Your 
                    <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">
                      Free Trial
                    </span>
                  </h2>
                  
                  <!-- Description -->
                  <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                    Get full access to detailed grant information, application guides, and expert writer connections.
                  </p>
                </div>
                
                <!-- Features List -->
                <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8" in:slide={{ duration: 600, delay: 1200 }}>
                  <h3 class="font-gt-walsheim-bold text-gray-900 mb-6 text-xl">What's included in your free trial:</h3>
                  <div class="grid md:grid-cols-2 gap-4 text-left">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="text-gray-700">Complete grant details & eligibility</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="text-gray-700">Direct application links & guides</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="text-gray-700">Expert grant writer connections</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="text-gray-700">Priority access to new opportunities</span>
                    </div>
                  </div>
                </div>
                
                <!-- Pricing -->
                <div class="mb-8" in:fade={{ duration: 600, delay: 1400 }}>
                  <div class="text-center">
                    <div class="inline-flex items-center justify-center bg-gradient-to-r from-primary-blue/10 to-secondary-blue/10 rounded-2xl px-8 py-4 mb-4">
                      <div class="text-center">
                        <div class="text-4xl font-gt-walsheim-bold text-gray-900 mb-1">FREE</div>
                        <div class="text-sm text-gray-600">14-day trial</div>
                      </div>
                      <div class="mx-6 text-gray-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                      <div class="text-center">
                        <div class="text-4xl font-gt-walsheim-bold text-gray-900 mb-1">£29.99</div>
                        <div class="text-sm text-gray-600">per month after</div>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500">Cancel anytime during your free trial • No commitment</p>
                  </div>
                </div>
                
                <!-- CTA Button -->
                <div in:scale={{ duration: 600, delay: 1600 }}>
                  <button 
                    on:click={startPaymentFlow}
                    class="w-full bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-gt-walsheim-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg mb-4"
                  >
                    Start Free Trial
                  </button>
                  
                  <p class="text-xs text-gray-400">
                    Secure payment • Cancel anytime • 30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
        </div>
        {:else}
          <!-- Unlocked Content (full access) -->
          <div class="space-y-6">
            {#each grants as grant, index}
              <div 
                class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300"
                in:slide={{ duration: 400, delay: index * 100 }}
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h2 class="text-xl font-gt-walsheim-bold text-gray-900">
                        {grant.title}
                      </h2>
                      <span class="px-3 py-1 text-xs font-medium rounded-full border {getMatchColor(grant.match)}">
                        {grant.match}% match
                      </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span class="font-medium">{grant.funder}</span>
                      <span>•</span>
                      <span class="font-semibold text-emerald-600">{grant.amount}</span>
                      <span>•</span>
                      <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <p class="text-gray-700 mb-4 leading-relaxed">
                  {grant.description}
                </p>
                
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Eligibility</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                      {#each grant.eligibility as requirement}
                        <li class="flex items-center space-x-2">
                          <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          <span>{requirement}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                      {#each grant.tags as tag}
                        <span class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      {/each}
                    </div>
                  </div>
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    on:click={() => goto(`/competition/${grant.id}`)}
                    class="bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
                  >
                    View Details
                  </button>
                  <button 
                    on:click={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSave(grant.id);
                    }}
                    class="font-semibold px-6 py-3 rounded-xl transition-all duration-200 {savedStatus[grant.id] ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'} hover:shadow-lg"
                  >
                    <div class="flex items-center space-x-2">
                      {#if savedStatus[grant.id]}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                        <span>Saved</span>
                      {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                        <span>Save for Later</span>
                      {/if}
                    </div>
                    

                  </button>
                </div>
                

              </div>
            {/each}
          </div>
          

        {/if}
      {/if}
        </div>
  </div>
</div> 