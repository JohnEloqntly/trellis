<script>
  import { page } from '$app/stores';
  import LoadingScreen from '$lib/components/onboarding/LoadingScreen.svelte';
  
  // Get search data from navigation state or URL params
  let searchData = {};
  
  // Try to get data from page state first, fallback to URL params
  if (typeof window !== 'undefined') {
    searchData = history.state?.searchData || {
      sector: $page.url.searchParams.get('sector') || '',
      technologyType: $page.url.searchParams.get('technology') || '',
      innovationMaturity: parseInt($page.url.searchParams.get('maturity') || '5'),
      companyName: $page.url.searchParams.get('company') || ''
    };
  }
</script>

<LoadingScreen {searchData} /> 