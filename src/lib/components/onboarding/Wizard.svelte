<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import ProgressBar from './ProgressBar.svelte';
  import StepField from './StepField.svelte';
  import InnovationMaturitySlider from './InnovationMaturitySlider.svelte';
  import { 
    onboardingData, 
    currentStep, 
    technologyOptions, 
    sectorOptions, 
    countryOptions,
    marketSizeOptions,
    validationOptions,
    trlDescriptions 
  } from '$lib/stores/onboarding.js';
  
  const dispatch = createEventDispatcher();
  
  let currentStepValue = 1;
  let data = {
    name: '',
    email: '',
    phone: '',
    companyName: '',
    employeeCount: '',
    companyAge: '',
    website: '',
    sector: '',
    registeredCountry: '',
    previousGrantFunding: '',
    projectName: '',
    problemStatement: '',
    solutionApproach: '',
    technologyType: '',
    crossSectors: '',
    marketSize: '',
    commercialValidation: '',
    innovationMaturity: 5,
    elevatorPitch: ''
  };
  let errors: { submit?: string } = {};
  let isSubmitting = false;
  let showTrlTooltip = false;
  let tooltipContent = '';
  
  // Subscribe to stores
  currentStep.subscribe(value => currentStepValue = value);
  onboardingData.subscribe(value => {
    data = { ...data, ...value };
  });
  
  const steps = [
    // Company section intro
    {
      id: 1,
      title: "First, tell us about your company",
      subtitle: "This information helps us match you to the right funding opportunities",
      field: 'company_intro',
      type: 'intro',
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
             </svg>`
    },
    {
      id: 2,
      title: "Company name",
      subtitle: "Tell us who you are so we can match funding appropriately",
      field: 'companyName',
      type: 'text',
      placeholder: 'Your organisation name',
      autocomplete: 'organization',
      autofocus: true,

      whyWeAsk: "We personalise your results and any future communications using your name.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
             </svg>`
    },
    {
      id: 3,
      title: "Employee count",
      subtitle: "Some programmes target specific organisation sizes",
      field: 'employeeCount',
      type: 'select',
      placeholder: 'Select your company size',
      options: [
        '1',
        '2-5',
        '6-9',
        '10-49',
        '50-249',
        '250+'
      ],
      autofocus: true,

      whyWeAsk: "Many grant programs have eligibility criteria based on company size.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
             </svg>`
    },
    {
      id: 4,
      title: "How long has your company been operating?",
      subtitle: "Company age can affect eligibility for certain funding opportunities",
      field: 'companyAge',
      type: 'select',
      placeholder: 'Select company age',
      options: [
        'Less than 1 year',
        '1-2 years',
        '3-5 years',
        '6-10 years',
        'More than 10 years'
      ],
      autofocus: true,

      whyWeAsk: "Some grants specifically target early-stage companies or more established organizations.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
             </svg>`
    },
    {
      id: 5,
      title: "Company website",
      subtitle: "We'll review your work to find the most relevant opportunities",
      field: 'website',
      type: 'url',
      placeholder: 'www.yourcompany.com',
      autocomplete: 'url',
      autofocus: true,

      whyWeAsk: "Sometimes grant deadlines are tight. We'll text you about time-sensitive opportunities you can't afford to miss.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
             </svg>`
    },
    {
      id: 6,
      title: "Which sector do you operate in?",
      subtitle: "This helps us find sector-specific funding opportunities",
      field: 'sector',
      type: 'select',
      placeholder: 'Select your sector',
      options: sectorOptions,
      autofocus: true,
      whyWeAsk: "Different grants favour different organisation types (startups, SMEs, universities). This helps us match you correctly.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
             </svg>`
    },
    {
      id: 7,
      title: "Has your company applied for grant funding before?",
      subtitle: "Previous grant experience can affect eligibility for certain programmes",
      field: 'previousGrantFunding',
      type: 'select',
      placeholder: 'Select an option',
      options: [
        'Yes, successfully received funding',
        'Yes, but was unsuccessful',
        'No, first time applying',
        'Not sure'
      ],
      autofocus: true,
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>`
    },
    {
      id: 8,
      title: "Where is your company registered?",
      subtitle: "Some funding programmes have specific geographic requirements",
      field: 'registeredCountry',
      type: 'select',
      placeholder: 'Select country',
      options: countryOptions,
      autofocus: true,
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
             </svg>`
    },
    // Project section intro
    {
      id: 9,
      title: "Now, tell us about your project",
      subtitle: "Grant funding is project-based. These details help match you with relevant opportunities",
      field: 'project_intro',
      type: 'intro',
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
             </svg>`
    },
    {
      id: 10,
      title: "What is the name of your project?",
      subtitle: "We’ll match funding to the specific project you’re working on",
      field: 'projectName',
      type: 'text',
      placeholder: 'Project name',
      autocomplete: 'off',
      autofocus: true,

      whyWeAsk: "We analyse your website to better understand your technology and market focus, leading to more accurate grant matches.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
             </svg>`
    },
    {
      id: 10,
      title: "What problem are you solving?",
      subtitle: "Briefly describe the core problem your project addresses",
      field: 'problemStatement',
      type: 'textarea',
      placeholder: 'Describe the problem…',
      maxlength: 400,
      autofocus: true,

      whyWeAsk: "Many grants are specifically for certain technologies (machine learning, biotech, clean energy). This is crucial for finding your perfect matches.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
             </svg>`
    },
    {
      id: 11,
      title: "What's the solution?",
      subtitle: "Explain how your project solves the problem",
      field: 'solutionApproach',
      type: 'textarea',
      placeholder: 'Describe the solution…',
      maxlength: 400,
      autofocus: true,

      whyWeAsk: "Early-stage grants fund research and proof-of-concept. Later-stage grants fund commercialisation and scaling. This ensures perfect matching.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>`
    },
    {
      id: 12,
      title: "What technology are you leveraging?",
      subtitle: "What's the core technology behind your innovation?",
      field: 'technologyType',
      type: 'select',
      placeholder: 'Select your technology area',
      options: technologyOptions,
      autofocus: true,

      whyWeAsk: "Many grants target specific sectors (healthcare, agriculture, defence). Sector matching is key to finding grants where you'll be competitive.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
             </svg>`
    },
    {
      id: 13,
      title: "What other sectors outside your own benefit?",
      subtitle: "List any adjacent sectors that your project positively impacts",
      field: 'crossSectors',
      type: 'select',
      placeholder: 'Select sectors',
      options: sectorOptions,
      autofocus: true,
    },
    {
      id: 14,
      title: "What size is the market you're targeting?",
      subtitle: "Market size helps us understand the scale and type of funding opportunities",
      field: 'marketSize',
      type: 'select',
      placeholder: 'Select market size',
      options: marketSizeOptions,
      autofocus: true,
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
             </svg>`
    },
    {
      id: 15,
      title: "How much commercial validation do you have?",
      subtitle: "Understanding your validation level helps match you to appropriate funding stages",
      field: 'commercialValidation',
      type: 'select',
      placeholder: 'Select validation level',
      options: validationOptions,
      autofocus: true,
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`
    },
    {
      id: 16,
      title: "",
      subtitle: "",
      field: 'trlExplainer',
      type: 'info',
      placeholder: '',
      autofocus: false,

      whyWeAsk: "TRL provides a common language for readiness. Many grants specify TRL bands.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>`
    },
    {
      id: 17,
      title: "What is your TRL level?",
      subtitle: "How developed is your technology? (Based on NASA TRL scale)",
      field: 'innovationMaturity',
      type: 'range',
      min: 1,
      max: 9,
      step: 1,
      autofocus: true,
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>`
    },
  ];
  
  $: currentStepData = steps.find(step => step.id === currentStepValue);
  $: isLastStep = currentStepValue === 17; // Last step ID is 17 (TRL selection)
  $: isFirstStep = currentStepValue === 1;
  $: canProceed = validateCurrentStep();
  $: currentTrlDescription = getTrlDescription(data.innovationMaturity);
  
  function validateCurrentStep() {
    // Always allow proceeding - just check that any value exists
    if (!currentStepData) return true;
    // Info-only steps don't require input
    if ((currentStepData as any).type === 'info') return true;
    
    const fieldName = currentStepData.field;
    let fieldValue = (data as any)[fieldName];
    
    // For any field, just check if something is there
    if (typeof fieldValue === 'string') {
      return fieldValue.trim().length > 0;
    }
    
    // For numbers and other types, just check they exist
    return fieldValue !== null && fieldValue !== undefined;
  }
  
  function nextStep() {
    if (!canProceed) return;
    
    if (isLastStep) {
      submitOnboarding();
    } else {
      currentStep.set(currentStepValue + 1);
    }
  }
  
  function prevStep() {
    if (currentStepValue > 1) {
      currentStep.set(currentStepValue - 1);
    }
  }
  
  function handleFieldInput(event: any) {
    const { value } = event.detail;
    let processedValue = value;
    
    // Process URL field
    if (currentStepData && currentStepData.type === 'url' && value && !value.startsWith('http')) {
      processedValue = `https://${value}`;
    }
    
    if (currentStepData) {
      // Update the local data object directly for immediate reactivity
      const fieldName = currentStepData.field;
      if (fieldName === 'name') data.name = processedValue;
      else if (fieldName === 'email') data.email = processedValue;
      else if (fieldName === 'phone') data.phone = processedValue;
      else if (fieldName === 'companyName') data.companyName = processedValue;
      else if (fieldName === 'employeeCount') data.employeeCount = processedValue;
      else if (fieldName === 'companyAge') data.companyAge = processedValue;
      else if (fieldName === 'website') data.website = processedValue;
      else if (fieldName === 'sector') data.sector = processedValue;
      else if (fieldName === 'registeredCountry') data.registeredCountry = processedValue;
      else if (fieldName === 'previousGrantFunding') data.previousGrantFunding = processedValue;
      else if (fieldName === 'projectName') data.projectName = processedValue;
      else if (fieldName === 'problemStatement') data.problemStatement = processedValue;
      else if (fieldName === 'solutionApproach') data.solutionApproach = processedValue;
      else if (fieldName === 'technologyType') data.technologyType = processedValue;
      else if (fieldName === 'crossSectors') data.crossSectors = processedValue;
      else if (fieldName === 'marketSize') data.marketSize = processedValue;
      else if (fieldName === 'commercialValidation') data.commercialValidation = processedValue;
      else if (fieldName === 'innovationMaturity') data.innovationMaturity = processedValue;
      else if (fieldName === 'elevatorPitch') data.elevatorPitch = processedValue;
      
      // Also update the store
      onboardingData.updateField(currentStepData.field, processedValue);
      
      // Force reactivity update
      data = { ...data };
    }
  }
  
  function handleEnter() {
    if (canProceed) {
      nextStep();
    }
  }
  
  function getTrlDescription(value: number): string {
    // Type-safe way to get TRL descriptions
    if (value === 1) return trlDescriptions[1];
    if (value === 2) return trlDescriptions[2];
    if (value === 3) return trlDescriptions[3];
    if (value === 4) return trlDescriptions[4];
    if (value === 5) return trlDescriptions[5];
    if (value === 6) return trlDescriptions[6];
    if (value === 7) return trlDescriptions[7];
    if (value === 8) return trlDescriptions[8];
    if (value === 9) return trlDescriptions[9];
    return '';
  }
  
  function handleSliderChange(event: any) {
    const value = parseInt(event.detail.value);
    onboardingData.updateField('innovationMaturity', value);
    
    // Show TRL tooltip
    if (value >= 1 && value <= 9) {
      tooltipContent = getTrlDescription(value);
      showTrlTooltip = true;
      setTimeout(() => showTrlTooltip = false, 3000);
    }
  }
  
  async function submitOnboarding() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Navigate to loading with URL params so both dev and prod work reliably
        const url = `/loading?sector=${encodeURIComponent(data.sector || '')}` +
          `&technology=${encodeURIComponent(data.technologyType || '')}` +
          `&maturity=${encodeURIComponent(String(data.innovationMaturity))}` +
          `&company=${encodeURIComponent(data.companyName || '')}`;
        
        // Clear the stored data AFTER we've captured the values for URL
        onboardingData.reset();
        
        window.location.href = url; // Direct browser navigation to ensure it works in all cases
      } else {
        throw new Error('Failed to submit onboarding data');
      }
    } catch (error) {
      console.error('Submission error:', error);
      errors.submit = 'Sorry, there was a problem processing your information. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleKeydown(event: any) {
    if (event.key === 'ArrowLeft' && !isFirstStep) {
      prevStep();
    } else if (event.key === 'ArrowRight' && canProceed) {
      nextStep();
    }
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:head>
  <title>Grant Search Onboarding - Trellis</title>
  <meta name="description" content="Tell us about your innovation to find the perfect funding opportunities" />
</svelte:head>

<!-- Clean Wizard Card -->
<div class="w-full max-w-2xl mx-auto">
  
  <!-- Wizard Card with Clean Portal Styling -->
  <div 
    class="{currentStepValue <= 7 ? 'bg-blue-50/20' : 'bg-purple-50/10'} rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
    role="dialog"
    aria-labelledby="wizard-title"
    aria-live="polite"
  >
    <!-- Progress Bar Section -->
    <div class="p-6 sm:p-8 pb-4 border-b" 
         class:border-blue-200={currentStepValue <= 7} 
         class:border-purple-100={currentStepValue > 7}>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-xl flex items-center justify-center">
            {#if currentStepData}
              {@html currentStepData.icon}
            {:else}
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            {/if}
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">Step {currentStepValue} of {steps.length}</div>
            <div class="text-xs text-gray-500">Building your grant profile</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg font-gt-walsheim-bold text-primary-blue">{Math.round((currentStepValue / steps.length) * 100)}%</div>
          <div class="text-xs text-gray-500">Complete</div>
        </div>
      </div>
      <ProgressBar currentStep={currentStepValue} totalSteps={steps.length} />
    </div>
    
    <!-- Step Content -->
               {#if currentStepData}
             <div 
               class="p-6 sm:p-8"
               in:slide={{ duration: 300, axis: 'x' }}
               out:slide={{ duration: 300, axis: 'x' }}
             >
        <!-- Step Header with Encouragement -->
        <div class="mb-8">
          {#if currentStepData.type !== 'intro'}
          <h1 id="wizard-title" class="text-2xl sm:text-3xl font-gt-walsheim-bold text-gray-900 mb-3 leading-tight">
            {currentStepData.title}
          </h1>

          <p class="text-gray-600 text-base mb-4 leading-relaxed">
            {currentStepData.subtitle}
          </p>
          {/if}

        </div>
        
        <!-- Step Field -->
        <div class="mb-8">
          {#if currentStepData.type === 'intro'}
            {#if currentStepData.field === 'company_intro'}
              <!-- Enhanced Company Introduction -->
              <div class="relative overflow-hidden rounded-2xl">
                <!-- Stylish background with gradient and patterns -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-90 z-0"></div>
                <div class="absolute inset-0 z-0">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="company-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1" fill="#4361ee" opacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#company-grid)" />
                  </svg>
                </div>
                
                <!-- Content -->
                <div class="relative z-10 p-8">
                  <!-- Icon in floating card -->
                  <div class="absolute top-6 right-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-6">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-500 rounded-xl flex items-center justify-center">
                      {@html currentStepData.icon}
                    </div>
                  </div>
                  
                  <!-- Title with gradient text -->
                  <h3 class="text-3xl font-gt-walsheim-bold mb-4 mt-8 max-w-[70%]">
                    <span class="text-gray-900">First, tell us about your</span> <span class="bg-gradient-to-r from-primary-blue to-blue-500 bg-clip-text text-transparent">company</span>
                  </h3>
                  
                  <!-- Description with icon bullets -->
                  <p class="text-gray-700 mb-6 max-w-[85%]">{currentStepData.subtitle}</p>
                  
                  <!-- Benefits -->
                  <div class="space-y-4 mb-6">
                    <div class="flex items-center">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-3 h-3 text-primary-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <p class="text-sm text-gray-700">Many grants have company size and age requirements</p>
                    </div>
                    <div class="flex items-center">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-3 h-3 text-primary-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <p class="text-sm text-gray-700">Matching your industry improves funding success rates</p>
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <!-- Enhanced Project Introduction -->
              <div class="relative overflow-hidden rounded-2xl">
                <!-- Stylish background with gradient and patterns -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50/50 opacity-90 z-0"></div>
                <div class="absolute inset-0 z-0">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="project-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1.5" fill="#7C3AED" opacity="0.15" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#project-dots)" />
                  </svg>
                </div>
                
                <!-- Content -->
                <div class="relative z-10 p-8">
                  <!-- Icon in floating card -->
                  <div class="absolute top-6 right-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center">
                      {@html currentStepData.icon}
                    </div>
                  </div>
                  
                  <!-- Title with gradient text -->
                  <h3 class="text-3xl font-gt-walsheim-bold mb-4 mt-8 max-w-[70%]">
                    <span class="text-gray-900">Now, tell us about your</span> <span class="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">project</span>
                  </h3>
                  
                  <!-- Description with icon bullets -->
                  <p class="text-gray-700 mb-6 max-w-[85%]">{currentStepData.subtitle}</p>
                  
                  <!-- Benefits -->
                  <div class="space-y-4 mb-6">
                    <div class="flex items-center">
                      <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <p class="text-sm text-gray-700">Grants fund specific projects, not general company operations</p>
                    </div>
                    <div class="flex items-center">
                      <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg class="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <p class="text-sm text-gray-700">TRL (technology readiness level) is a key eligibility factor</p>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          {:else if currentStepData.field === 'name'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.name}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'email'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.email}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'phone'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.phone}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'companyName'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.companyName}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'employeeCount'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.employeeCount}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'companyAge'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.companyAge}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'website'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.website}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'registeredCountry'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.registeredCountry}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'projectName'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.projectName}
              placeholder={currentStepData.placeholder}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'problemStatement'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.problemStatement}
              placeholder={currentStepData.placeholder}
              maxlength={currentStepData.maxlength ? undefined : undefined}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'solutionApproach'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.solutionApproach}
              placeholder={currentStepData.placeholder}
              maxlength={currentStepData.maxlength ? undefined : undefined}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'technologyType'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.technologyType}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              options={currentStepData.options || []}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'crossSectors'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.crossSectors}
              placeholder={currentStepData.placeholder}
              multiple={true}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'marketSize'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.marketSize}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'commercialValidation'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.commercialValidation}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'trlExplainer'}
            <div class="relative overflow-hidden rounded-2xl">
              <!-- Stylish background with gradient and patterns -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50/50 opacity-90 z-0"></div>
              <div class="absolute inset-0 z-0">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="trl-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="#7C3AED" opacity="0.15" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#trl-dots)" />
                </svg>
              </div>
              
              <!-- Content -->
              <div class="relative z-10 p-8">
                <!-- Icon in floating card -->
                <div class="absolute top-8 right-10 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                
                <h3 class="text-2xl font-gt-walsheim-bold mb-6 pr-28 text-gray-900">
                  <span class="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">Technology Readiness Level</span> explained
                </h3>
                
                <p class="text-gray-700 mb-6">TRL is a standardized scale (1-9) used by funding bodies to determine which stage of development they will fund. Understanding your TRL helps us match you to appropriate grants.</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div class="bg-white/80 rounded-lg p-4 border border-purple-100 shadow-sm">
                    <div class="font-semibold text-purple-800 mb-2">Early Stage (TRL 1-3)</div>
                    <p class="text-sm text-gray-600">Basic research, concept formulation, and experimental proof of concept. Typically funded by research grants.</p>
                  </div>
                  
                  <div class="bg-white/80 rounded-lg p-4 border border-purple-100 shadow-sm">
                    <div class="font-semibold text-purple-800 mb-2">Mid Stage (TRL 4-6)</div>
                    <p class="text-sm text-gray-600">Technology validation in lab and relevant environments. Often funded by development and demonstration grants.</p>
                  </div>
                  
                  <div class="bg-white/80 rounded-lg p-4 border border-purple-100 shadow-sm">
                    <div class="font-semibold text-purple-800 mb-2">Late Stage (TRL 7-9)</div>
                    <p class="text-sm text-gray-600">System prototype demonstration, qualification, and operational deployment. Typically funded by commercialization grants.</p>
                  </div>
                </div>
                
                <div class="text-sm text-gray-600 italic mt-4">
                  On the next screen, you'll select your specific TRL level to help us find the most appropriate funding opportunities.
                </div>
              </div>
            </div>
          {:else if currentStepData.field === 'innovationMaturity'}
            <div class="space-y-6">
              <!-- TRL slider with enhanced visual feedback -->
            <InnovationMaturitySlider
              bind:value={data.innovationMaturity}
              min={1}
              max={9}
              on:change={handleSliderChange}
            />
              
              <!-- TRL level indicator with description -->
              <div class="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-gray-900">Your selected level: <span class="text-purple-700">TRL {data.innovationMaturity}</span></h4>
                  <div class="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    {data.innovationMaturity <= 3 ? 'Early Stage' : data.innovationMaturity <= 6 ? 'Mid Stage' : 'Late Stage'}
                  </div>
                </div>
                <p class="text-gray-700 text-sm">{currentTrlDescription}</p>
              </div>
              
              <!-- Checkbox for "show all grants" -->
              <div class="flex items-center bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                <input 
                  type="checkbox" 
                  id="show-all-grants" 
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={false}
                />
                <label for="show-all-grants" class="ml-2 text-sm font-medium text-gray-700">
                  Show me grants for all TRL levels (I'm interested in funding at any stage)
                </label>
              </div>
            </div>
          {:else if currentStepData.field === 'sector'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.sector}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              options={currentStepData.options || []}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'previousGrantFunding'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.previousGrantFunding}
              placeholder={currentStepData.placeholder}
              options={currentStepData.options || []}
              autofocus={currentStepData.autofocus}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {:else if currentStepData.field === 'elevatorPitch'}
            <StepField
              type={currentStepData.type}
              label={currentStepData.title}
              bind:value={data.elevatorPitch}
              placeholder={currentStepData.placeholder}
              autocomplete={currentStepData.autocomplete}
              autofocus={currentStepData.autofocus}
              maxlength={currentStepData.maxlength ? null : undefined}
              on:input={handleFieldInput}
              on:enter={handleEnter}
            />
          {/if}
        </div>
        

        
        <!-- Error Banner -->
        {#if errors.submit}
          <div 
            class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
            transition:slide={{ duration: 200 }}
          >
            <p class="text-sm text-red-600">{errors.submit}</p>
          </div>
        {/if}
        
        <!-- Navigation -->
        <div class="flex justify-between items-center">
          <button
            type="button"
            on:click={prevStep}
            class="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 focus-ring rounded-xl px-4 py-2"
            class:invisible={isFirstStep}
            aria-label="Go to previous step"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
          </button>
          
          <button
            type="button"
            on:click={nextStep}
            disabled={!canProceed || isSubmitting}
            class="flex items-center space-x-2 bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-gt-walsheim-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none"
            aria-label={isLastStep ? 'Start your grant search' : 'Continue to next step'}
          >
            {#if isSubmitting}
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Finding grants...</span>
            {:else}
              <span>{isLastStep ? 'Find My Grants' : 'Continue'}</span>
              {#if !isLastStep}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              {:else}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              {/if}
            {/if}
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Floating Elements for Visual Interest -->

  </div>
</div> 