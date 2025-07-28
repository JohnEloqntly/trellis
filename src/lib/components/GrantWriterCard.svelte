<script lang="ts">
  export let grantWriter;
  
  let imageLoaded = false;
  let imageError = false;
  
  function handleImageLoad() {
    imageLoaded = true;
  }
  
  function handleImageError() {
    imageError = true;
    imageLoaded = true; // Still show fallback
  }
</script>

<div class="grant-writer-card group">
  <!-- Avatar -->
  <div class="flex justify-center mb-6">
    <div class="relative">
      <!-- Image placeholder that shows on error -->
      <div class="avatar-placeholder" class:loaded={imageLoaded} class:error={imageError}>
        <div class="placeholder-circle"></div>
      </div>
      
      <img 
        src={grantWriter.avatar} 
        alt={`${grantWriter.name} profile picture`}
        class="avatar-image"
        class:loaded={imageLoaded}
        class:error={imageError}
        on:load={handleImageLoad}
        on:error={handleImageError}
        loading="lazy"
        decoding="async"
      />
      
      <div class="experience-badge">
        {grantWriter.yearsExperience}+ years
      </div>
    </div>
  </div>
  
  <!-- Name -->
  <h3 class="writer-name">
    {grantWriter.name}
  </h3>
  
  <!-- Title -->
  <p class="writer-title">
    {grantWriter.title}
  </p>
  
  <!-- Sector chip -->
  <div class="flex justify-center mb-4">
    <span class="sector-chip">
      {grantWriter.sector}
    </span>
  </div>
  
  <!-- Stats -->
  {#if grantWriter.successRate}
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{grantWriter.successRate}%</div>
          <div class="stat-label">Success Rate</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">£{grantWriter.totalFunding}</div>
          <div class="stat-label">Total Secured</div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .grant-writer-card {
    flex-shrink: 0;
    width: 16rem;
    background-color: white;
    border-radius: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    will-change: transform, box-shadow;
  }
  
  @media (min-width: 640px) {
    .grant-writer-card {
      width: 18rem;
      padding: 1.5rem;
    }
  }
  
  @media (min-width: 768px) {
    .grant-writer-card {
      width: 20rem;
      padding: 2rem;
    }
  }
  
  .grant-writer-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    background-color: #f0f8ff;
  }
  
  .avatar-placeholder {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    border: 4px solid #e5e7eb;
    transition: opacity 0.2s ease;
    opacity: 0;
  }
  
  @media (min-width: 640px) {
    .avatar-placeholder {
      width: 6rem;
      height: 6rem;
    }
  }
  
  @media (min-width: 768px) {
    .avatar-placeholder {
      width: 8rem;
      height: 8rem;
    }
  }
  
  .avatar-placeholder.loaded {
    opacity: 0;
  }
  
  .avatar-placeholder.error {
    opacity: 1;
  }
  
  .placeholder-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #f3f4f6;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .avatar-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #e5e7eb;
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  
  @media (min-width: 640px) {
    .avatar-image {
      width: 6rem;
      height: 6rem;
    }
  }
  
  @media (min-width: 768px) {
    .avatar-image {
      width: 8rem;
      height: 8rem;
    }
  }
  
  .avatar-image.loaded {
    opacity: 1;
  }
  
  .avatar-image.error {
    opacity: 0;
  }
  
  .experience-badge {
    position: absolute;
    bottom: -0.25rem;
    right: -0.25rem;
    background: linear-gradient(to right, #2563eb, #1d4ed8);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.25rem;
    border-radius: 9999px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  @media (min-width: 640px) {
    .experience-badge {
      bottom: -0.5rem;
      right: -0.5rem;
      padding: 0.25rem 0.5rem;
    }
  }
  
  .writer-name {
    font-family: 'GT Walsheim', sans-serif;
    font-weight: bold;
    color: #111827;
    font-size: 1.125rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  @media (min-width: 640px) {
    .writer-name {
      font-size: 1.25rem;
    }
  }
  
  @media (min-width: 768px) {
    .writer-name {
      font-size: 1.5rem;
    }
  }
  
  .writer-title {
    color: #6b7280;
    text-align: center;
    margin-bottom: 1rem;
    font-family: 'GT Walsheim', sans-serif;
    font-size: 0.875rem;
  }
  
  @media (min-width: 640px) {
    .writer-title {
      font-size: 1rem;
    }
  }
  
  .sector-chip {
    background-color: #fdf2f8;
    color: #be185d;
    border: 1px solid #fbcfe8;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
  
  .grant-writer-card:hover .sector-chip {
    background-color: #fce7f3;
    border-color: #f9a8d4;
  }
  
  .stats-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .stats-grid {
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  
  .stat-item {
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-family: 'GT Walsheim', sans-serif;
    font-weight: bold;
    color: #111827;
  }
  
  .stat-label {
    color: #6b7280;
    font-size: 0.75rem;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
