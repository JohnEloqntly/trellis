<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  
  let mounted = false;
  let grantTitle = 'IUK SMART Round X';
  let currentGrant = null;
  
  // Sample grant data (in real app, this would come from API/params)
  const grants = [
    {
      id: 1,
      title: 'IUK Smart Grants',
      amount: '£25K - £500K',
      deadline: '2024-03-15',
      eligibilityScore: 87,
      description: 'Innovation funding for R&D projects that could lead to commercially viable products, processes or services.'
    },
    {
      id: 2,
      title: 'ESA Business Applications',
      amount: '£100K - £2M',
      deadline: '2024-04-20',
      eligibilityScore: 73,
      description: 'Space technology applications with commercial potential and societal benefits.'
    },
    {
      id: 3,
      title: 'EIC Accelerator',
      amount: '£500K - €17.5M',
      deadline: '2024-05-10',
      eligibilityScore: 91,
      description: 'Deep tech innovations with the potential to create new markets or disrupt existing ones.'
    }
  ];
  
  // Eligibility criteria with scores
  const eligibilityCriteria = [
    { name: 'Innovation', score: 9, maxScore: 10 },
    { name: 'Commercial Viability', score: 8, maxScore: 10 },
    { name: 'Technical Feasibility', score: 7, maxScore: 10 },
    { name: 'Market Potential', score: 9, maxScore: 10 },
    { name: 'Team Capability', score: 8, maxScore: 10 },
    { name: 'IP Position', score: 6, maxScore: 10 },
    { name: 'Financial Need', score: 9, maxScore: 10 },
    { name: 'Sector Alignment', score: 8, maxScore: 10 }
  ];
  
  // Recommended writers with full profile data matching home page style
  const recommendedWriters = [
    {
      id: 1,
      name: 'Dr. Emma Williams',
      title: 'Senior Grant Consultant',
      yearsExperience: 12,
      sector: 'Healthcare',
      avatar: '/avatars/emma-williams.jpg',
      successRate: 94,
      totalFunding: '15.2M',
      specialty: 'Healthcare & MedTech',
      completedGrants: 127,
      matchReason: 'Specialized in innovation grants'
    },
    {
      id: 2,
      name: 'Dr. James Rodriguez',
      title: 'Funding Strategy Director',
      yearsExperience: 18,
      sector: 'Technology',
      avatar: '/avatars/james-rodriguez.jpg',
      successRate: 91,
      totalFunding: '31.5M',
      specialty: 'AI & Machine Learning',
      completedGrants: 89,
      matchReason: 'Expert in technical feasibility'
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Grant Writing Expert',
      yearsExperience: 8,
      sector: 'Environmental',
      avatar: '/avatars/sarah-johnson.jpg',
      successRate: 96,
      totalFunding: '8.7M',
      specialty: 'Clean Energy',
      completedGrants: 156,
      matchReason: 'Commercial viability specialist'
    },
    {
      id: 4,
      name: 'Prof. Michael Chen',
      title: 'Research Funding Specialist',
      yearsExperience: 15,
      sector: 'Technology',
      avatar: '/avatars/michael-chen.jpg',
      successRate: 92,
      totalFunding: '23.8M',
      specialty: 'Deep Tech',
      completedGrants: 203,
      matchReason: 'IP and market analysis expert'
    }
  ];
  
  let overallScore = 83;
  let isSaved = false;
  
  onMount(() => {
    mounted = true;
    // In real app, would get grant ID from URL params
    currentGrant = grants[0];
  });
  
  function goBack() {
    history.back();
  }
  
  function toggleSave() {
    isSaved = !isSaved;
  }
  
  function startApplication() {
    // In real app, would redirect to application form
    alert('Starting application process...');
  }
  
  function viewWriterProfile(writerId) {
    window.location.href = `/writer/${writerId}`;
  }
  
  // Calculate radar chart points for visualization
  function getRadarPoints() {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const angleStep = (2 * Math.PI) / eligibilityCriteria.length;
    
    return eligibilityCriteria.map((criteria, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const normalizedScore = criteria.score / criteria.maxScore;
      const x = centerX + Math.cos(angle) * radius * normalizedScore;
      const y = centerY + Math.sin(angle) * radius * normalizedScore;
      return `${x},${y}`;
    }).join(' ');
  }
</script>

