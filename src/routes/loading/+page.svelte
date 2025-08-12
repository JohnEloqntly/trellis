<script>
  import { page } from '$app/stores';
  import LoadingScreen from '$lib/components/onboarding/LoadingScreen.svelte';
  
  /** @type {{ sector: string; technologyType: string; innovationMaturity: number; companyName: string }} */
  let searchData = {
    sector: '',
    technologyType: '',
    innovationMaturity: 5,
    companyName: ''
  };
  
  $: searchData = {
    sector: $page.url.searchParams.get('sector') || '',
    technologyType: $page.url.searchParams.get('technology') || '',
    innovationMaturity: parseInt($page.url.searchParams.get('maturity') || '5'),
    companyName: $page.url.searchParams.get('company') || ''
  };
</script>

<LoadingScreen {searchData} /> 