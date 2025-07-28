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
    trlDescriptions 
  } from '$lib/stores/onboarding.js';
  
  const dispatch = createEventDispatcher();
  
  let currentStepValue = 1;
  let data = {
    name: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    technologyType: '',
    innovationMaturity: 5,
    sector: '',
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
    {
      id: 1,
      title: "Let's start with your name",
      subtitle: "We'll use this to personalise your experience and communications",
      field: 'name',
      type: 'text',
      placeholder: 'Enter your full name',
      autocomplete: 'name',
      autofocus: true,

      whyWeAsk: "We personalise your results and any future communications using your name.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
             </svg>`
    },
    {
      id: 2,
      title: "What's your email address?",
      subtitle: "We'll send your personalised grant matches here",
      field: 'email',
      type: 'email',
      placeholder: 'your.email@company.com',
      autocomplete: 'email',
      autofocus: true,

      whyWeAsk: "Your grant matches and application deadlines will be sent here. We never spam - only valuable opportunities.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
             </svg>`
    },
    {
      id: 3,
      title: "Your contact number",
      subtitle: "For urgent grant opportunities and application deadlines",
      field: 'phone',
      type: 'tel',
      placeholder: '+44 7XXX XXX XXX',
      autocomplete: 'tel',
      autofocus: true,

      whyWeAsk: "Sometimes grant deadlines are tight. We'll text you about time-sensitive opportunities you can't afford to miss.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
             </svg>`
    },
    {
      id: 4,
      title: "Company or organisation name",
      subtitle: "Help us understand your innovation context",
      field: 'companyName',
      type: 'text',
      placeholder: 'Your organisation name',
      autocomplete: 'organization',
      autofocus: true,
      whyWeAsk: "Different grants favour different organisation types (startups, SMEs, universities). This helps us match you correctly.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
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

      whyWeAsk: "We analyse your website to better understand your technology and market focus, leading to more accurate grant matches.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
             </svg>`
    },
    {
      id: 6,
      title: "Technology focus area",
      subtitle: "What's the core technology behind your innovation?",
      field: 'technologyType',
      type: 'select',
      placeholder: 'Select your technology area',
      options: technologyOptions,
      autofocus: true,

      whyWeAsk: "Many grants are specifically for certain technologies (machine learning, biotech, clean energy). This is crucial for finding your perfect matches.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
             </svg>`
    },
    {
      id: 7,
      title: "Innovation maturity level",
      subtitle: "How developed is your technology? (Based on NASA TRL scale)",
      field: 'innovationMaturity',
      type: 'range',
      min: 1,
      max: 9,
      step: 1,
      autofocus: true,

      whyWeAsk: "Early-stage grants fund research and proof-of-concept. Later-stage grants fund commercialisation and scaling. This ensures perfect matching.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
             </svg>`
    },
    {
      id: 8,
      title: "Which sector do you operate in?",
      subtitle: "This helps us find sector-specific funding opportunities",
      field: 'sector',
      type: 'select',
      placeholder: 'Select your sector',
      options: sectorOptions,
      autofocus: true,

      whyWeAsk: "Many grants target specific sectors (healthcare, agriculture, defence). Sector matching is key to finding grants where you'll be competitive.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
             </svg>`
    },
    {
      id: 9,
      title: "Your innovation story",
      subtitle: "Briefly describe your innovation and its impact (max 400 characters)",
      field: 'elevatorPitch',
      type: 'textarea',
      placeholder: 'Describe your innovation and the problem it solves...',
      maxlength: 400,
      autofocus: true,

      whyWeAsk: "Your innovation story helps us match you with grants that align with your specific impact and market approach.",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
             </svg>`
    }
  ];
  
  $: currentStepData = steps.find(step => step.id === currentStepValue);
  $: isLastStep = currentStepValue === steps.length;
  $: isFirstStep = currentStepValue === 1;
  $: canProceed = validateCurrentStep();
  
  function validateCurrentStep() {
    // Always allow proceeding - just check that any value exists
    if (!currentStepData) return true;
    
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
      else if (fieldName === 'website') data.website = processedValue;
      else if (fieldName === 'technologyType') data.technologyType = processedValue;
      else if (fieldName === 'innovationMaturity') data.innovationMaturity = processedValue;
      else if (fieldName === 'sector') data.sector = processedValue;
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
  
  function handleSliderChange(event: any) {
    const value = parseInt(event.detail.value);
    onboardingData.updateField('innovationMaturity', value);
    
    // Show TRL tooltip
    if (value >= 1 && value <= 9) {
      const descriptions: Record<number, string> = {
        1: "Basic principles observed - Scientific research begins",
        2: "Technology concept formulated - Practical application is identified",
        3: "Experimental proof of concept - Active R&D is initiated",
        4: "Technology validated in lab - Basic components are integrated",
        5: "Technology validated in relevant environment - Large scale components integrated",
        6: "Technology demonstrated in relevant environment - Representative model tested",
        7: "System prototype demonstration - Demonstration in operational environment",
        8: "System complete and qualified - Technology proven to work",
        9: "Actual system proven in operational environment - Ready for deployment"
      };
      tooltipContent = descriptions[value];
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
        // Clear the stored data
        onboardingData.reset();
        
        // Navigate to loading screen with data
        goto('/loading', { 
          state: { 
            searchData: {
              sector: data.sector,
              technologyType: data.technologyType,
              innovationMaturity: data.innovationMaturity,
              companyName: data.companyName
            }
          }
        });
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
    class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
    role="dialog"
    aria-labelledby="wizard-title"
    aria-live="polite"
  >
    <!-- Progress Bar Section -->
    <div class="p-6 sm:p-8 pb-4 border-b border-gray-200">
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
          <h1 id="wizard-title" class="text-2xl sm:text-3xl font-gt-walsheim-bold text-gray-900 mb-3 leading-tight">
            {currentStepData.title}
          </h1>
          <p class="text-gray-600 text-base mb-4 leading-relaxed">
            {currentStepData.subtitle}
          </p>
          

        </div>
        
        <!-- Step Field -->
        <div class="mb-8">
          {#if currentStepData.field === 'name'}
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
          {:else if currentStepData.field === 'innovationMaturity'}
            <InnovationMaturitySlider
              bind:value={data.innovationMaturity}
              min={1}
              max={9}
              on:change={handleSliderChange}
            />
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