<svelte:head>
  <title>Eligibility Assessment - {grantTitle} - Trellis</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-primary-blue to-secondary-blue">
  {#if mounted}
    <!-- Header -->
    <header class="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          on:click={goBack}
          class="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-gt-walsheim">Back</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Grant Header -->
        <div class="p-8 border-b border-gray-200" in:fade={{ duration: 600 }}>
          <h1 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-4">{grantTitle}</h1>
          <p class="text-gray-700 leading-relaxed">
            Innovation funding for R&D projects that could lead to commercially viable products, processes or services. This grant supports businesses developing cutting-edge solutions with strong commercial potential and significant market impact.
          </p>
        </div>

        <!-- Eligibility Score Section -->
        <div class="p-8 border-b border-gray-200" in:fly={{ y: 20, duration: 600, delay: 200 }}>
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- Score Info -->
            <div>
              <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-4">Your Eligibility Score</h2>
              <div class="mb-6">
                <div class="text-5xl font-gt-walsheim-bold text-primary-blue mb-2">{overallScore}%</div>
                <p class="text-gray-600">Based on your company profile and grant requirements</p>
              </div>
              
              <!-- Criteria Breakdown -->
              <div class="space-y-3">
                {#each eligibilityCriteria.slice(0, 4) as criteria}
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-gt-walsheim text-gray-700">{criteria.name}</span>
                    <div class="flex items-center space-x-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-primary-blue h-2 rounded-full transition-all duration-500"
                          style="width: {(criteria.score / criteria.maxScore) * 100}%"
                        ></div>
                      </div>
                      <span class="text-sm font-gt-walsheim-bold text-gray-900">{criteria.score}/{criteria.maxScore}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Radar Chart -->
            <div class="flex justify-center">
              <div class="relative">
                <svg width="300" height="300" viewBox="0 0 300 300" class="drop-shadow-lg">
                  <!-- Background circles -->
                  <circle cx="150" cy="150" r="100" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                  <circle cx="150" cy="150" r="75" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                  <circle cx="150" cy="150" r="50" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                  <circle cx="150" cy="150" r="25" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                  
                  <!-- Axis lines -->
                  {#each eligibilityCriteria as criteria, index}
                    {@const angle = index * (2 * Math.PI) / eligibilityCriteria.length - Math.PI / 2}
                    {@const endX = 150 + Math.cos(angle) * 100}
                    {@const endY = 150 + Math.sin(angle) * 100}
                    <line x1="150" y1="150" x2={endX} y2={endY} stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                  {/each}
                  
                  <!-- Score polygon -->
                  <polygon 
                    points={getRadarPoints()} 
                    fill="rgba(45, 73, 120, 0.3)" 
                    stroke="#2D4978" 
                    stroke-width="2"
                  />
                  
                  <!-- Score points -->
                  {#each eligibilityCriteria as criteria, index}
                    {@const angle = index * (2 * Math.PI) / eligibilityCriteria.length - Math.PI / 2}
                    {@const normalizedScore = criteria.score / criteria.maxScore}
                    {@const pointX = 150 + Math.cos(angle) * 100 * normalizedScore}
                    {@const pointY = 150 + Math.sin(angle) * 100 * normalizedScore}
                    <circle cx={pointX} cy={pointY} r="4" fill="#2D4978"/>
                  {/each}
                </svg>
                
                <!-- Chart Legend -->
                <div class="absolute top-0 right-0 bg-white rounded-lg shadow-lg p-3 text-xs">
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 bg-primary-blue rounded-full"></div>
                      <span>Your Score</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 border border-gray-300 rounded-full"></div>
                      <span>Maximum</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-8 border-b border-gray-200" in:fly={{ y: 20, duration: 600, delay: 400 }}>
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              on:click={startApplication}
              class="flex-1 bg-charcoal hover:bg-gray-800 text-white font-gt-walsheim-bold py-4 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              Start your application
            </button>
            <button 
              on:click={toggleSave}
              class="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-gt-walsheim-bold py-4 px-6 rounded-lg transition-colors duration-200 text-center"
            >
              {isSaved ? 'Saved ✓' : 'Save / Unsave'}
            </button>
          </div>
        </div>

        <!-- Writers Section -->
        <div class="p-8" in:fly={{ y: 20, duration: 600, delay: 600 }}>
          <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Writers who can support you</h2>
          
          <!-- Writer Cards Grid -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            {#each recommendedWriters as writer, index}
              <button 
                on:click={() => viewWriterProfile(writer.id)}
                class="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-1 text-left"
                in:fade={{ duration: 400, delay: index * 100 + 700 }}
              >
                <!-- Avatar and basic info -->
                <div class="flex items-center space-x-4 mb-4">
                  <div class="relative">
                    <img 
                      src={writer.avatar} 
                      alt={`${writer.name} profile picture`}
                      class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div class="absolute -bottom-1 -right-1 bg-primary-tint text-primary-blue text-xs font-semibold px-2 py-1 rounded-full">
                      {writer.yearsExperience}+ years
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-gt-walsheim-bold text-gray-900 text-lg">{writer.name}</h3>
                    <p class="text-gray-600 font-gt-walsheim">{writer.title}</p>
                    <span class="inline-block bg-cta-pink/20 text-cta-pink border border-cta-pink/30 px-3 py-1 rounded-full text-xs font-medium mt-2">
                      {writer.sector}
                    </span>
                  </div>
                </div>
                
                <!-- Stats -->
                <div class="flex justify-between text-center pt-4 border-t border-gray-200">
                  <div>
                    <div class="text-xl font-gt-walsheim-bold text-primary-blue">{writer.successRate}%</div>
                    <div class="text-gray-500 text-xs">Success Rate</div>
                  </div>
                  <div>
                    <div class="text-xl font-gt-walsheim-bold text-primary-blue">£{writer.totalFunding}</div>
                    <div class="text-gray-500 text-xs">Total Secured</div>
                  </div>
                  <div>
                    <div class="text-xl font-gt-walsheim-bold text-primary-blue">{writer.completedGrants}</div>
                    <div class="text-gray-500 text-xs">Grants Completed</div>
                  </div>
                </div>
              </button>
            {/each}
          </div>
          
          <!-- Writer Details -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="font-gt-walsheim-bold text-gray-900 mb-4">Why these writers?</h3>
            <p class="text-gray-700 text-sm leading-relaxed">
              Our AI matching system has selected these grant writers based on their expertise in your sector, 
              success rate with similar grants, and specific experience with {grantTitle.toLowerCase()} applications. 
              Each writer has been vetted for quality and has a proven track record of successful submissions.
            </p>
            <div class="mt-4 grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-gt-walsheim-bold text-primary-blue">94%</div>
                <div class="text-xs text-gray-600">Average success rate</div>
              </div>
              <div>
                <div class="text-2xl font-gt-walsheim-bold text-primary-blue">135</div>
                <div class="text-xs text-gray-600">Average grants completed</div>
              </div>
              <div>
                <div class="text-2xl font-gt-walsheim-bold text-primary-blue">4.8★</div>
                <div class="text-xs text-gray-600">Average rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  {/if}
</div> 