import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Simple validation - just check that basic fields exist
    if (!data.name || !data.companyName) {
      return json(
        { error: 'Please provide at least a name and company' },
        { status: 400 }
      );
    }
    
    // Here you would typically:
    // 1. Save to database
    // 2. Trigger grant matching algorithm
    // 3. Send to CRM/email service
    // 4. Log for analytics
    
    console.log('Onboarding submission received:', {
      name: data.name,
      email: data.email,
      company: data.companyName,
      sector: data.sector,
      technology: data.technologyType,
      maturity: data.innovationMaturity
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return json({
      success: true,
      message: 'Onboarding completed successfully',
      userId: `user_${Date.now()}`, // Generate temporary user ID
      searchId: `search_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Onboarding API error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 