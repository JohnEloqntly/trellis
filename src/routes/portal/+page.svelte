<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade, slide } from 'svelte/transition';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import TopAppBar from '$lib/components/TopAppBar.svelte';
  
  let mounted = false;
  let activeSection = 'matches';
  let savedCompetitions: number[] = [];
  let savedWriters: number[] = [];
  let sidebarExpanded = true;
  
  // Handle section change from sidebar
  function handleSectionChange(section: string) {
    activeSection = section;
  }
  
  // Expanded grant data - significantly more competitions
  const allGrants = [
    {
      id: 1,
      title: 'Innovate UK Smart Grants Round X',
      funder: 'Innovate UK',
      amount: '£100k - £2M',
      deadline: '2024-03-15',
      status: 'open',
      matchScore: 92,
      description: 'Game-changing and commercially viable R&D innovations that can significantly impact the UK economy.',
      sector: 'Technology',
      eligibility: ['UK-based SMEs', 'Research organizations', 'Collaborative projects'],
      tags: ['R&D', 'Innovation', 'Technology']
    },
    {
      id: 2,
      title: 'EPSRC Impact Acceleration Round',
      funder: 'EPSRC',
      amount: '£25k - £500k',
      deadline: '2024-02-28',
      status: 'closing-soon',
      matchScore: 87,
      description: 'Accelerate the economic and societal impact of EPSRC research through knowledge exchange.',
      sector: 'Research',
      eligibility: ['Universities', 'Research institutions', 'Industry partnerships'],
      tags: ['Impact', 'Knowledge Exchange', 'Research Translation']
    },
    {
      id: 3,
      title: 'Wellcome Trust Innovator Awards',
      funder: 'Wellcome Trust',
      amount: '£100k - £650k',
      deadline: '2024-05-15',
      status: 'open',
      matchScore: 78,
      description: 'Supporting innovations in health technology and digital health solutions.',
      sector: 'Healthcare',
      eligibility: ['UK organizations', 'International collaborations welcome'],
      tags: ['Health Tech', 'Digital Health', 'Innovation']
    },
    {
      id: 4,
      title: 'UKRI Future Leaders Fellowship',
      funder: 'UKRI',
      amount: '£1M - £1.5M',
      deadline: '2024-06-01',
      status: 'open',
      matchScore: 85,
      description: 'Supporting early career researchers to become research leaders.',
      sector: 'Research',
      eligibility: ['Early career researchers', 'Independent research capability'],
      tags: ['Leadership', 'Research', 'Career Development']
    },
    {
      id: 5,
      title: 'Clean Growth Fund',
      funder: 'Department for Energy Security',
      amount: '£50k - £1M',
      deadline: '2024-04-30',
      status: 'open',
      matchScore: 89,
      description: 'Supporting innovations that contribute to net zero and sustainable development goals.',
      sector: 'Clean Energy',
      eligibility: ['All UK organizations', 'International partnerships welcome'],
      tags: ['Sustainability', 'Net Zero', 'Green Tech']
    },
    {
      id: 6,
      title: 'Digital Health Technology Catalyst',
      funder: 'NHS Innovation Accelerator',
      amount: '£75k - £500k',
      deadline: '2024-05-20',
      status: 'open',
      matchScore: 91,
      description: 'Accelerating digital health innovations that improve patient outcomes.',
      sector: 'Healthcare',
      eligibility: ['Health tech companies', 'NHS partnerships'],
      tags: ['Digital Health', 'NHS', 'Patient Care']
    },
    {
      id: 7,
      title: 'Space Technology Demonstrator',
      funder: 'UK Space Agency',
      amount: '£200k - £2M',
      deadline: '2024-07-15',
      status: 'open',
      matchScore: 82,
      description: 'Demonstrating cutting-edge space technologies for future missions.',
      sector: 'Space Technology',
      eligibility: ['Space technology companies', 'Research institutions'],
      tags: ['Space', 'Technology', 'Innovation']
    },
    {
      id: 8,
      title: 'AI for Good Challenge',
      funder: 'Alan Turing Institute',
      amount: '£30k - £300k',
      deadline: '2024-04-10',
      status: 'closing-soon',
      matchScore: 94,
      description: 'Using artificial intelligence to address societal challenges.',
      sector: 'Artificial Intelligence',
      eligibility: ['AI researchers', 'Social impact organizations'],
      tags: ['AI', 'Social Impact', 'Machine Learning']
    },
    {
      id: 9,
      title: 'NERC Innovation Fellowship',
      funder: 'Natural Environment Research Council',
      amount: '£500k - £1.2M',
      deadline: '2024-06-30',
      status: 'open',
      matchScore: 86,
      description: 'Supporting innovative environmental research with commercial potential.',
      sector: 'Environment',
      eligibility: ['Early career researchers', 'Environmental scientists'],
      tags: ['Environment', 'Innovation', 'Climate']
    },
    {
      id: 10,
      title: 'Horizon Europe EIC Accelerator',
      funder: 'European Innovation Council',
      amount: '£500k - £15M',
      deadline: '2024-05-08',
      status: 'open',
      matchScore: 91,
      description: 'Breakthrough innovations with market-creating potential.',
      sector: 'Technology',
      eligibility: ['SMEs', 'Deep tech startups', 'EU-based companies'],
      tags: ['Deep Tech', 'Scale-up', 'European']
    },
    {
      id: 11,
      title: 'BBSRC Follow-on Fund',
      funder: 'Biotechnology & Biological Sciences Research Council',
      amount: '£10k - £100k',
      deadline: '2024-03-20',
      status: 'closing-soon',
      matchScore: 75,
      description: 'Commercialising biotechnology research discoveries.',
      sector: 'Biotechnology',
      eligibility: ['Universities', 'Research institutes', 'Biotech startups'],
      tags: ['Biotechnology', 'Commercialisation', 'Life Sciences']
    },
    {
      id: 12,
      title: 'Cyber Security Academic Startup Accelerator',
      funder: 'NCSC & GCHQ',
      amount: '£50k - £250k',
      deadline: '2024-04-15',
      status: 'open',
      matchScore: 83,
      description: 'Accelerating cyber security innovations from academia.',
      sector: 'Cyber Security',
      eligibility: ['Academic spinouts', 'Cyber security startups', 'Universities'],
      tags: ['Cyber Security', 'Defence', 'Academic Spinout']
    },
    {
      id: 13,
      title: 'Creative Industries Clusters Programme',
      funder: 'Arts & Humanities Research Council',
      amount: '£3M - £10M',
      deadline: '2024-07-12',
      status: 'open',
      matchScore: 69,
      description: 'Building world-leading creative industries clusters.',
      sector: 'Creative Industries',
      eligibility: ['Creative businesses', 'Universities', 'Local authorities'],
      tags: ['Creative', 'Clusters', 'Innovation']
    },
    {
      id: 14,
      title: 'Net Zero Innovation Portfolio',
      funder: 'Department for Business, Energy & Industrial Strategy',
      amount: '£100k - £5M',
      deadline: '2024-05-30',
      status: 'open',
      matchScore: 88,
      description: 'Innovations to achieve net zero carbon emissions.',
      sector: 'Clean Energy',
      eligibility: ['All UK organizations', 'Clean tech companies'],
      tags: ['Net Zero', 'Clean Tech', 'Climate Change']
    },
    {
      id: 15,
      title: 'Future Flight Challenge',
      funder: 'Connected & Autonomous Vehicles',
      amount: '£2M - £15M',
      deadline: '2024-08-01',
      status: 'open',
      matchScore: 76,
      description: 'Revolutionary aviation and aerospace technologies.',
      sector: 'Aerospace',
      eligibility: ['Aerospace companies', 'Tech startups', 'Research institutes'],
      tags: ['Aviation', 'Autonomous', 'Aerospace']
    },
    {
      id: 16,
      title: 'Medicines Discovery Catapult',
      funder: 'Medicines Discovery Catapult',
      amount: '£150k - £1M',
      deadline: '2024-04-25',
      status: 'open',
      matchScore: 79,
      description: 'Accelerating medicines discovery and development.',
      sector: 'Pharmaceuticals',
      eligibility: ['Biotech companies', 'Pharma startups', 'Research organizations'],
      tags: ['Pharmaceuticals', 'Drug Discovery', 'Healthcare']
    },
    {
      id: 17,
      title: 'Industrial Strategy Challenge Fund',
      funder: 'UK Research and Innovation',
      amount: '£500k - £20M',
      deadline: '2024-06-15',
      status: 'open',
      matchScore: 85,
      description: 'Tackling major industrial and societal challenges.',
      sector: 'Industrial',
      eligibility: ['All UK organizations', 'Industry-academia partnerships'],
      tags: ['Industrial Strategy', 'Partnership', 'Innovation']
    },
    {
      id: 18,
      title: 'AgriTech Catalyst',
      funder: 'Innovate UK & BBSRC',
      amount: '£25k - £2M',
      deadline: '2024-05-10',
      status: 'open',
      matchScore: 72,
      description: 'Innovations in agriculture and food production.',
      sector: 'Agriculture',
      eligibility: ['AgriTech companies', 'Food producers', 'Research institutes'],
      tags: ['Agriculture', 'Food Tech', 'Sustainability']
    },
    {
      id: 19,
      title: 'Rail Innovation Competition',
      funder: 'Department for Transport',
      amount: '£100k - £3M',
      deadline: '2024-07-08',
      status: 'open',
      matchScore: 68,
      description: 'Next generation rail transport innovations.',
      sector: 'Transport',
      eligibility: ['Transport companies', 'Engineering firms', 'Tech startups'],
      tags: ['Rail', 'Transport', 'Infrastructure']
    },
    {
      id: 20,
      title: 'Quantum Technologies Challenge',
      funder: 'EPSRC & Quantum Computing & Simulation Hub',
      amount: '£1M - £10M',
      deadline: '2024-09-20',
      status: 'open',
      matchScore: 93,
      description: 'Breakthrough quantum technologies for commercial application.',
      sector: 'Quantum Technology',
      eligibility: ['Quantum tech companies', 'Universities', 'Research institutes'],
      tags: ['Quantum', 'Computing', 'Advanced Technology']
    }
  ];
  
  const allWriters = [
    {
      id: 1,
      name: 'Dr. Emma Williams',
      title: 'Senior Grant Consultant',
      sector: 'Healthcare',
      successRate: 94,
      avatar: '/avatars/Dr. Emma Williams.jpg',
      totalFunding: '15M',
      yearsExperience: 12,
      specialties: ['Digital Health', 'Medical Devices', 'NHS Funding'],
      bio: 'Former NHS Innovation lead with extensive experience in healthcare grant writing and technology transfer.'
    },
    {
      id: 2,
      name: 'Dr. James Rodriguez',
      title: 'Funding Strategy Director',
      sector: 'Technology',
      successRate: 91,
      avatar: '/avatars/Dr. James Rodriguez.jpg',
      totalFunding: '22M',
      yearsExperience: 15,
      specialties: ['Deep Tech', 'AI/ML', 'Quantum Technologies'],
      bio: 'Leading expert in technology commercialization with a track record of securing major innovation funding.'
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Grant Writing Expert',
      sector: 'Environmental',
      successRate: 96,
      avatar: '/avatars/Dr. Sarah Johnson.jpg',
      totalFunding: '18M',
      yearsExperience: 10,
      specialties: ['Clean Energy', 'Sustainability', 'Environmental Science'],
      bio: 'Environmental scientist turned grant strategist, specializing in green technology and sustainability funding.'
    },
    {
      id: 4,
      name: 'Prof. Michael Chen',
      title: 'Research Funding Advisor',
      sector: 'Research',
      successRate: 89,
      avatar: '/avatars/Prof. Michael Chen.jpg',
      totalFunding: '35M',
      yearsExperience: 20,
      specialties: ['Academic Research', 'UKRI Funding', 'International Collaborations'],
      bio: 'Former UKRI panel member with deep expertise in research council funding and academic partnerships.'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      title: 'Innovation Funding Specialist',
      sector: 'Space Technology',
      successRate: 88,
      avatar: '/avatars/Dr. Lisa Thompson.jpg',
      totalFunding: '12M',
      yearsExperience: 8,
      specialties: ['Space Technology', 'Aerospace', 'Defence'],
      bio: 'Former ESA researcher specializing in space technology commercialization and defence innovation funding.'
    },
    {
      id: 6,
      name: 'Dr. Robert Kumar',
      title: 'Startup Funding Expert',
      sector: 'General',
      successRate: 92,
      avatar: '/avatars/Dr. Robert Kumar.jpg',
      totalFunding: '28M',
      yearsExperience: 14,
      specialties: ['Early Stage Funding', 'Angel Investment', 'Venture Capital'],
      bio: 'Serial entrepreneur and investor with extensive experience in startup funding across multiple sectors.'
    }
  ];
  
  // Dynamic computed values
  $: displayedGrants = (() => {
    switch (activeSection) {
      case 'saved-competitions':
        return allGrants.filter(grant => savedCompetitions.includes(grant.id));
      case 'competitions':
        return allGrants;
      case 'matches':
        return allGrants.filter(grant => grant.matchScore >= 85).slice(0, 6);
      default:
        return allGrants.slice(0, 4);
    }
  })();
    
  $: displayedWriters = activeSection === 'saved-writers'
    ? allWriters.filter(writer => savedWriters.includes(writer.id))
    : allWriters;
  
  onMount(() => {
    mounted = true;
    
    // Check if user has paid
    const hasPaid = localStorage.getItem('trellisPaymentStatus') === 'paid';
    if (!hasPaid) {
      goto('/results');
    }
    
    // Check URL parameters for section
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    if (sectionParam) {
      activeSection = sectionParam;
    }
    
    // Note: Removed auto-clearing of saved writers to allow save functionality
    
    loadSavedItems();
    
    // Refresh saved items when user returns to the portal
    const handleFocus = () => {
      loadSavedItems();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup listener on destroy
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  });
  
  function loadSavedItems() {
    try {
      savedCompetitions = JSON.parse(localStorage.getItem('savedCompetitions') || '[]');
      savedWriters = JSON.parse(localStorage.getItem('savedWriters') || '[]');
      
      // Trigger reactivity to update displays
      displayedGrants = displayedGrants;
      displayedWriters = displayedWriters;
    } catch (error) {
      console.error('Error loading saved items:', error);
      savedCompetitions = [];
      savedWriters = [];
    }
  }
  
  function toggleSaveCompetition(competitionId: number) {
    if (savedCompetitions.includes(competitionId)) {
      savedCompetitions = savedCompetitions.filter(id => id !== competitionId);
    } else {
      savedCompetitions = [...savedCompetitions, competitionId];
    }
    localStorage.setItem('savedCompetitions', JSON.stringify(savedCompetitions));
    
    // Update displays by triggering reactivity
    displayedGrants = displayedGrants;
  }
  
  function toggleSaveWriter(writerId: number) {
    if (savedWriters.includes(writerId)) {
      savedWriters = savedWriters.filter(id => id !== writerId);
    } else {
      savedWriters = [...savedWriters, writerId];
    }
    localStorage.setItem('savedWriters', JSON.stringify(savedWriters));
    
    // Update displays by triggering reactivity
    displayedWriters = displayedWriters;
  }
  
  function isCompetitionSaved(competitionId: number): boolean {
    return savedCompetitions.includes(competitionId);
  }
  
  function isWriterSaved(writerId: number): boolean {
    return savedWriters.includes(writerId);
  }
  
  function setActiveSection(section: string) {
    activeSection = section;
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'open': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'closing-soon': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }
  
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Client Portal - Trellis</title>
  <meta name="description" content="Your personalized grant matching dashboard" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  {#if mounted}
    <!-- Top App Bar (behind sidebar) -->
    <TopAppBar />
    
    <div class="flex h-screen pt-16">
      <!-- Sidebar Component -->
      <Sidebar 
        bind:expanded={sidebarExpanded} 
        {activeSection} 
        onSectionChange={handleSectionChange}
      />

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="p-8">


          <!-- Section Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-2">
              {#if activeSection === 'matches'}My Matches
              {:else if activeSection === 'competitions'}All Competitions
              {:else if activeSection === 'saved-writers'}Saved Writers
              {:else if activeSection === 'saved-competitions'}Saved Competitions
              {/if}
            </h2>
            <p class="text-gray-600">
              {#if activeSection === 'matches'}Your personalised grant recommendations
              {:else if activeSection === 'competitions'}Browse all available funding opportunities
              {:else if activeSection === 'saved-writers'}Your favorite grant writers
              {:else if activeSection === 'saved-competitions'}Competitions you've saved for later
              {/if}
            </p>
          </div>

          <!-- Content -->
          <div class="space-y-6" in:fade={{ duration: 300 }}>
            {#if activeSection === 'matches'}
              <!-- My Matches -->
              <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each displayedGrants as grant}
                  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">{grant.title}</h3>
                        <p class="text-gray-600 mb-3">{grant.funder}</p>
                        <div class="flex items-center space-x-4 text-sm">
                          <span class="text-gray-500">{grant.amount}</span>
                          <span class="text-gray-500">•</span>
                          <span class="text-gray-500">Deadline: {formatDate(grant.deadline)}</span>
                        </div>
                      </div>
                      <div class="flex flex-col items-end space-y-2">
                        <span class="px-3 py-1.5 rounded-full text-sm font-semibold border {getStatusColor(grant.status)}">
                          {grant.status.replace('-', ' ')}
                        </span>
                        <div class="text-right">
                          <div class="text-2xl font-gt-walsheim-bold text-primary-blue">{grant.matchScore}%</div>
                          <div class="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                    </div>
                    <div class="flex space-x-3">
                      <button 
                        on:click={() => goto(`/competition/${grant.id}?from=${activeSection}`)}
                        class="flex-1 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        View Details
                      </button>
                      <button 
                        on:click={() => toggleSaveCompetition(grant.id)}
                        class="font-semibold px-4 py-2 rounded-xl transition-all duration-200 {isCompetitionSaved(grant.id) ? 'bg-emerald-500 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}"
                        title={isCompetitionSaved(grant.id) ? 'Remove from saved' : 'Save for later'}
                      >
                        <svg class="w-4 h-4" fill={isCompetitionSaved(grant.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/each}
              </div>

            {:else if activeSection === 'competitions'}
              <!-- All Competitions -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-gray-600">Showing {displayedGrants.length} available funding opportunities</p>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">Sort by:</span>
                    <select class="border border-gray-200 rounded-lg px-3 py-1 text-sm">
                      <option>Match Score</option>
                      <option>Deadline</option>
                      <option>Amount</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each displayedGrants as grant}
                  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <div class="mb-2">
                          <h3 class="text-lg font-gt-walsheim-bold text-gray-900">{grant.title}</h3>
                        </div>
                        <p class="text-gray-600 mb-3">{grant.funder}</p>
                        <div class="flex items-center space-x-4 text-sm mb-3">
                          <span class="text-gray-500">{grant.amount}</span>
                          <span class="text-gray-500">•</span>
                          <span class="text-gray-500">Deadline: {formatDate(grant.deadline)}</span>
                        </div>
                        <p class="text-gray-700 text-sm mb-3 line-clamp-2">{grant.description}</p>
                      </div>
                      <div class="flex flex-col items-end space-y-2">
                        <span class="px-3 py-1.5 rounded-full text-sm font-semibold border {getStatusColor(grant.status)}">
                          {grant.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div class="flex space-x-3">
                      <button 
                        on:click={() => goto(`/competition/${grant.id}?from=${activeSection}`)}
                        class="flex-1 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        View Details
                      </button>
                      <button 
                        on:click={() => toggleSaveCompetition(grant.id)}
                        class="font-semibold px-4 py-2 rounded-xl transition-all duration-200 {isCompetitionSaved(grant.id) ? 'bg-emerald-500 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}"
                        title={isCompetitionSaved(grant.id) ? 'Remove from saved' : 'Save for later'}
                      >
                        <svg class="w-4 h-4" fill={isCompetitionSaved(grant.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/each}
              </div>

            {:else if activeSection === 'saved-writers'}
              <!-- Saved Writers -->
              {#if displayedWriters.length === 0}
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">No Saved Writers</h3>
                  <p class="text-gray-600">Browse writer profiles and save your favorites to access them quickly here.</p>
                </div>
              {:else}
                <div class="mb-6">
                  <p class="text-gray-600">You have {displayedWriters.length} saved writer{displayedWriters.length === 1 ? '' : 's'}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {#each displayedWriters as writer}
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                      <div class="flex items-center space-x-4 mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-primary-blue to-cta-pink rounded-full flex items-center justify-center">
                          <span class="text-white font-gt-walsheim-bold text-lg">{writer.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div class="flex-1">
                          <h3 class="font-gt-walsheim-bold text-gray-900">{writer.name}</h3>
                          <p class="text-sm text-gray-600">{writer.title}</p>
                        </div>
                      </div>
                      <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600">Success Rate</span>
                          <span class="font-gt-walsheim-bold text-primary-blue">{writer.successRate}%</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600">Sector</span>
                          <span class="text-gray-900">{writer.sector}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600">Total Funding</span>
                          <span class="text-gray-900">£{writer.totalFunding}</span>
                        </div>
                      </div>
                      <div class="flex space-x-3 mt-4">
                        <button 
                          on:click={() => goto(`/writer/${writer.id}?from=${activeSection}`)}
                          class="flex-1 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                          View Profile
                        </button>
                        <button 
                          on:click={() => toggleSaveWriter(writer.id)}
                          class="font-semibold px-4 py-2 rounded-xl transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                          title="Remove from saved"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}

            {:else if activeSection === 'saved-competitions'}
              <!-- Saved Competitions -->
              {#if displayedGrants.length === 0}
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">No Saved Competitions</h3>
                  <p class="text-gray-600 mb-6">Save grant competitions you're interested in to keep track of them easily.</p>
                  <button 
                    on:click={() => handleSectionChange('competitions')}
                    class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Browse Competitions
                  </button>
                </div>
              {:else}
                <div class="mb-6">
                  <p class="text-gray-600">You have {displayedGrants.length} saved competition{displayedGrants.length === 1 ? '' : 's'}</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {#each displayedGrants as grant}
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                      <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                          <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">{grant.title}</h3>
                          <p class="text-gray-600 mb-3">{grant.funder}</p>
                          <div class="flex items-center space-x-4 text-sm mb-3">
                            <span class="text-gray-500">{grant.amount}</span>
                            <span class="text-gray-500">•</span>
                            <span class="text-gray-500">Deadline: {formatDate(grant.deadline)}</span>
                          </div>
                          <p class="text-gray-700 text-sm line-clamp-2 mb-3">{grant.description}</p>
                        </div>
                        <span class="px-3 py-1.5 rounded-full text-sm font-semibold border {getStatusColor(grant.status)}">
                          {grant.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div class="flex space-x-3">
                        <button 
                          on:click={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            goto(`/competition/${grant.id}?from=${activeSection}`);
                          }}
                          class="flex-1 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                          View Details
                        </button>
                        <button 
                          on:click={() => toggleSaveCompetition(grant.id)}
                          class="font-semibold px-4 py-2 rounded-xl transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                          title="Remove from saved"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
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
    </div>
  {/if}
</div> 