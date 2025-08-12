<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { onMount } from 'svelte';
  
  // Team member data
  const teamMembers = [
    {
      name: "Daniel Tenner",
      title: "Founder",
      photo: "/team/daniel-tenner.jpg",
      bio: "As the founder of Trellis, Daniel brings a wealth of experience in grant funding and a passion for helping innovators navigate the complex funding landscape."
    },
    {
      name: "Bob Leung",
      title: "CEO & Chairman",
      photo: "/team/bob-leung.jpg",
      bio: "Bob leads Trellis with a strategic vision to democratize access to grant funding and empower innovative companies to reach their full potential."
    },
    {
      name: "Mark Wedel",
      title: "Strategic Funding Advisor",
      photo: "/team/mark-wedel.jpg",
      bio: "With extensive experience in the funding landscape, Mark provides strategic guidance to ensure Trellis connects clients with the most suitable funding opportunities."
    },
    {
      name: "Omar Bellfield",
      title: "Business Development Manager",
      photo: "/team/omar-bellfield.jpg",
      bio: "Omar builds and nurtures relationships with clients, understanding their unique needs to match them with the perfect funding solutions."
    },
    {
      name: "Stuart Semple",
      title: "Head of Grants",
      photo: "/team/stuart-semple.jpg",
      bio: "Stuart's deep knowledge of grant applications and funding criteria helps our clients maximize their chances of success across various funding bodies."
    },
    {
      name: "Nicky Attenborough",
      title: "Head of Getting Shit Done",
      photo: "/team/nicky-attenborough.jpg",
      bio: "Nicky ensures that operations run smoothly, projects stay on track, and the team delivers exceptional results for every client."
    }
  ];
  
  // Animation variables
  let isVisible = false;
  
  onMount(() => {
    isVisible = true;
  });
</script>

<svelte:head>
  <title>Our Team | Trellis</title>
  <meta name="description" content="Meet the expert team behind Trellis, dedicated to helping innovators navigate the funding landscape and secure the grants they need to succeed." />
</svelte:head>

<Navbar />

<main class="pt-20 md:pt-24">
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/50 py-16 md:py-24">
    <!-- Background Pattern -->
    <div class="absolute inset-0 z-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="team-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#4361ee" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#team-grid)" />
      </svg>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-gt-walsheim-bold mb-6 text-gray-900">
          Meet Our <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">Team</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-700 mb-8">
          We're a dedicated group of experts committed to helping innovators navigate the funding landscape and secure the grants they need to succeed.
        </p>
        
        <!-- Floating Decorative Elements -->
        <div class="absolute top-12 right-12 w-20 h-20 bg-white/80 rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 hidden md:flex">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <div class="absolute bottom-8 left-12 w-16 h-16 bg-white/80 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6 hidden md:flex">
          <div class="w-10 h-10 bg-gradient-to-br from-secondary-blue to-indigo-500 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
  

  
  <!-- Team Members Section -->
  <section class="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-gt-walsheim-bold mb-6 text-gray-900">
          The <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">People</span> Behind Trellis
        </h2>
        <p class="text-lg text-gray-700">
          Our diverse team of experts is united by a shared mission: to help innovative companies secure the funding they need to make a difference in the world.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {#each teamMembers as member, i}
          <div 
            class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style="transition-delay: {i * 100}ms; opacity: {isVisible ? 1 : 0}; transform: translateY({isVisible ? '0' : '20px'});"
          >
            <div class="relative">
              <!-- Gradient overlay for image -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent z-10"></div>
              
              <!-- Team member image -->
              <img 
                src={member.photo} 
                alt={member.name} 
                class="w-full h-64 object-cover object-center"
                loading="lazy"
              />
              
              <!-- Floating role badge -->
              <div class="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
                <p class="text-sm font-medium text-gray-900">{member.title}</p>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-gt-walsheim-bold text-gray-900 mb-2">{member.name}</h3>
              <p class="text-gray-700">{member.bio}</p>
              
              <!-- Social links placeholder -->
              <div class="mt-4 flex space-x-3">
                <span class="text-gray-400">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                <span class="text-gray-400">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  

</main>

<Footer />

<style>
  /* Add any additional component-specific styles here */
  :global(body) {
    overflow-x: hidden;
  }
</style>
