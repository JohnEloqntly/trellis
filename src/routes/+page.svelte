<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import LogoCarousel from '$lib/components/LogoCarousel.svelte';
  import GrantWriterCarousel from '$lib/components/GrantWriterCarousel.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { grantWriters } from '$lib/data/grant-writers.js';
  
  // Real funding body logos
  const fundingBodies = [
    { src: '/logos/innovateuk.png', alt: 'Innovate UK' },
    { src: '/logos/esa.png', alt: 'European Space Agency' },
    { src: '/logos/eic.png', alt: 'European Innovation Council' },
    { src: '/logos/tba.png', alt: 'Technology and Business Applications' },
    { src: '/logos/lottery.webp', alt: 'National Lottery Community Fund' },
    { src: '/logos/nihr.png', alt: 'National Institute for Health Research' }
  ];
</script>

<svelte:head>
  <title>Trellis - Find the perfect grant</title>
  <meta name="description" content="Access 500 funding bodies, 2,000 live grants, and £1bn in funding opportunities. Find the perfect grant for your research or business with Trellis." />
</svelte:head>

<!-- Navigation -->
<Navbar />

<!-- Hero Section -->
<Hero />

<!-- Funding Bodies Section -->
<LogoCarousel logos={fundingBodies} />

<!-- Grant Writers Section -->
<GrantWriterCarousel {grantWriters} />

<!-- Footer -->
<Footer /> 