<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { currentProjectWriters, toggleWriter } from '$lib/stores/projectSaves.js';
  
  let writer: any = null;
  let mounted = false;
  let showSaveSuccess = false;
  
  // Get project-scoped saved writers
  $: savedWriters = $currentProjectWriters;
  $: isSaved = writer ? savedWriters.includes(writer.id) : false;
  let showContactModal = false;
  let showContactSuccess = false;
  let contactForm = {
    name: '',
    email: '',
    company: '',
    message: '',
    competition: ''
  };
  
  function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
  
  function openContactModal() {
    showContactModal = true;
  }
  
  function closeContactModal() {
    showContactModal = false;
    showContactSuccess = false;
    // Reset form
    contactForm = {
      name: '',
      email: '',
      company: '',
      message: '',
      competition: ''
    };
  }
  
  function submitContactForm() {
    // Simple validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      return;
    }
    
    // Show success state
    showContactSuccess = true;
    
    // Auto close after 3 seconds
    setTimeout(() => {
      closeContactModal();
    }, 3000);
  }
  

  

  
  // Mock writer data - matches grant-writers.js exactly
  const writers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Senior Grant Consultant',
      sector: 'Healthcare',
      successRate: 89,
      avatar: '/avatars/Dr. Sarah Johnson.jpg',
      totalFunding: '15.2M',
      yearsExperience: 12,
      specialties: ['Medical Research', 'Clinical Trials', 'Health Innovation'],
      bio: 'Sarah has over a decade of experience securing funding for groundbreaking healthcare research. She has successfully obtained grants totaling over £15M for medical research projects.',
      fullBio: `Dr. Sarah Johnson brings over 12 years of experience in healthcare research funding and grant writing. As a Senior Grant Consultant, she has an intimate understanding of medical research funding landscapes and regulatory requirements.

Sarah has successfully secured over £15.2M in funding for healthcare research projects, medical studies, and health innovation initiatives. Her expertise spans across various funding bodies including Innovate UK, NIHR, Wellcome Trust, and Medical Research Council funding programs.

Key achievements include leading the funding strategy for breakthrough medical research that has led to significant healthcare improvements and new treatment protocols. Sarah's approach combines deep scientific understanding with strategic commercial insight.`,
      credentials: [
        'PhD in Biomedical Sciences, University of Oxford',
        'MSc Medical Research, Imperial College London',
        'Former Grant Manager at NHS Innovation Hub',
        'Certified Grant Writing Professional (GWP)',
        'Research Coordinator at Imperial College London'
      ],
      recentProjects: [
        {
          title: 'Novel Cancer Treatment Research',
          funder: 'Medical Research Council',
          amount: '£2.8M',
          outcome: 'Breakthrough discovery - Phase II trials approved'
        },
        {
          title: 'Digital Health Intervention Study',
          funder: 'NIHR',
          amount: '£1.1M',
          outcome: 'Successful outcomes published in Nature Medicine'
        },
        {
          title: 'Clinical Trial Infrastructure',
          funder: 'Wellcome Trust',
          amount: '£1.5M',
          outcome: 'Platform deployed across 20 NHS trusts'
        }
      ],
      testimonials: [
        {
          text: "Sarah's expertise was instrumental in securing our MRC grant. Her deep understanding of medical research requirements made all the difference.",
          author: "Prof. David Chen, Principal Investigator",
          company: "University College London"
        },
        {
          text: "Working with Sarah transformed our approach to healthcare funding. She brings both scientific rigor and strategic thinking.",
          author: "Dr. Rebecca Mitchell, Research Director",
          company: "Medical Innovation Institute"
        }
      ],
      contact: {
        email: 'sarah.johnson@trellis.com',
        phone: '+44 7700 900 120',
        linkedin: 'https://linkedin.com/in/sarahjohnson-grants'
      },
      availability: 'Available for new projects',
      hourlyRate: '£180/hour',
      projectRate: '£2,200 - £12,000'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      title: 'Research Funding Specialist',
      sector: 'Technology',
      successRate: 92,
      avatar: '/avatars/Prof. Michael Chen.jpg',
      totalFunding: '23.8M',
      yearsExperience: 15,
      specialties: ['AI & Machine Learning', 'Quantum Computing', 'Robotics'],
      bio: 'Michael is a leading expert in technology funding with a track record of securing major grants for cutting-edge research in AI and quantum technologies.',
      fullBio: `Prof. Michael Chen is a distinguished technology funding strategist with 15 years of experience in securing funding for advanced technology innovations. His expertise spans artificial intelligence, quantum computing, robotics, and emerging technologies.

Michael has successfully secured over £23.8M in funding across various technology sectors, working with research institutions, tech startups, and scale-ups. His deep understanding of technology commercialization pathways has made him a sought-after advisor for complex innovation projects.

His approach focuses on translating complex technical innovations into compelling funding narratives that resonate with both technical reviewers and commercial stakeholders. Michael has particular strength in international funding programs and cross-border collaborations.`,
      credentials: [
        'PhD in Computer Science, Stanford University',
        'MSc Quantum Information, University of Oxford',
        'Director of Research at Cambridge University',
        'Principal Investigator at Alan Turing Institute',
        'Fellow, Royal Academy of Engineering'
      ],
      recentProjects: [
        {
          title: 'Quantum Computing Platform',
          funder: 'UKRI/EPSRC',
          amount: '£4.8M',
          outcome: 'Multi-year program - breakthrough achieved'
        },
        {
          title: 'AI Safety Research Initiative',
          funder: 'Horizon Europe',
          amount: '€3.2M',
          outcome: 'Leading consortium of 8 countries'
        },
        {
          title: 'Advanced Materials Discovery',
          funder: 'Innovate UK',
          amount: '£1.9M',
          outcome: '3 patents filed, commercial pilot launched'
        }
      ],
      testimonials: [
        {
          text: "Michael has an exceptional ability to translate complex technical concepts into compelling funding proposals. His strategic insights are invaluable.",
          author: "Dr. Lisa Chen, Founder",
          company: "QuantumCore Technologies"
        },
        {
          text: "The depth of Michael's understanding across multiple funding landscapes is remarkable. He secured funding we didn't think was possible.",
          author: "Prof. Alan Thompson, Director",
          company: "Advanced AI Research Lab"
        }
      ],
      contact: {
        email: 'michael.chen@trellis.com',
        phone: '+44 7700 900 121',
        linkedin: 'https://linkedin.com/in/michaelchen-tech'
      },
      availability: 'Limited availability - booking 3 months ahead',
      hourlyRate: '£225/hour',
      projectRate: '£5,000 - £25,000'
    },
    {
      id: 3,
      name: 'Dr. Emma Williams',
      title: 'Grant Writing Expert',
      sector: 'Environmental',
      successRate: 85,
      avatar: '/avatars/Dr. Emma Williams.jpg',
      totalFunding: '8.7M',
      yearsExperience: 8,
      specialties: ['Climate Change', 'Renewable Energy', 'Sustainability'],
      bio: 'Emma specializes in environmental and sustainability research funding, with expertise in climate science and renewable energy projects.',
      fullBio: `Dr. Emma Williams is a dedicated environmental grant writing expert with 8 years of experience in securing funding for climate change and sustainability initiatives. Her expertise spans renewable energy, environmental science, and sustainable development projects.

Emma has successfully secured over £8.7M in funding for environmental research, clean energy projects, and sustainability initiatives. Her deep understanding of environmental challenges and funding landscapes has made her a trusted advisor for green technology companies and research institutions.

Her approach combines environmental science expertise with strategic funding knowledge, enabling her to craft compelling proposals that address both technical merit and environmental impact. Emma is particularly skilled at international climate funding programs.`,
      credentials: [
        'PhD in Environmental Science, University of Cambridge',
        'MSc Renewable Energy, Imperial College London',
        'Environmental Scientist at Met Office',
        'Research Fellow at University of Edinburgh',
        'Certified Sustainability Professional (CSP)'
      ],
      recentProjects: [
        {
          title: 'Renewable Energy Storage System',
          funder: 'Innovate UK',
          amount: '£1.2M',
          outcome: 'Prototype developed - patent pending'
        },
        {
          title: 'Climate Impact Assessment Tool',
          funder: 'NERC',
          amount: '£890K',
          outcome: 'Deployed by 12 local authorities'
        },
        {
          title: 'Sustainable Agriculture Initiative',
          funder: 'Horizon Europe',
          amount: '€1.5M',
          outcome: 'Field trials showing 30% efficiency gain'
        }
      ],
      testimonials: [
        {
          text: "Emma's deep understanding of environmental funding helped us secure crucial NERC funding. Her expertise in climate science funding is unmatched.",
          author: "Prof. David Green, Research Director",
          company: "Climate Research Institute"
        },
        {
          text: "Working with Emma was transformative for our clean energy startup. She understands both the science and the funding landscape.",
          author: "Dr. Sarah Wilson, CEO",
          company: "GreenTech Innovations"
        }
      ],
      contact: {
        email: 'emma.williams@trellis.com',
        phone: '+44 7700 900 122',
        linkedin: 'https://linkedin.com/in/emmawilliams-environment'
      },
      availability: 'Available for new projects',
      hourlyRate: '£165/hour',
      projectRate: '£2,000 - £10,000'
    },
    {
      id: 4,
      name: 'Dr. James Rodriguez',
      title: 'Funding Strategy Director',
      sector: 'Education',
      successRate: 94,
      avatar: '/avatars/Dr. James Rodriguez.jpg',
      totalFunding: '31.5M',
      yearsExperience: 18,
      specialties: ['Educational Innovation', 'Digital Learning', 'Social Mobility'],
      bio: 'James has led funding strategies for transformative educational research, securing over £31M for projects that advance learning and social mobility.',
      fullBio: `Dr. James Rodriguez is a distinguished funding strategy director with 18 years of experience in securing funding for educational innovation and social mobility projects. His expertise spans educational technology, learning sciences, and policy research.

James has successfully secured over £31.5M in funding for educational initiatives, working with universities, education technology companies, and policy institutes. His deep understanding of educational funding landscapes and policy requirements has made him a sought-after strategist for complex educational projects.

His approach focuses on translating educational research into compelling funding narratives that demonstrate clear impact on learning outcomes and social mobility. James has particular expertise in large-scale educational transformation projects.`,
      credentials: [
        'PhD in Education Policy, Harvard University',
        'MSc Educational Psychology, Oxford University',
        'Head of Research at Department for Education',
        'Professor at London School of Economics',
        'Fellow, Academy of Social Sciences'
      ],
      recentProjects: [
        {
          title: 'AI-Enhanced Learning Platform',
          funder: 'Department for Education',
          amount: '£5.2M',
          outcome: 'Deployed across 500 schools nationwide'
        },
        {
          title: 'Social Mobility Research Initiative',
          funder: 'ESRC',
          amount: '£2.8M',
          outcome: 'Policy recommendations adopted by government'
        },
        {
          title: 'Digital Literacy Program',
          funder: 'Horizon Europe',
          amount: '€3.1M',
          outcome: 'Reaching 50,000+ students across Europe'
        }
      ],
      testimonials: [
        {
          text: "James's strategic approach to educational funding is exceptional. He secured funding that transformed our entire research program.",
          author: "Prof. Maria Gonzalez, Dean",
          company: "Institute of Education"
        },
        {
          text: "Working with James opened doors we didn't know existed. His understanding of education policy funding is unparalleled.",
          author: "Dr. Robert Chen, Director",
          company: "EdTech Research Center"
        }
      ],
      contact: {
        email: 'james.rodriguez@trellis.com',
        phone: '+44 7700 900 123',
        linkedin: 'https://linkedin.com/in/jamesrodriguez-education'
      },
      availability: 'Limited availability - booking 2 months ahead',
      hourlyRate: '£210/hour',
      projectRate: '£4,000 - £20,000'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      title: 'Research Grant Advisor',
      sector: 'Social Sciences',
      successRate: 87,
      avatar: '/avatars/Dr. Lisa Thompson.jpg',
      totalFunding: '12.3M',
      yearsExperience: 10,
      specialties: ['Psychology', 'Sociology', 'Public Policy'],
      bio: 'Lisa brings deep expertise in social sciences research funding, with a focus on projects that drive positive social change and inform public policy.',
      fullBio: `Dr. Lisa Thompson is an accomplished research grant advisor with 10 years of experience in securing funding for social sciences research. Her expertise spans psychology, sociology, public policy research, and social innovation projects.

Lisa has successfully secured over £12.3M in funding for social sciences initiatives, working with universities, think tanks, and policy research organizations. Her understanding of social research methodologies and funding requirements has made her a trusted advisor for complex social science projects.

Her approach combines rigorous research methodology with strategic policy relevance, enabling her to craft proposals that demonstrate both academic excellence and real-world impact. Lisa is particularly skilled at interdisciplinary social science funding.`,
      credentials: [
        'PhD in Social Psychology, University of Oxford',
        'MSc Research Methods, London School of Economics',
        'Senior Researcher at Institute for Fiscal Studies',
        'Policy Advisor at Cabinet Office',
        'Fellow, British Psychological Society'
      ],
      recentProjects: [
        {
          title: 'Social Cohesion Research Program',
          funder: 'ESRC',
          amount: '£1.8M',
          outcome: 'Findings influenced government community policy'
        },
        {
          title: 'Mental Health Innovation Study',
          funder: 'NIHR',
          amount: '£1.2M',
          outcome: 'New intervention adopted by NHS trusts'
        },
        {
          title: 'Digital Exclusion Research',
          funder: 'Nuffield Foundation',
          amount: '£650K',
          outcome: 'Policy recommendations implemented'
        }
      ],
      testimonials: [
        {
          text: "Lisa's expertise in social sciences funding helped us secure crucial ESRC funding. Her understanding of policy impact is exceptional.",
          author: "Prof. Andrew Wilson, Research Director",
          company: "Social Policy Institute"
        },
        {
          text: "Working with Lisa transformed our approach to social research funding. She brings both academic rigor and policy insight.",
          author: "Dr. Jennifer Adams, Principal Investigator",
          company: "Community Research Centre"
        }
      ],
      contact: {
        email: 'lisa.thompson@trellis.com',
        phone: '+44 7700 900 124',
        linkedin: 'https://linkedin.com/in/lisathompson-social'
      },
      availability: 'Available for new projects',
      hourlyRate: '£175/hour',
      projectRate: '£2,500 - £12,000'
    },
    {
      id: 6,
      name: 'Dr. Robert Kumar',
      title: 'Innovation Grant Specialist',
      sector: 'Engineering',
      successRate: 91,
      avatar: '/avatars/Dr. Robert Kumar.jpg',
      totalFunding: '19.6M',
      yearsExperience: 14,
      specialties: ['Aerospace', 'Manufacturing', 'Materials Science'],
      bio: 'Robert has extensive experience in engineering research funding, particularly in aerospace and advanced manufacturing technologies.',
      fullBio: `Dr. Robert Kumar is a distinguished innovation grant specialist with 14 years of experience in securing funding for engineering and advanced manufacturing projects. His expertise spans aerospace engineering, materials science, and manufacturing innovation.

Robert has successfully secured over £19.6M in funding for engineering initiatives, working with aerospace companies, manufacturing firms, and research institutions. His deep understanding of engineering challenges and funding landscapes has made him a sought-after advisor for complex technical projects.

His approach combines technical expertise with commercial understanding, enabling him to craft proposals that demonstrate both engineering excellence and market potential. Robert is particularly skilled at international engineering collaboration funding.`,
      credentials: [
        'PhD in Aerospace Engineering, MIT',
        'MSc Materials Science, Imperial College London',
        'Principal Engineer at Rolls-Royce',
        'Research Director at Cranfield University',
        'Fellow, Royal Aeronautical Society'
      ],
      recentProjects: [
        {
          title: 'Advanced Jet Engine Materials',
          funder: 'Aerospace Technology Institute',
          amount: '£3.2M',
          outcome: 'New alloy in commercial production'
        },
        {
          title: 'Smart Manufacturing Platform',
          funder: 'Innovate UK',
          amount: '£2.1M',
          outcome: 'Deployed across 25 manufacturing sites'
        },
        {
          title: 'Sustainable Aviation Fuels',
          funder: 'Horizon Europe',
          amount: '€2.8M',
          outcome: 'Flight trials successfully completed'
        }
      ],
      testimonials: [
        {
          text: "Robert's engineering expertise and funding knowledge helped us secure crucial ATI funding. His technical insight is invaluable.",
          author: "Dr. Sophie Chen, Chief Engineer",
          company: "Aerospace Innovations Ltd"
        },
        {
          text: "Working with Robert opened new funding opportunities we hadn't considered. His industry knowledge is exceptional.",
          author: "Prof. David Miller, Director",
          company: "Advanced Manufacturing Institute"
        }
      ],
      contact: {
        email: 'robert.kumar@trellis.com',
        phone: '+44 7700 900 125',
        linkedin: 'https://linkedin.com/in/robertkumar-engineering'
      },
      availability: 'Available for new projects',
      hourlyRate: '£195/hour',
      projectRate: '£3,000 - £15,000'
    }
  ];
  
  onMount(() => {
    mounted = true;
    const writerId = parseInt($page.params.id);
    writer = writers.find(w => w.id === writerId);
    
    if (!writer) {
      goto('/portal');
      return;
    }
    
    // isSaved is now reactive based on project-scoped store
  });
  
  function toggleSave() {
    if (!writer) return;
    
    // Use project-scoped toggle
    toggleWriter(writer.id);
    
    // Show success message if saving (not unsaving)
    if (!isSaved) {
      showSaveSuccess = true;
      setTimeout(() => {
        showSaveSuccess = false;
      }, 3000);
    }
  }
  
  function formatCurrency(amount: string) {
    return amount.replace(/(\d+)([KM])/, (match, num, suffix) => {
      return `£${num}${suffix === 'M' ? ' million' : ' thousand'}`;
    });
  }
