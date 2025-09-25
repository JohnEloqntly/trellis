<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  import GrantWriterCard from '$lib/components/GrantWriterCard.svelte';
  import { grantWriters } from '$lib/data/grant-writers.js';

  // Anonymize writer names to show only first letter + qualification
  function anonymizeName(fullName: string): string {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      const title = parts[0]; // Dr., Prof., etc.
      const firstLetter = parts[1][0]; // First letter of first name
      return `${title} ${firstLetter}`;
    }
    return fullName[0]; // Fallback to just first letter
  }
  
  let mounted = false;
  let competitionId: string;
  let competition: any = null;
  let isSaved = false;
  let eligibilityScore = 0;
  let showSpiderChart = false;
  let isStartingApplication = false;
  let activeSection = 'competitions';
  let saveAnimation = false;
  let showSaveSuccess = false;
  let sidebarExpanded = false;
  
  // Handle section change from sidebar
  function handleSectionChange(section: string) {
    if (section === 'competitions') {
      // Stay on current page since we're already viewing a competition
      return;
    } else {
      // Navigate to portal with the selected section
      goto(`/portal?section=${section}`);
    }
  }
  
  // Portal competition data for reference
  const portalCompetitions = [
    { id: 1, title: 'Innovate UK Smart Grants Round X', funder: 'Innovate UK', amount: '£100k - £2M', deadline: '2024-03-15', sector: 'Technology', status: 'open', description: 'Game-changing and commercially viable R&D innovations that can significantly impact the UK economy.' },
    { id: 2, title: 'EPSRC Impact Acceleration Round', funder: 'EPSRC', amount: '£25k - £500k', deadline: '2024-02-28', sector: 'Research', status: 'closing-soon', description: 'Accelerate the economic and societal impact of EPSRC research through knowledge exchange.' },
    { id: 3, title: 'Wellcome Trust Innovator Awards', funder: 'Wellcome Trust', amount: '£100k - £650k', deadline: '2024-05-15', sector: 'Healthcare', status: 'open', description: 'Supporting innovations in health technology and digital health solutions.' },
    { id: 4, title: 'UKRI Future Leaders Fellowship', funder: 'UKRI', amount: '£1M - £1.5M', deadline: '2024-06-01', sector: 'Research', status: 'open', description: 'Supporting early career researchers to become research leaders.' },
    { id: 5, title: 'Clean Growth Fund', funder: 'Department for Energy Security', amount: '£50k - £1M', deadline: '2024-04-30', sector: 'Clean Energy', status: 'open', description: 'Supporting innovations that contribute to net zero and sustainable development goals.' },
    { id: 6, title: 'Digital Health Technology Catalyst', funder: 'NHS Innovation Accelerator', amount: '£75k - £500k', deadline: '2024-05-20', sector: 'Healthcare', status: 'open', description: 'Accelerating digital health innovations that improve patient outcomes.' },
    { id: 7, title: 'Space Technology Demonstrator', funder: 'UK Space Agency', amount: '£200k - £2M', deadline: '2024-07-15', sector: 'Space Technology', status: 'open', description: 'Demonstrating cutting-edge space technologies for future missions.' },
    { id: 8, title: 'AI for Good Challenge', funder: 'Alan Turing Institute', amount: '£30k - £300k', deadline: '2024-04-10', sector: 'Artificial Intelligence', status: 'closing-soon', description: 'Using artificial intelligence to address societal challenges.' },
    { id: 9, title: 'NERC Innovation Fellowship', funder: 'Natural Environment Research Council', amount: '£500k - £1.2M', deadline: '2024-06-30', sector: 'Environment', status: 'open', description: 'Supporting innovative environmental research with commercial potential.' },
    { id: 10, title: 'Horizon Europe EIC Accelerator', funder: 'European Innovation Council', amount: '£500k - £15M', deadline: '2024-05-08', sector: 'Technology', status: 'open', description: 'Breakthrough innovations with market-creating potential.' },
    { id: 11, title: 'BBSRC Follow-on Fund', funder: 'Biotechnology & Biological Sciences Research Council', amount: '£10k - £100k', deadline: '2024-03-20', sector: 'Biotechnology', status: 'closing-soon', description: 'Commercialising biotechnology research discoveries.' },
    { id: 12, title: 'Cyber Security Academic Startup Accelerator', funder: 'NCSC & GCHQ', amount: '£50k - £250k', deadline: '2024-04-15', sector: 'Cyber Security', status: 'open', description: 'Accelerating cyber security innovations from academia.' },
    { id: 13, title: 'Creative Industries Clusters Programme', funder: 'Arts & Humanities Research Council', amount: '£3M - £10M', deadline: '2024-07-12', sector: 'Creative Industries', status: 'open', description: 'Building world-leading creative industries clusters.' },
    { id: 14, title: 'Net Zero Innovation Portfolio', funder: 'Department for Business, Energy & Industrial Strategy', amount: '£100k - £5M', deadline: '2024-05-30', sector: 'Clean Energy', status: 'open', description: 'Innovations to achieve net zero carbon emissions.' },
    { id: 15, title: 'Future Flight Challenge', funder: 'Connected & Autonomous Vehicles', amount: '£2M - £15M', deadline: '2024-08-01', sector: 'Aerospace', status: 'open', description: 'Revolutionary aviation and aerospace technologies.' },
    { id: 16, title: 'Medicines Discovery Catapult', funder: 'Medicines Discovery Catapult', amount: '£150k - £1M', deadline: '2024-04-25', sector: 'Pharmaceuticals', status: 'open', description: 'Accelerating medicines discovery and development.' },
    { id: 17, title: 'Industrial Strategy Challenge Fund', funder: 'UK Research and Innovation', amount: '£500k - £20M', deadline: '2024-06-15', sector: 'Industrial', status: 'open', description: 'Tackling major industrial and societal challenges.' },
    { id: 18, title: 'AgriTech Catalyst', funder: 'Innovate UK & BBSRC', amount: '£25k - £2M', deadline: '2024-05-10', sector: 'Agriculture', status: 'open', description: 'Innovations in agriculture and food production.' },
    { id: 19, title: 'Rail Innovation Competition', funder: 'Department for Transport', amount: '£100k - £3M', deadline: '2024-07-08', sector: 'Transport', status: 'open', description: 'Next generation rail transport innovations.' },
    { id: 20, title: 'Quantum Technologies Challenge', funder: 'EPSRC & Quantum Computing & Simulation Hub', amount: '£1M - £10M', deadline: '2024-09-20', sector: 'Quantum Technology', status: 'open', description: 'Breakthrough quantum technologies for commercial application.' }
  ];

  // Writer assignment mapping for competitions
  const competitionWriterMapping = {
    'Healthcare': [1, 3], // Dr. Sarah Johnson, Dr. Emma Williams
    'Technology': [2, 6], // Prof. Michael Chen, Dr. Robert Kumar  
    'Research': [2, 4], // Prof. Michael Chen, Dr. James Rodriguez
    'Clean Energy': [3, 6], // Dr. Emma Williams, Dr. Robert Kumar
    'Space Technology': [2, 6], // Prof. Michael Chen, Dr. Robert Kumar
    'Artificial Intelligence': [2, 5], // Prof. Michael Chen, Dr. Lisa Thompson
    'Environment': [3, 1], // Dr. Emma Williams, Dr. Sarah Johnson
    'Biotechnology': [1, 6], // Dr. Sarah Johnson, Dr. Robert Kumar
    'Cyber Security': [2, 5], // Prof. Michael Chen, Dr. Lisa Thompson
    'Creative Industries': [4, 5], // Dr. James Rodriguez, Dr. Lisa Thompson
    'Aerospace': [6, 2], // Dr. Robert Kumar, Prof. Michael Chen
    'Pharmaceuticals': [1, 3], // Dr. Sarah Johnson, Dr. Emma Williams
    'Industrial': [6, 2], // Dr. Robert Kumar, Prof. Michael Chen
    'Agriculture': [3, 1], // Dr. Emma Williams, Dr. Sarah Johnson
    'Transport': [6, 2], // Dr. Robert Kumar, Prof. Michael Chen
    'Quantum Technology': [2, 6] // Prof. Michael Chen, Dr. Robert Kumar
  };

  // Generate comprehensive competition data
  function generateCompetitionData(comp: any) {
    const baseScores = [75, 80, 85, 90, 95];
    const randomScores = () => baseScores.map(base => base + Math.floor(Math.random() * 15));
    const scores = randomScores();
    
    // Get assigned writer IDs for this competition's sector
    const assignedWriterIds = competitionWriterMapping[comp.sector as keyof typeof competitionWriterMapping] || [1, 2]; // Default fallback
    
    return {
      id: comp.id,
      title: comp.title,
      funder: comp.funder,
      amount: comp.amount,
      deadline: comp.deadline,
      sector: comp.sector,
      status: comp.status,
      description: comp.description,
      plainEnglish: `This ${comp.sector.toLowerCase()} funding program supports innovative projects that can create significant impact. It's designed for organizations with ${comp.sector.toLowerCase()} expertise looking to develop breakthrough solutions.`,
      scope: [
        `${comp.sector} innovation projects`,
        'Research and development activities',
        'Commercial viability demonstrations',
        'Technology transfer opportunities',
        'Market-ready innovations'
      ],
      keyBenefits: [
        `Funding up to ${comp.amount.split(' - ')[1] || comp.amount}`,
        'Expert mentorship and guidance',
        'Access to professional networks',
        'Business development support',
        'Fast-track to market opportunities'
      ],
      applicationTime: '3-5 weeks typical application time',
      successTips: [
        'Clear project objectives and timeline',
        'Strong team with relevant expertise',
        'Evidence of market demand',
        'Realistic budget and milestones',
        'Innovation and commercial potential'
      ],
      eligibility: [
        'UK-based organizations',
        `${comp.sector} sector experience`,
        'Innovation-focused projects',
        'Clear commercial pathway',
        'Strong project team'
      ],
      applicationProcess: [
        'Submit initial application',
        'Technical and commercial review',
        'Expert panel assessment',
        'Due diligence process',
        'Final funding decision'
      ],
      scoringCriteria: [
        { name: 'Eligibility', score: scores[0], maxScore: 100, description: 'Meeting programme requirements and criteria' },
        { name: 'Innovation Strength', score: scores[1], maxScore: 100, description: 'Technical novelty and competitive advantage' },
        { name: 'Market Traction', score: scores[2], maxScore: 100, description: 'Customer validation and market demand' },
        { name: 'Team Capacity', score: scores[3], maxScore: 100, description: 'Skills, experience and delivery capability' },
        { name: 'Project Feasibility', score: scores[4], maxScore: 100, description: 'Technical and commercial viability' },
        { name: 'Impact', score: scores[0] + 5, maxScore: 100, description: 'Economic, social and environmental benefits' }
      ],
      relatedCompetitions: portalCompetitions
        .filter(c => c.id !== comp.id && (c.sector === comp.sector || Math.random() > 0.5))
        .slice(0, 3)
        .map(c => ({ id: c.id, title: c.title, funder: c.funder, amount: c.amount, matchScore: 70 + Math.floor(Math.random() * 25) })),
      assignedWriters: assignedWriterIds // Store assigned writer IDs
    };
  }

  // Create comprehensive competition data using dynamic generation
  const competitionData: Record<string, any> = {};
  
  // Generate data for all competitions
  portalCompetitions.forEach(comp => {
    competitionData[comp.id] = generateCompetitionData(comp);
  });
  
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
    isSaved = savedCompetitions.includes(parseInt(competitionId));
  });
  
  function goBack() {
    const fromSection = $page.url.searchParams.get('from');
    if (fromSection) {
      goto(`/portal?section=${fromSection}`);
    } else {
    goto('/portal');
    }
  }
  
  function toggleSave() {
    const savedCompetitions = JSON.parse(localStorage.getItem('savedCompetitions') || '[]');
    const competitionIdNum = parseInt(competitionId);
    if (isSaved) {
      const updated = savedCompetitions.filter((id: number) => id !== competitionIdNum);
      localStorage.setItem('savedCompetitions', JSON.stringify(updated));
      isSaved = false;
    } else {
      savedCompetitions.push(competitionIdNum);
      localStorage.setItem('savedCompetitions', JSON.stringify(savedCompetitions));
      isSaved = true;
      
      // Trigger encouraging animations
      saveAnimation = true;
      showSaveSuccess = true;
      
      // Reset animations after delay
      setTimeout(() => {
        saveAnimation = false;
      }, 600);
      
      setTimeout(() => {
        showSaveSuccess = false;
      }, 3000);
    }
  }
  
  function startApplication() {
    isStartingApplication = true;
    // Simulate application start
    setTimeout(() => {
      alert('Redirecting to application portal...');
      isStartingApplication = false;
    }, 2000);
  }
  
  function toggleSpiderChart() {
    showSpiderChart = !showSpiderChart;
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'open': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'closing-soon': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }
  
  function getScoreColor(score: number) {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  }
  
  function getOverallScoreColor(score: number) {
    if (score >= 85) return 'from-emerald-500 to-emerald-600';
    if (score >= 70) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Get assigned writers for this competition
  $: relevantWriters = competition?.assignedWriters 
    ? grantWriters.filter(writer => competition.assignedWriters.includes(writer.id))
    : [];
  
  // Spider chart calculation
  function generateSpiderChart(criteria: any[]) {
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 120;
    const angles = criteria.map((_: any, i: number) => (i * 2 * Math.PI) / criteria.length - Math.PI / 2);
    
    const dataPoints = criteria.map((item: any, i: number) => {
      const radius = (item.score / 100) * maxRadius;
      const x = centerX + radius * Math.cos(angles[i]);
      const y = centerY + radius * Math.sin(angles[i]);
      return { x, y, score: item.score, name: item.name };
    });
    
    const labelPoints = criteria.map((item: any, i: number) => {
      const radius = maxRadius + 50; // Increased from 35 to 50 for more space
      const x = centerX + radius * Math.cos(angles[i]);
      const y = centerY + radius * Math.sin(angles[i]);
      return { x, y, name: item.name };
    });
    
    // Create grid lines
    const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0].map(factor => {
      const points = angles.map((angle: number) => {
        const radius = maxRadius * factor;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return points;
    });
    
    // Create axis lines
    const axisLines = angles.map((angle: number) => {
      const x = centerX + maxRadius * Math.cos(angle);
      const y = centerY + maxRadius * Math.sin(angle);
      return { x1: centerX, y1: centerY, x2: x, y2: y };
    });
    
    // Create data polygon
    const dataPolygon = dataPoints.map((p: any) => `${p.x},${p.y}`).join(' ');
    
    return { dataPoints, labelPoints, gridLines, axisLines, dataPolygon };
  }
  
  $: spiderData = competition ? generateSpiderChart(competition.scoringCriteria) : null;
</script>

<svelte:head>
  <title>{competition?.title || 'Competition'} - Trellis</title>
  <meta name="description" content="Complete analysis and eligibility assessment for {competition?.title}" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  {#if mounted && competition}
    <!-- Top App Bar (behind sidebar) -->
    <TopAppBar sidebarExpanded={sidebarExpanded} />
    
    <div class="flex h-screen">
      <!-- Collapsed Sidebar -->
      <Sidebar 
        bind:expanded={sidebarExpanded} 
        {activeSection} 
        onSectionChange={handleSectionChange}
      />
      
      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-8 pt-24">
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
              <span class="font-gt-walsheim-bold text-lg">Back to Portal</span>
            </button>
          </div>

          <!-- Hero Section with Match Score -->
          <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8" in:slide={{ duration: 600, delay: 200 }}>
            <div class="relative bg-gradient-to-r from-gray-50 to-gray-100 p-8">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-4 mb-4">
                    <span class="px-4 py-2 rounded-full text-sm font-medium border {getStatusColor(competition.status)}">
                      {competition.status.replace('-', ' ')}
                    </span>
                    <span class="text-gray-500">•</span>
                    <span class="text-gray-600 font-medium">{competition.funder}</span>
                  </div>
                  <h1 class="text-4xl font-gt-walsheim-bold text-gray-900 mb-4">{competition.title}</h1>
                  <p class="text-xl text-gray-600 leading-relaxed mb-6">{competition.description}</p>
                  
                  <!-- Key Info Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                      <div class="flex items-center space-x-2 mb-2">
                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                        <span class="text-sm font-medium text-gray-700">£</span>
                      </div>
                      <p class="text-lg font-gt-walsheim-bold text-emerald-600">{competition.amount}</p>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                      <div class="flex items-center space-x-2 mb-2">
                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-sm font-medium text-gray-700">Deadline</span>
                      </div>
                      <p class="text-lg font-gt-walsheim-bold text-amber-600">{formatDate(competition.deadline)}</p>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                      <div class="flex items-center space-x-2 mb-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-sm font-medium text-gray-700">Application Time</span>
                      </div>
                      <p class="text-lg font-gt-walsheim-bold text-blue-600">{competition.applicationTime}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Match Score Card -->
                <div class="ml-8">
                  <div class="bg-gradient-to-br {getOverallScoreColor(eligibilityScore)} rounded-2xl p-6 text-white min-w-[200px] text-center">
                    <div class="text-3xl font-gt-walsheim-bold mb-2">{eligibilityScore}%</div>
                    <p class="text-white/90 font-medium">Your Match Score</p>
                    <div class="mt-3 w-full bg-white/20 rounded-full h-2">
                      <div 
                        class="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                        style="width: {eligibilityScore}%"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <!-- Left Column - Competition Details -->
            <div class="xl:col-span-2 space-y-8">
              
              <!-- Plain English Explanation -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 300 }}>
                <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span>The Competition in Plain English</span>
                </h2>
                <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <p class="text-lg text-gray-700 leading-relaxed">{competition.plainEnglish}</p>
                </div>
              </div>

              <!-- Competition Scope -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 400 }}>
                <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <span>Competition Scope</span>
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-lg font-gt-walsheim-bold text-gray-900 mb-4">What They're Looking For</h3>
                    <ul class="space-y-3">
                      {#each competition.scope as item}
                        <li class="flex items-start space-x-3">
                          <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-gray-700">{item}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                  <div>
                    <h3 class="text-lg font-gt-walsheim-bold text-gray-900 mb-4">Key Benefits</h3>
                    <ul class="space-y-3">
                      {#each competition.keyBenefits as benefit}
                        <li class="flex items-start space-x-3">
                          <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span class="text-gray-700">{benefit}</span>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Your Match Analysis -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 500 }}>
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 flex items-center space-x-3">
                    <div class="p-2 bg-gradient-to-r from-cta-pink to-pink-600 rounded-lg">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"/>
                      </svg>
                    </div>
                    <span>Your Match Analysis</span>
                  </h2>
                  <button 
                    on:click={toggleSpiderChart}
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 text-sm font-medium text-gray-700"
                  >
                    {showSpiderChart ? 'Hide' : 'Show'} Detailed Metrics
                  </button>
                </div>

                <!-- Personalized Match Explanation -->
                <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-6">
                  <p class="text-gray-700 leading-relaxed">
                    Based on your project profile, this competition appears to be a strong match for several key reasons. Your {competition?.sector?.toLowerCase() || 'technology'} focus aligns well with the funding priorities, and your innovation maturity level suggests you're at the right development stage. The funding amount and timeline also match your project's scale and requirements, making this an opportunity worth pursuing.
                  </p>
                </div>
                
                <!-- Spider Chart (Always Visible) -->
                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
                  <h3 class="text-lg font-gt-walsheim-bold text-gray-900 mb-4 text-center">How You Stack Up</h3>
                  {#if spiderData}
                    <div class="flex justify-center">
                      <svg width="400" height="400" viewBox="0 0 400 400" class="max-w-full h-auto">
                        <!-- Grid lines -->
                        {#each spiderData.gridLines as gridLine}
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
                          stroke-width="2"
                          opacity="0.7"
                        />
                        
                        <!-- Data points -->
                        {#each spiderData.dataPoints as point}
                          <circle 
                            cx={point.x} 
                            cy={point.y} 
                            r="4" 
                            fill="#C3095A" 
                            stroke="white" 
                            stroke-width="2"
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
                            font-size="14" 
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
                
                <!-- Collapsible Detailed Metrics -->
                {#if showSpiderChart}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" transition:slide={{ duration: 300 }}>
                    {#each competition.scoringCriteria as criteria, index}
                      <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div class="flex items-center justify-between mb-2">
                          <h3 class="font-gt-walsheim-bold text-gray-900">{criteria.name}</h3>
                          <span class="text-lg font-gt-walsheim-bold {getScoreColor(criteria.score)}">{criteria.score}%</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">{criteria.description}</p>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            class="h-full bg-gradient-to-r from-primary-blue to-cta-pink rounded-full transition-all duration-1000 ease-out"
                            style="width: {criteria.score}%"
                          ></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>

              <!-- Success Tips -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 600 }}>
                <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <span>Personalised Recommendations</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each competition.successTips as tip, index}
                    <div class="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span class="text-gray-700">{tip}</span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <!-- Right Column - Actions & Recommendations -->
            <div class="space-y-8">
              
              <!-- Action Card -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 400 }}>
                <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-6">Ready to Apply?</h3>
                
                <div class="space-y-4">
                  <button 
                    on:click={startApplication}
                    disabled={isStartingApplication}
                    class="w-full bg-gradient-to-r from-cta-pink to-pink-600 text-white font-gt-walsheim-bold py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {#if isStartingApplication}
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Starting Application...</span>
                    {:else}
                      <span>Start Your Application</span>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    {/if}
                  </button>
                  
                  <button 
                    on:click={toggleSave}
                    class="w-full font-gt-walsheim-bold py-3 rounded-xl transition-all duration-300 relative overflow-hidden"
                    class:bg-gradient-to-r={isSaved}
                    class:from-emerald-500={isSaved}
                    class:to-emerald-600={isSaved}
                    class:text-white={isSaved}
                    class:bg-gray-100={!isSaved}
                    class:text-gray-700={!isSaved}
                    class:hover:bg-gray-200={!isSaved}
                    class:animate-pulse={saveAnimation}
                    class:scale-105={saveAnimation}
                    class:shadow-lg={saveAnimation}
                  >
                    <div class="flex items-center justify-center space-x-2">
                      {#if isSaved}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                        <span>Saved!</span>
                      {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                        <span>Save Competition</span>
                      {/if}
                    </div>
                    
                    <!-- Encouraging particles effect -->
                    {#if saveAnimation}
                      <div class="absolute inset-0 pointer-events-none">
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          {#each Array(6) as _, i}
                            <div 
                              class="absolute w-2 h-2 bg-white rounded-full animate-ping"
                              style="
                                animation-delay: {i * 100}ms;
                                left: {Math.cos(i * 60 * Math.PI / 180) * 20}px;
                                top: {Math.sin(i * 60 * Math.PI / 180) * 20}px;
                              "
                            ></div>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </button>
                </div>
                
                <!-- Success Message -->
                {#if showSaveSuccess}
                  <div class="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100" in:fly={{ y: -20, duration: 300 }}>
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-emerald-900">Great choice!</p>
                        <p class="text-sm text-emerald-700">Competition saved to your dashboard. You're one step closer to funding!</p>
                      </div>
                    </div>
                  </div>
                {/if}

                <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div class="flex items-start space-x-3">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-blue-900">Need Help?</p>
                      <p class="text-sm text-blue-700">Our grant writers below can guide you through the application process.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recommended Writers -->
              {#if relevantWriters.length > 0}
                <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 500 }}>
                  <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <span>Expert Writers</span>
                  </h3>
                  
                  <div class="space-y-4">
                    {#each relevantWriters as writer, index}
                      <div 
                        class="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                        on:click={() => goto(`/writer/${writer.id}?from=competition&competitionId=${competitionId}`)}
                        in:slide={{ duration: 300, delay: index * 100 }}
                      >
                        <div class="flex items-center space-x-3 mb-3">
                          <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 relative">
                            {#if writer.avatar && !writer.avatar.includes('placeholder')}
                              <img 
                                src={writer.avatar} 
                              alt={anonymizeName(writer.name)}
                              class="w-full h-full object-cover filter blur-sm brightness-75 contrast-125 saturate-50"
                                on:error={() => {}}
                              />
                            <div class="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-cta-pink/20 rounded-full"></div>
                            {:else}
                              <div class="w-full h-full bg-gradient-to-br from-primary-blue to-cta-pink flex items-center justify-center">
                                <span class="text-white font-gt-walsheim-bold text-sm">{anonymizeName(writer.name).split(' ').map(n => n[0]).join('')}</span>
                              </div>
                            {/if}
                          </div>
                          <div class="flex-1">
                            <h4 class="font-gt-walsheim-bold text-gray-900">{anonymizeName(writer.name)}</h4>
                            <p class="text-sm text-gray-600">{writer.title}</p>
                          </div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-600">
                          <span>{writer.successRate}% success rate</span>
                          <span>{writer.sector}</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Related Competitions -->
              <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 600 }}>
                <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <span>Similar Opportunities</span>
                </h3>
                
                <div class="space-y-3">
                  {#each competition.relatedCompetitions as related, index}
                    <div 
                      class="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                      on:click={() => goto(`/competition/${related.id}`)}
                      in:slide={{ duration: 300, delay: index * 100 }}
                    >
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 pr-4">
                          <h4 class="font-gt-walsheim-bold text-gray-900 text-sm leading-tight mb-2">{related.title}</h4>
                          <p class="text-xs text-gray-600 mb-1">{related.funder}</p>
                          <p class="text-xs font-medium text-primary-blue">{related.amount}</p>
                        </div>
                        <div class="flex-shrink-0">
                          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-center min-w-[4rem]">
                            <div class="text-sm font-gt-walsheim-bold">{related.matchScore}%</div>
                            <div class="text-xs opacity-90">match</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
          <!-- Match Feedback Section -->
          <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mt-8" in:slide={{ duration: 500, delay: 700 }}>
            <div class="text-center">
              <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-4">How was this match?</h2>
              <p class="text-gray-600 mb-8">Help us improve our recommendations by letting us know if this was a good fit</p>
              
              <div class="flex items-center justify-center space-x-8">
                <!-- Good Match -->
                <button class="flex flex-col items-center space-y-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 group">
                  <div class="w-16 h-16 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors duration-300">
                    <svg class="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center">
                    <h3 class="font-gt-walsheim-bold text-gray-900 mb-1">Good Match</h3>
                    <p class="text-sm text-gray-600">This competition fits my project well</p>
                  </div>
                </button>

                <!-- Bad Match -->
                <button class="flex flex-col items-center space-y-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 group">
                  <div class="w-16 h-16 bg-red-100 group-hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-300">
                    <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center">
                    <h3 class="font-gt-walsheim-bold text-gray-900 mb-1">Poor Match</h3>
                    <p class="text-sm text-gray-600">This doesn't suit my project</p>
                  </div>
                </button>
              </div>
              
              <p class="text-xs text-gray-500 mt-6">Your feedback helps us improve future recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 