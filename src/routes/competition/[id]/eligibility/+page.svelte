<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import GrantWriterCard from '$lib/components/GrantWriterCard.svelte';
  import { grantWriters } from '$lib/data/grant-writers.js';
  import Sidebar from '$lib/components/Sidebar.svelte';
  
  let mounted = false;
  let competitionId: string;
  let competition: any = null;
  let eligibilityScore = 0;
  let isSaved = false;
  
  function handleSectionChange(section: string) {
    if (section !== 'competitions') {
      goto(`/portal?section=${section}`);
    }
  }
  
  // Mock competition data - in a real app this would come from an API
  const competitionData: any = {
    1: {
      id: 1,
      title: 'Innovate UK Smart Grants Round X',
      funder: 'Innovate UK',
      amount: '£100k - £2M',
      deadline: '2024-03-15',
      sector: 'Technology',
      status: 'open',
      description: `This competition aims to support ambitious UK businesses to research and develop game-changing and commercially viable innovative products, processes and services that can significantly impact the UK economy. We're looking for innovations that address real market needs and have strong commercial potential.`,
      applicationTime: 'How long we expect an application to take: 2-4 weeks',
      scoringCriteria: [
        { name: 'Innovation', score: 85, maxScore: 100 },
        { name: 'Feasibility', score: 78, maxScore: 100 },
        { name: 'Market Potential', score: 92, maxScore: 100 },
        { name: 'Team Capability', score: 76, maxScore: 100 },
        { name: 'Commercial Viability', score: 88, maxScore: 100 },
        { name: 'Impact', score: 82, maxScore: 100 }
      ]
    },
    2: {
      id: 2,
      title: 'EPSRC Impact Acceleration Round',
      funder: 'EPSRC',
      amount: '£25k - £500k',
      deadline: '2024-02-28',
      sector: 'Research',
      status: 'closing-soon',
      description: `The Impact Acceleration Account provides flexible funding to accelerate the economic and societal impact of EPSRC research investments. This scheme supports universities in developing pathways to impact for their research.`,
      applicationTime: 'How long we expect an application to take: 3-6 weeks',
      scoringCriteria: [
        { name: 'Research Excellence', score: 90, maxScore: 100 },
        { name: 'Impact Potential', score: 85, maxScore: 100 },
        { name: 'Pathway to Impact', score: 80, maxScore: 100 },
        { name: 'Partnerships', score: 75, maxScore: 100 },
        { name: 'Sustainability', score: 88, maxScore: 100 },
        { name: 'Knowledge Exchange', score: 82, maxScore: 100 }
      ]
    },
    3: {
      id: 3,
      title: 'Wellcome Trust Innovator Awards',
      funder: 'Wellcome Trust',
      amount: '£100k - £650k',
      deadline: '2024-05-15',
      sector: 'Healthcare',
      status: 'open',
      description: `The Innovator Awards support researchers developing innovative healthcare technologies with the potential to improve human health. This scheme provides funding for projects that are too early for traditional venture capital but show clear potential for impact.`,
      applicationTime: 'How long we expect an application to take: 4-8 weeks',
      scoringCriteria: [
        { name: 'Scientific Merit', score: 88, maxScore: 100 },
        { name: 'Healthcare Need', score: 92, maxScore: 100 },
        { name: 'Innovation', score: 85, maxScore: 100 },
        { name: 'Development Plan', score: 78, maxScore: 100 },
        { name: 'Team Expertise', score: 90, maxScore: 100 },
        { name: 'Patient Benefit', score: 95, maxScore: 100 }
      ]
    },
    4: {
      id: 4,
      title: 'UKRI Future Leaders Fellowship',
      funder: 'UKRI',
      amount: '£1M - £1.5M',
      deadline: '2024-06-01',
      sector: 'Research',
      status: 'open',
      description: `Future Leaders Fellowships provide funding for early career researchers and innovators with the most exciting ideas to become innovation leaders. This scheme supports ambitious researchers at a crucial stage in their career development.`,
      applicationTime: 'How long we expect an application to take: 6-10 weeks',
      scoringCriteria: [
        { name: 'Research Vision', score: 92, maxScore: 100 },
        { name: 'Leadership Potential', score: 85, maxScore: 100 },
        { name: 'Track Record', score: 80, maxScore: 100 },
        { name: 'Innovation', score: 88, maxScore: 100 },
        { name: 'Impact Strategy', score: 86, maxScore: 100 },
        { name: 'Career Development', score: 83, maxScore: 100 }
      ]
    }
  };
  
  onMount(() => {
    mounted = true;
    competitionId = $page.params.id;
    competition = competitionData[competitionId];
    
    if (!competition) {
      goto('/portal');
      return;
    }
    
    // Calculate overall eligibility score
    const totalScore = competition.scoringCriteria.reduce((sum: number, criteria: any) => sum + criteria.score, 0);
    const maxPossible = competition.scoringCriteria.length * 100;
    eligibilityScore = Math.round((totalScore / maxPossible) * 100);
    
    // Check if competition is saved
    const savedCompetitions = JSON.parse(localStorage.getItem('savedCompetitions') || '[]');
    isSaved = savedCompetitions.includes(competitionId);
  });
  
  function goBack() {
    goto(`/competition/${competitionId}`);
  }
  
  function startApplication() {
    alert('Starting application process...');
  }
  
  function toggleSave() {
    const savedCompetitions = JSON.parse(localStorage.getItem('savedCompetitions') || '[]');
    if (isSaved) {
      const updated = savedCompetitions.filter((id: string) => id !== competitionId);
      localStorage.setItem('savedCompetitions', JSON.stringify(updated));
      isSaved = false;
    } else {
      savedCompetitions.push(competitionId);
      localStorage.setItem('savedCompetitions', JSON.stringify(savedCompetitions));
      isSaved = true;
    }
  }
  
  function downloadScoring() {
    alert('Downloading scoring breakdown...');
  }
  
  function getScoreColor(score: number) {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  }
  
  function getOverallScoreColor(score: number) {
    if (score >= 85) return 'from-emerald-500 to-emerald-600 border-emerald-200';
    if (score >= 70) return 'from-amber-500 to-amber-600 border-amber-200';
    return 'from-red-500 to-red-600 border-red-200';
  }
  
  // Filter writers relevant to this competition
  $: relevantWriters = grantWriters.filter(writer => 
    writer.sector.toLowerCase().includes(competition?.sector?.toLowerCase() || '') ||
    writer.specializations?.some(spec => 
      spec.toLowerCase().includes(competition?.sector?.toLowerCase() || '')
    )
  ).slice(0, 8);
  
  // Spider chart calculation
  function generateSpiderChart(criteria: any[]) {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const angles = criteria.map((_, i) => (i * 2 * Math.PI) / criteria.length - Math.PI / 2);
    
    const dataPoints = criteria.map((item, i) => {
      const radius = (item.score / 100) * maxRadius;
      const x = centerX + radius * Math.cos(angles[i]);
      const y = centerY + radius * Math.sin(angles[i]);
      return { x, y, score: item.score, name: item.name };
    });
    
    const labelPoints = criteria.map((item, i) => {
      const radius = maxRadius + 30;
      const x = centerX + radius * Math.cos(angles[i]);
      const y = centerY + radius * Math.sin(angles[i]);
      return { x, y, name: item.name };
    });
    
    // Create grid lines
    const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0].map(factor => {
      const points = angles.map(angle => {
        const radius = maxRadius * factor;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return points;
    });
    
    // Create axis lines
    const axisLines = angles.map(angle => {
      const x = centerX + maxRadius * Math.cos(angle);
      const y = centerY + maxRadius * Math.sin(angle);
      return { x1: centerX, y1: centerY, x2: x, y2: y };
    });
    
    // Create data polygon
    const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
    
    return { dataPoints, labelPoints, gridLines, axisLines, dataPolygon };
  }
  
  function viewWriterProfile(writerId: number) {
    goto(`/writer/${writerId}`);
  }
  
  $: spiderData = competition ? generateSpiderChart(competition.scoringCriteria) : null;
</script>

<svelte:head>
  <title>Eligibility Assessment - {competition?.title || 'Competition'} - Trellis</title>
  <meta name="description" content="Assess your eligibility for {competition?.title}" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  {#if mounted && competition}
    <div class="flex h-screen">
      <!-- Collapsed Sidebar -->
      <Sidebar expanded={false} activeSection="competitions" onSectionChange={handleSectionChange} />
      
      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <!-- Back Navigation -->
          <div class="mb-8" in:fade={{ duration: 400 }}>
            <button 
              on:click={goBack}
              class="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
            >
              <div class="p-3 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </div>
              <span class="font-gt-walsheim-bold text-lg">Back to Competition</span>
            </button>
          </div>

          <!-- Hero Section -->
          <div class="text-center mb-12" in:fly={{ y: 30, duration: 600, delay: 200 }}>
            <h1 class="text-4xl md:text-5xl font-gt-walsheim-bold text-gray-900 mb-4">Eligibility Assessment</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">Discover your match potential and get personalized insights for your grant application</p>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-16">
            <!-- Left Column - Competition Info & Score -->
            <div class="xl:col-span-2 space-y-8">
              <!-- Competition Overview -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-500" in:slide={{ duration: 600, delay: 300 }}>
                <div class="flex items-center space-x-4 mb-6">
                  <div class="p-3 bg-gradient-to-r from-cta-pink to-pink-600 rounded-xl shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-gt-walsheim-bold text-gray-900">{competition.title}</h2>
                </div>
                
                <p class="text-gray-600 leading-relaxed mb-6">{competition.description}</p>
                
                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 class="text-lg font-gt-walsheim-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Application Timeline</span>
                  </h3>
                  <p class="text-gray-600">{competition.applicationTime}</p>
                </div>
              </div>
              
              <!-- Eligibility Score Card -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-500" in:slide={{ duration: 600, delay: 500 }}>
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-gt-walsheim-bold text-gray-900">Your Eligibility Score</h3>
                  <button 
                    on:click={downloadScoring}
                    class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 shadow-sm group"
                    title="Download scoring breakdown"
                  >
                    <svg class="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                  </button>
                </div>
                
                <div class="bg-gradient-to-r {getOverallScoreColor(eligibilityScore)} rounded-2xl p-8 border relative overflow-hidden">
                  <div class="absolute inset-0 bg-white/10"></div>
                  <div class="relative text-center">
                    <div class="text-5xl font-gt-walsheim-bold text-white mb-3">{eligibilityScore}%</div>
                    <p class="text-white/90 text-lg font-medium">Overall Match Score</p>
                    <div class="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        class="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                        style="width: {eligibilityScore}%"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Scoring Visualization -->
            <div class="xl:col-span-3">
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-500" in:slide={{ duration: 600, delay: 400 }}>
                <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-8 text-center">Grant Scoring Assessment</h2>
                
                <!-- Interactive Spider Chart -->
                <div class="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
                  <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-6 text-center">Performance Radar</h3>
                  
                  {#if spiderData}
                    <div class="flex justify-center">
                      <svg width="400" height="400" viewBox="0 0 400 400" class="max-w-full h-auto">
                        <!-- Grid lines -->
                        {#each spiderData.gridLines as gridLine, i}
                          <polygon 
                            points={gridLine} 
                            fill="none" 
                            stroke="rgba(0,0,0,0.1)" 
                            stroke-width="1"
                          />
                        {/each}
                        
                        <!-- Axis lines -->
                        {#each spiderData.axisLines as axis}
                          <line 
                            x1={axis.x1} 
                            y1={axis.y1} 
                            x2={axis.x2} 
                            y2={axis.y2} 
                            stroke="rgba(0,0,0,0.2)" 
                            stroke-width="1"
                          />
                        {/each}
                        
                        <!-- Data polygon -->
                        <polygon 
                          points={spiderData.dataPolygon} 
                          fill="url(#scoreGradient)" 
                          stroke="#C3095A" 
                          stroke-width="3"
                          opacity="0.7"
                        />
                        
                        <!-- Data points -->
                        {#each spiderData.dataPoints as point}
                          <circle 
                            cx={point.x} 
                            cy={point.y} 
                            r="6" 
                            fill="#C3095A" 
                            stroke="white" 
                            stroke-width="2"
                            class="hover:r-8 transition-all duration-300 cursor-pointer"
                          >
                            <title>{point.name}: {point.score}%</title>
                          </circle>
                        {/each}
                        
                        <!-- Labels -->
                        {#each spiderData.labelPoints as label}
                          <text 
                            x={label.x} 
                            y={label.y} 
                            text-anchor="middle" 
                            dy="0.35em" 
                            fill="#374151" 
                            font-size="12" 
                            font-weight="600"
                            class="font-gt-walsheim-bold"
                          >
                            {label.name}
                          </text>
                        {/each}
                        
                        <!-- Gradient definition -->
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#2D4978;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#C3095A;stop-opacity:0.6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  {/if}
                </div>
                
                <!-- Scoring Criteria Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {#each competition.scoringCriteria as criteria, index}
                    <div 
                      class="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-500 hover:scale-[1.02] group"
                      in:slide={{ duration: 500, delay: index * 150 }}
                    >
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="font-gt-walsheim-bold text-gray-900 group-hover:text-gray-700">{criteria.name}</h3>
                        <span class="text-2xl font-gt-walsheim-bold {getScoreColor(criteria.score)}">{criteria.score}%</span>
                      </div>
                      
                      <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          class="h-full bg-gradient-to-r from-primary-blue via-cta-pink to-pink-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                          style="width: {criteria.score}%"
                        ></div>
                      </div>
                      
                      <div class="mt-3 flex justify-between text-sm text-gray-500">
                        <span>0</span>
                        <span>{criteria.maxScore}</span>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center gap-6 mb-16" in:fade={{ duration: 600, delay: 800 }}>
            <button 
              on:click={startApplication}
              class="px-10 py-5 bg-gradient-to-r from-cta-pink to-pink-600 text-white font-gt-walsheim-bold rounded-2xl hover:shadow-2xl hover:shadow-cta-pink/30 transition-all duration-500 hover:scale-105 text-lg shadow-lg"
            >
              Start Your Application
            </button>
            
            <button 
              on:click={toggleSave}
              class="px-10 py-5 bg-white text-gray-700 font-gt-walsheim-bold rounded-2xl border border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all duration-500 hover:scale-105 text-lg shadow-sm"
            >
              {isSaved ? 'Unsave' : 'Save'} Competition
            </button>
          </div>

          <!-- Writers Section -->
          {#if relevantWriters.length > 0}
            <div in:slide={{ duration: 600, delay: 900 }}>
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-500">
                <div class="text-center mb-12">
                  <div class="flex items-center justify-center space-x-4 mb-6">
                    <div class="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                      </svg>
                    </div>
                    <h2 class="text-3xl font-gt-walsheim-bold text-gray-900">Expert Writers for You</h2>
                  </div>
                  <p class="text-gray-600 text-lg max-w-2xl mx-auto">Connect with specialized grant writers who have proven success in {competition.sector.toLowerCase()} projects</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {#each relevantWriters as writer, index}
                    <div 
                      in:slide={{ duration: 500, delay: index * 150 }}
                      class="cursor-pointer transform hover:scale-105 transition-all duration-300"
                      on:click={() => viewWriterProfile(writer.id)}
                      role="button"
                      tabindex="0"
                      on:keydown={(e) => e.key === 'Enter' && viewWriterProfile(writer.id)}
                    >
                      <GrantWriterCard grantWriter={writer} />
                    </div>
                  {/each}
                </div>
                

              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div> 