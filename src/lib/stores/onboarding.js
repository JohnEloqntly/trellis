import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initial onboarding data structure
const initialData = {
  // Personal contact details
  name: '',
  email: '',
  phone: '',

  // Company information
  companyName: '',
  employeeCount: '',
  companyAge: '',
  website: '',
  sector: '',

  // Project information
  projectName: '',
  problemStatement: '',
  solutionApproach: '',
  technologyType: '',
  crossSectors: '',
  innovationMaturity: 5,
  previousGrantFunding: '',
  
  // Narrative
  elevatorPitch: ''
};

// Create the store
function createOnboardingStore() {
  let storedData = initialData;
  
  // Load from localStorage if in browser
  if (browser) {
    const stored = localStorage.getItem('trellisOnboarding');
    if (stored) {
      try {
        storedData = { ...initialData, ...JSON.parse(stored) };
      } catch (e) {
        console.warn('Failed to parse stored onboarding data');
      }
    }
  }

  const { subscribe, set, update } = writable(storedData);

  return {
    subscribe,
    /**
     * @param {string} field
     * @param {any} value
     */
    updateField: (field, value) => {
      update(data => {
        const newData = { ...data, [field]: value };
        
        // Persist to localStorage
        if (browser) {
          localStorage.setItem('trellisOnboarding', JSON.stringify(newData));
        }
        
        return newData;
      });
    },
    reset: () => {
      set(initialData);
      if (browser) {
        localStorage.removeItem('trellisOnboarding');
      }
    },
    set
  };
}

export const onboardingData = createOnboardingStore();

// Current step store
export const currentStep = writable(1);

// Validation store
export const validationErrors = writable({});

// Technology type options
export const technologyOptions = [
  'Artificial Intelligence & Machine Learning',
  'Biotechnology & Life Sciences',
  'Clean Energy & Sustainability',
  'Digital Health & MedTech',
  'Financial Technology (FinTech)',
  'Advanced Manufacturing',
  'Robotics & Automation',
  'Quantum Computing',
  'Cybersecurity',
  'Space Technology',
  'Materials Science',
  'Internet of Things (IoT)',
  'Blockchain & Distributed Ledger',
  'Augmented/Virtual Reality',
  'Other'
];

// Sector options
export const sectorOptions = [
  'Healthcare & Life Sciences',
  'Technology & Software',
  'Energy & Environment',
  'Manufacturing & Industrial',
  'Financial Services',
  'Education & Training',
  'Agriculture & Food',
  'Transportation & Logistics',
  'Creative & Media',
  'Social Impact & Non-profit',
  'Defense & Security',
  'Aerospace',
  'Other'
];

// NASA TRL (Technology Readiness Level) descriptions
export const trlDescriptions = {
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