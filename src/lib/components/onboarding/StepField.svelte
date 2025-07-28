<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  
  export let type = 'text';
  export let label = '';
  export let value = '';
  export let placeholder = '';
  export let required = true;
  export let autofocus = false;
  export let autocomplete = '';
  export let error = '';
  export let maxlength = null;
  export let minlength = null;
  export let options = [];
  export let min = null;
  export let max = null;
  export let step = null;
  
  const dispatch = createEventDispatcher();
  let inputElement;
  let characterCount = 0;
  
  onMount(() => {
    if (autofocus && inputElement) {
      inputElement.focus();
    }
  });
  
  function handleInput(event) {
    const newValue = event.target.value;
    value = newValue;
    characterCount = newValue.length;
    dispatch('input', { value: newValue });
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' && type !== 'textarea') {
      event.preventDefault();
      dispatch('enter');
    }
  }
  
  $: isValid = validateField(value, type, required, minlength, maxlength);
  
  function validateField(val, fieldType, isRequired, minLen, maxLen) {
    if (isRequired && !val.trim()) return false;
    
    switch (fieldType) {
      case 'email':
        return !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      case 'url':
        try {
          new URL(val.startsWith('http') ? val : `https://${val}`);
          return true;
        } catch {
          return !val || false;
        }
      case 'tel':
        return !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''));
      default:
        if (minLen && val.length < minLen) return false;
        if (maxLen && val.length > maxLen) return false;
        return true;
    }
  }
</script>

<div class="space-y-2">
  <label for={`field-${label}`} class="block text-sm font-semibold text-gray-900">
    {label}
    {#if required}<span class="text-cta-pink">*</span>{/if}
  </label>
  
  {#if type === 'select'}
    <select
      id={`field-${label}`}
      bind:this={inputElement}
      bind:value
      on:change={handleInput}
      on:keydown={handleKeydown}
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 text-gray-900 bg-white"
      class:border-red-300={error}
      class:focus:ring-red-500={error}
      {autocomplete}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${label}-error` : null}
    >
      <option value="">{placeholder}</option>
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  {:else if type === 'textarea'}
    <textarea
      id={`field-${label}`}
      bind:this={inputElement}
      bind:value
      on:input={handleInput}
      on:keydown={handleKeydown}
      rows="4"
      {placeholder}
      {maxlength}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 resize-none text-gray-900 bg-white"
      class:border-red-300={error}
      class:focus:ring-red-500={error}
      {autocomplete}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${label}-error` : null}
    />
    {#if maxlength}
      <div class="text-right text-xs text-gray-500">
        {characterCount}/{maxlength} characters
      </div>
    {/if}
  {:else if type === 'range'}
    <div class="space-y-4">
      <input
        id={`field-${label}`}
        bind:this={inputElement}
        type="range"
        bind:value
        on:input={handleInput}
        {min}
        {max}
        {step}
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        aria-invalid={error ? 'true' : 'false'}
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>1 - Basic research</span>
        <span class="font-medium">Level {value}</span>
        <span>9 - Market ready</span>
      </div>
    </div>
  {:else}
    {#if type === 'email'}
      <input
        id={`field-${label}`}
        bind:this={inputElement}
        type="email"
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        {placeholder}
        {autocomplete}
        {maxlength}
        {minlength}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 text-gray-900 bg-white"
        class:border-red-300={error}
        class:focus:ring-red-500={error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : null}
      />
    {:else if type === 'tel'}
      <input
        id={`field-${label}`}
        bind:this={inputElement}
        type="tel"
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        {placeholder}
        {autocomplete}
        {maxlength}
        {minlength}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 text-gray-900 bg-white"
        class:border-red-300={error}
        class:focus:ring-red-500={error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : null}
      />
    {:else if type === 'url'}
      <input
        id={`field-${label}`}
        bind:this={inputElement}
        type="url"
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        {placeholder}
        {autocomplete}
        {maxlength}
        {minlength}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 text-gray-900 bg-white"
        class:border-red-300={error}
        class:focus:ring-red-500={error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : null}
      />
    {:else}
      <input
        id={`field-${label}`}
        bind:this={inputElement}
        type="text"
        bind:value
        on:input={handleInput}
        on:keydown={handleKeydown}
        {placeholder}
        {autocomplete}
        {maxlength}
        {minlength}
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors duration-200 text-gray-900 bg-white"
        class:border-red-300={error}
        class:focus:ring-red-500={error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : null}
      />
    {/if}
  {/if}
  
  {#if error}
    <div 
      id={`${label}-error`}
      class="text-sm text-red-600"
      transition:slide={{ duration: 200 }}
      aria-live="polite"
    >
      {error}
    </div>
  {/if}
</div>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2D4978;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2D4978;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style> 