</script>

<svelte:head>
  <title>{writer ? writer.name : 'Writer Profile'} - Trellis</title>
  <meta name="description" content="Expert grant writer profile and credentials" />
</svelte:head>

{#if mounted && writer}
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-6 lg:p-8">
      
      <!-- Navigation -->
      <div class="mb-8" in:fade={{ duration: 300 }}>
        <button 
          on:click={() => {
            const fromSection = $page.url.searchParams.get('from');
            const competitionId = $page.url.searchParams.get('competitionId');
            
            if (fromSection === 'competition' && competitionId) {
              goto(`/competition/${competitionId}`);
            } else if (fromSection) {
              goto(`/portal?section=${fromSection}`);
            } else {
              history.back();
            }
          }}
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-medium">Back</span>
        </button>
      </div>
      
      <!-- Writer Profile Header -->
      <div class="bg-gray-100 rounded-3xl p-12 mb-8 text-center" in:fade={{ duration: 500, delay: 100 }}>
        <div class="relative inline-block mb-6">
          <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
            {#if writer.avatar}
              <img 
                src={writer.avatar} 
                alt={writer.name}
                class="w-full h-full object-cover"
                on:error={() => {
                  // Handle image load error by hiding image and showing placeholder
                }}
              />
            {:else}
              <div class="w-full h-full bg-gradient-to-br from-primary-blue to-secondary-blue flex items-center justify-center">
                <span class="text-white font-gt-walsheim-bold text-2xl">{getInitials(writer.name)}</span>
              </div>
            {/if}
          </div>
          </div>
          
        <h1 class="text-4xl font-gt-walsheim-bold text-gray-900 mb-2">{writer.name}</h1>
        <p class="text-xl text-gray-500">{writer.title}</p>
              </div>
              
      <!-- Action Buttons -->
      <div class="flex space-x-4 mb-8 justify-center" in:slide={{ duration: 500, delay: 150 }}>
        <button 
          on:click={openContactModal}
          class="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-gt-walsheim-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          Work with me
        </button>
              <button 
                on:click={toggleSave}
          class="bg-white border border-gray-200 text-gray-700 font-gt-walsheim-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2 {isSaved ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-md' : ''}"
        >
          <svg class="w-5 h-5 transition-all duration-300" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
          <span class="transition-all duration-300">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
      </div>
      
      <!-- Success Message -->
      {#if showSaveSuccess}
        <div class="mb-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 max-w-md mx-auto" in:slide={{ duration: 300 }}>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-emerald-900">Writer saved!</p>
              <p class="text-sm text-emerald-700">You can find {writer.name} in your saved writers in the portal.</p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Details Section -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6" in:slide={{ duration: 500, delay: 200 }}>
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-gt-walsheim-bold text-gray-900">Details</h2>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Years of Experience</h3>
            <div class="text-3xl font-gt-walsheim-bold text-emerald-600 mb-1">{writer.yearsExperience} years</div>
            <p class="text-gray-500">Professional grant writing experience</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Success Rate</h3>
            <div class="text-3xl font-gt-walsheim-bold text-emerald-600 mb-1">{writer.successRate}%</div>
            <p class="text-gray-500">Grant application success rate</p>
          </div>
        </div>
      </div>

      <!-- Education & Experience -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Education -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 300 }}>
          <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-4">Education</h3>
          <p class="text-gray-700">PhD in Computer Science, Stanford University</p>
        </div>
        
        <!-- Previous Roles -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 350 }}>
          <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-4">Previous Roles</h3>
          <div class="space-y-2">
            <div class="flex items-start space-x-2">
              <div class="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
              <p class="text-gray-700">Director of Research at Cambridge University</p>
            </div>
            <div class="flex items-start space-x-2">
              <div class="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
              <p class="text-gray-700">Principal Investigator at Alan Turing Institute</p>
            </div>
          </div>
        </div>
      </div>



      <!-- Supported Competitions -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8" in:slide={{ duration: 500, delay: 500 }}>
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-gt-walsheim-bold text-gray-900">Supported Competitions</h2>
        </div>
        
        <p class="text-gray-600 mb-8">Grant competitions {writer.name} has expertise in</p>
        
        <div class="grid grid-cols-2 gap-6">
          <!-- IUK Loan -->
          <div class="border border-gray-200 rounded-xl p-6">
            <div class="flex items-start space-x-4 mb-4">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-gt-walsheim-bold text-gray-900 mb-1">IUK Loan</h4>
                <p class="text-sm text-gray-600 mb-2">Innovate UK</p>
                <p class="text-gray-700 text-sm mb-3">Low-interest loans for innovation projects</p>
                <span class="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Technology</span>
              </div>
            </div>
          </div>
          
          <!-- SMART -->
          <div class="border border-gray-200 rounded-xl p-6">
            <div class="flex items-start space-x-4 mb-4">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-gt-walsheim-bold text-gray-900 mb-1">SMART</h4>
                <p class="text-sm text-gray-600 mb-2">Innovate UK</p>
                <p class="text-gray-700 text-sm mb-3">Small Business Research Initiative</p>
                <span class="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      

          
          <!-- Full Bio -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 200 }}>
            <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">About {writer.name.split(' ')[1]}</h2>
            <div class="prose prose-gray max-w-none">
              {#each writer.fullBio.split('\n\n') as paragraph}
                <p class="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
              {/each}
            </div>
          </div>
          
          <!-- Credentials -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 300 }}>
            <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Credentials & Qualifications</h2>
            <ul class="space-y-3">
              {#each writer.credentials as credential}
                <li class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-700">{credential}</span>
                </li>
              {/each}
            </ul>
          </div>
          
          <!-- Recent Projects -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 400 }}>
            <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Recent Project Successes</h2>
            <div class="space-y-4">
              {#each writer.recentProjects as project, index}
                <div class="border border-gray-200 rounded-xl p-6">
                  <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg font-gt-walsheim-bold text-gray-900">{project.title}</h3>
                    <span class="text-lg font-gt-walsheim-bold text-emerald-600">{project.amount}</span>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span class="font-medium">{project.funder}</span>
                    <span>•</span>
                    <span class="text-emerald-600 font-medium">{project.outcome}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Testimonials -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 500, delay: 500 }}>
            <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Client Testimonials</h2>
            <div class="space-y-6">
              {#each writer.testimonials as testimonial, index}
                <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <blockquote class="text-gray-700 leading-relaxed mb-4 italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div class="text-sm">
                    <p class="font-gt-walsheim-bold text-gray-900">{testimonial.author}</p>
                    <p class="text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        
  </div>
{:else}
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-4">Writer not found</h1>
      <button 
        on:click={() => goto('/portal')}
        class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
      >
        Return to Portal
      </button>
    </div>
  </div>
{/if}

<!-- Contact Writer Modal -->
{#if showContactModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" transition:fade={{ duration: 200 }}>
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" transition:slide={{ duration: 300 }}>
      {#if !showContactSuccess}
        <!-- Contact Form -->
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-gt-walsheim-bold text-gray-900">Contact {writer.name}</h3>
            <button 
              on:click={closeContactModal}
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="contactName" class="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                             <input 
                 id="contactName"
                 type="text" 
                 bind:value={contactForm.name}
                 placeholder="Enter your full name"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
               />
             </div>
             
             <div>
               <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
               <input 
                 id="contactEmail"
                 type="email" 
                 bind:value={contactForm.email}
                 placeholder="your.email@company.com"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
               />
             </div>
             
             <div>
               <label for="contactCompany" class="block text-sm font-medium text-gray-700 mb-2">Company</label>
               <input 
                 id="contactCompany"
                 type="text" 
                 bind:value={contactForm.company}
                 placeholder="Your company name"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
               />
             </div>
             
             <div>
               <label for="competitionSupport" class="block text-sm font-medium text-gray-700 mb-2">Competition We Need Support On</label>
               <select 
                 id="competitionSupport"
                 bind:value={contactForm.competition}
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900"
               >
                 <option value="">Select a competition...</option>
                 <option value="innovate-uk-smart">Innovate UK Smart Grants</option>
                 <option value="epsrc-impact">EPSRC Impact Acceleration</option>
                 <option value="wellcome-innovator">Wellcome Trust Innovator Awards</option>
                 <option value="ukri-future-leaders">UKRI Future Leaders Fellowship</option>
                 <option value="clean-growth">Clean Growth Fund</option>
                 <option value="digital-health">Digital Health Technology Catalyst</option>
                 <option value="space-tech">Space Technology Demonstrator</option>
                 <option value="ai-for-good">AI for Good Challenge</option>
                 <option value="other">Other - please specify in message</option>
               </select>
             </div>
             
             <div>
               <label for="contactMessage" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
               <textarea 
                 id="contactMessage"
                 bind:value={contactForm.message}
                 placeholder="Tell us about your project and funding needs..."
                 rows="4"
                 class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
               ></textarea>
            </div>
          </div>
          
          <div class="flex space-x-3 mt-8">
            <button 
              on:click={closeContactModal}
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-gt-walsheim-bold rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              on:click={submitContactForm}
              disabled={!contactForm.name || !contactForm.email || !contactForm.message}
              class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </div>
        </div>
      {:else}
        <!-- Success State -->
        <div class="p-8 text-center" transition:fade={{ duration: 300 }}>
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <h3 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-3">Message Sent!</h3>
          <p class="text-gray-600 mb-6">
            Thank you for reaching out. {writer.name} will get back to you within 24 hours.
          </p>
          
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">What happens next?</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• {writer.name} will review your project details</li>
              <li>• You'll receive a personalized proposal</li>
              <li>• Schedule a consultation call if interested</li>
            </ul>
          </div>
          
          <button 
            on:click={closeContactModal}
            class="bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-gt-walsheim-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Done
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}