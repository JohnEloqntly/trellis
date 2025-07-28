<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide, scale, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let mounted = false;
  let isProcessing = false;
  let step = 1; // 1 = payment form, 2 = processing, 3 = success
  
  // Form data
  let paymentForm = {
    email: '',
    name: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    postalCode: ''
  };
  
  let errors: any = {};
  let searchParams = '';
  
  onMount(() => {
    mounted = true;
    // Get search params to pass back to results after payment
    searchParams = window.location.search;
  });
  
  function validateForm() {
    errors = {};
    
    // Simple validation - just check if fields have content
    if (!paymentForm.email || paymentForm.email.trim().length === 0) {
      errors.email = 'Please enter email address';
    }
    
    if (!paymentForm.name || paymentForm.name.trim().length === 0) {
      errors.name = 'Please enter name';
    }
    
    if (!paymentForm.cardNumber || paymentForm.cardNumber.trim().length === 0) {
      errors.cardNumber = 'Please enter card number';
    }
    
    if (!paymentForm.expiryMonth || !paymentForm.expiryYear) {
      errors.expiry = 'Please select expiry date';
    }
    
    if (!paymentForm.cvc || paymentForm.cvc.trim().length === 0) {
      errors.cvc = 'Please enter CVC';
    }
    
    if (!paymentForm.postalCode || paymentForm.postalCode.trim().length === 0) {
      errors.postalCode = 'Please enter postal code';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function processPayment() {
    if (!validateForm()) return;
    
    isProcessing = true;
    step = 2;
    
    // Simulate payment processing
    setTimeout(() => {
      // Mark payment as completed in localStorage
      localStorage.setItem('trellisPaymentStatus', 'paid');
      localStorage.setItem('trellisPaymentDate', new Date().toISOString());
      localStorage.setItem('trellisTrialStart', new Date().toISOString());
      step = 3;
      isProcessing = false;
    }, 3000);
  }
  
  function goToResults() {
    goto(`/results${searchParams}`);
  }
  
  function goBack() {
    goto(`/results${searchParams}`);
  }
  
  // Format card number with spaces
  function formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ');
    paymentForm.cardNumber = value.trim();
  }
  
  // Format CVC to numbers only
  function formatCVC(event: any) {
    paymentForm.cvc = event.target.value.replace(/\D/g, '').substring(0, 4);
  }
  
  // Format postal code
  function formatPostalCode(event: any) {
    paymentForm.postalCode = event.target.value.toUpperCase().substring(0, 8);
  }
</script>

<svelte:head>
  <title>Start Your Free Trial - Trellis</title>
  <meta name="description" content="Start your 14-day free trial and unlock access to thousands of grant opportunities" />
</svelte:head>

<!-- Modern Payment Layout -->
<div class="min-h-screen bg-gray-50 relative">
  
  <!-- Animated Background Elements -->
  <div class="absolute inset-0 pointer-events-none">
    <!-- Floating Orbs with Trellis Colors -->
    <div class="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary-blue/8 to-secondary-blue/8 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-secondary-blue/6 to-primary-blue/6 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    
    <!-- Subtle Grid Pattern -->
    <div class="absolute inset-0 opacity-[0.01]" style="background-image: radial-gradient(circle at 1px 1px, rgba(45,73,120,0.1) 1px, transparent 0); background-size: 50px 50px;"></div>
  </div>

  {#if mounted}
    {#if step === 1}
      <!-- Payment Form -->
      <div class="min-h-screen flex flex-col lg:flex-row relative z-10">
        
        <!-- Left Column - Pricing Info -->
        <div class="lg:w-5/12 flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-16" in:fly={{ x: -50, duration: 800 }}>
          <div class="max-w-lg mx-auto lg:mx-0 space-y-8">
            
            <!-- Back Button -->
            <button 
              on:click={goBack}
              class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
              in:fade={{ duration: 500, delay: 200 }}
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Results
            </button>
            
            <!-- Trellis Logo -->
            <div class="flex justify-center lg:justify-start mb-8" in:scale={{ duration: 600, delay: 400 }}>
              <div class="w-16 h-16 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-xl p-3">
                <img src="/trellis_logo_correct.png" alt="Trellis Logo" class="h-10 w-auto object-contain" />
              </div>
            </div>

            <!-- Heading -->
            <div class="text-center lg:text-left" in:fade={{ duration: 800, delay: 600 }}>
              <h1 class="text-4xl sm:text-5xl font-gt-walsheim-bold text-gray-900 mb-6 leading-tight">
                Start Your 
                <span class="bg-gradient-to-r from-primary-blue to-secondary-blue bg-clip-text text-transparent">
                  Free Trial
                </span>
              </h1>
              
              <p class="text-xl text-gray-600 font-gt-walsheim leading-relaxed mb-8">
                14 days free, then £29.99/month. Cancel anytime.
              </p>
            </div>

            <!-- Pricing Box -->
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8" in:slide={{ duration: 600, delay: 800 }}>
              <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center bg-gradient-to-r from-primary-blue/10 to-secondary-blue/10 rounded-2xl px-6 py-3 mb-4">
                  <div class="text-center mr-4">
                    <div class="text-3xl font-gt-walsheim-bold text-gray-900">FREE</div>
                    <div class="text-sm text-gray-600">14-day trial</div>
                  </div>
                  <div class="text-gray-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div class="text-center ml-4">
                    <div class="text-3xl font-gt-walsheim-bold text-gray-900">£29.99</div>
                    <div class="text-sm text-gray-600">per month</div>
                  </div>
                </div>
                <p class="text-sm text-gray-500">Cancel anytime during your free trial</p>
              </div>
              
              <!-- What's Included -->
              <div class="space-y-3">
                <h3 class="font-gt-walsheim-bold text-gray-900 mb-4">What's included:</h3>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-700 text-sm">Access to 2,000+ live grant opportunities</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-700 text-sm">Expert grant writer connections</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-700 text-sm">Detailed application guides & eligibility</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-700 text-sm">Priority notifications for new grants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Payment Form -->
        <div class="lg:w-7/12 flex flex-col justify-center relative min-h-screen" in:fly={{ x: 50, duration: 800, delay: 200 }}>
          
          <!-- Gradient Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary-blue to-secondary-blue">
            <!-- Subtle light effect overlay -->
            <div class="absolute inset-0 pointer-events-none">
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl" style="background: radial-gradient(circle, rgba(213, 228, 253, 0.15), rgba(213, 228, 253, 0.08), transparent);"></div>
              <div class="absolute top-20 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-2xl" style="background: radial-gradient(circle, rgba(213, 228, 253, 0.25), rgba(213, 228, 253, 0.12), transparent);"></div>
            </div>
          </div>
          
          <!-- Form Content -->
          <div class="relative z-10 p-6 sm:p-8 lg:p-12 xl:p-16 flex-1 flex flex-col justify-center">

            <!-- Form Container -->
            <div class="bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl p-8 relative overflow-hidden w-full max-w-2xl mx-auto" 
                 in:scale={{ duration: 600, delay: 800 }}>
              
              <!-- Inner Glow Effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl"></div>
              
              <!-- Form Content -->
              <div class="relative z-10">
                <h2 class="text-2xl font-gt-walsheim-bold text-gray-900 mb-6">Payment Details</h2>
                
                <form on:submit|preventDefault={processPayment} class="space-y-6">
                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      bind:value={paymentForm.email}
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                      placeholder="your@email.com"
                      class:border-red-300={errors.email}
                    />
                    {#if errors.email}
                      <p class="text-red-600 text-xs mt-1">{errors.email}</p>
                    {/if}
                  </div>

                  <!-- Full Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      bind:value={paymentForm.name}
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                      placeholder="John Doe"
                      class:border-red-300={errors.name}
                    />
                    {#if errors.name}
                      <p class="text-red-600 text-xs mt-1">{errors.name}</p>
                    {/if}
                  </div>

                  <!-- Card Number -->
                  <div>
                    <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      value={paymentForm.cardNumber}
                      on:input={formatCardNumber}
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                      placeholder="1234 5678 9012 3456"
                      class:border-red-300={errors.cardNumber}
                    />
                    {#if errors.cardNumber}
                      <p class="text-red-600 text-xs mt-1">{errors.cardNumber}</p>
                    {/if}
                  </div>

                  <!-- Expiry and CVC -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <div class="grid grid-cols-2 gap-2">
                        <select
                          bind:value={paymentForm.expiryMonth}
                          class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                          class:border-red-300={errors.expiry}
                        >
                          <option value="">MM</option>
                          {#each Array(12) as _, i}
                            <option value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                          {/each}
                        </select>
                        <select
                          bind:value={paymentForm.expiryYear}
                          class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                          class:border-red-300={errors.expiry}
                        >
                          <option value="">YY</option>
                          {#each Array(10) as _, i}
                            <option value={String(new Date().getFullYear() + i).slice(-2)}>{String(new Date().getFullYear() + i).slice(-2)}</option>
                          {/each}
                        </select>
                      </div>
                      {#if errors.expiry}
                        <p class="text-red-600 text-xs mt-1">{errors.expiry}</p>
                      {/if}
                    </div>

                    <div>
                      <label for="cvc" class="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input
                        id="cvc"
                        type="text"
                        value={paymentForm.cvc}
                        on:input={formatCVC}
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                        placeholder="123"
                        class:border-red-300={errors.cvc}
                      />
                      {#if errors.cvc}
                        <p class="text-red-600 text-xs mt-1">{errors.cvc}</p>
                      {/if}
                    </div>
                  </div>

                  <!-- Postal Code -->
                  <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      id="postalCode"
                      type="text"
                      value={paymentForm.postalCode}
                      on:input={formatPostalCode}
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                      placeholder="SW1A 1AA"
                      class:border-red-300={errors.postalCode}
                    />
                    {#if errors.postalCode}
                      <p class="text-red-600 text-xs mt-1">{errors.postalCode}</p>
                    {/if}
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-gt-walsheim-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                  >
                    Start Free Trial
                  </button>
                </form>

                <!-- Security Notice -->
                <div class="mt-6 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <p class="text-xs text-gray-500">
                      Secure payment • 256-bit SSL encryption • Cancel anytime
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Floating Elements -->
              <div class="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary-blue/10 to-secondary-blue/10 rounded-full blur-sm"></div>
              <div class="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-secondary-blue/10 to-primary-blue/10 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
    {:else if step === 2}
      <!-- Processing -->
      <div class="min-h-screen flex items-center justify-center relative z-10">
        <div 
          class="bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl p-12 text-center max-w-lg mx-auto"
          in:fade={{ duration: 500 }}
        >
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl mb-6">
              <svg class="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-gt-walsheim-bold text-gray-900 mb-4">
              Starting Your Free Trial
            </h2>
            <p class="text-gray-600 text-lg">
              Please wait while we set up your account...
            </p>
          </div>
          
          <div class="bg-gray-50 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">Setting up your trial...</span>
              <span class="text-primary-blue font-medium">FREE</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-primary-blue to-secondary-blue h-2 rounded-full animate-pulse" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>
      
    {:else if step === 3}
      <!-- Success -->
      <div class="min-h-screen flex items-center justify-center relative z-10">
        <div 
          class="bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl p-12 text-center max-w-2xl mx-auto"
          in:slide={{ duration: 600 }}
        >
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-2xl mb-6">
              <svg class="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            
            <h2 class="text-4xl font-gt-walsheim-bold text-gray-900 mb-4">
              <div class="flex items-center justify-center space-x-3">
                <span>Welcome to Your Free Trial!</span>
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
            </h2>
            
            <p class="text-gray-600 text-xl mb-8 leading-relaxed">
              Your 14-day free trial has started successfully. You now have full access to all grant details and expert connections.
            </p>
          </div>
          
          <!-- Trial Info -->
          <div class="bg-gradient-to-r from-primary-blue/5 to-secondary-blue/5 rounded-2xl p-6 mb-8">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-gt-walsheim-bold text-gray-900 mb-2">Trial Details</h3>
                <p class="text-sm text-gray-600 mb-1">• 14 days free access</p>
                <p class="text-sm text-gray-600 mb-1">• £29.99/month after trial</p>
                <p class="text-sm text-gray-600">• Cancel anytime</p>
              </div>
              <div>
                <h3 class="font-gt-walsheim-bold text-gray-900 mb-2">What's Unlocked</h3>
                <p class="text-sm text-gray-600 mb-1">• 2,000+ live grant opportunities</p>
                <p class="text-sm text-gray-600 mb-1">• Expert writer connections</p>
                <p class="text-sm text-gray-600">• Detailed application guides</p>
              </div>
            </div>
          </div>
          
          <!-- Email Confirmation -->
          <div class="bg-blue-50 rounded-2xl p-4 mb-8">
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <p class="text-blue-800 text-sm">
                A confirmation email has been sent to <strong>{paymentForm.email}</strong>
              </p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              on:click={goToResults}
              class="w-full bg-gradient-to-r from-primary-blue to-secondary-blue hover:from-primary-blue/90 hover:to-secondary-blue/90 text-white font-gt-walsheim-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              View Your Grants Now
            </button>
            <button
              on:click={() => goto('/portal')}
              class="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-gt-walsheim-bold py-4 px-8 rounded-2xl transition-all duration-300"
            >
              Go to Portal Dashboard
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div> 