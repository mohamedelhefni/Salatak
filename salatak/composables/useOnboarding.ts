export const useOnboarding = () => {
  const ONBOARDING_KEY = 'salatak-onboarding-completed';
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    if (process.client) {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    }
    return false;
  };
  
  // Mark onboarding as completed
  const completeOnboarding = () => {
    if (process.client) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  };
  
  // Reset onboarding (for testing or user request)
  const resetOnboarding = () => {
    if (process.client) {
      localStorage.removeItem(ONBOARDING_KEY);
    }
  };
  
  // Check if this is a new user (no settings saved)
  const isNewUser = () => {
    if (process.client) {
      // Check if user has any saved settings
      const hasLocation = localStorage.getItem('prayers-location');
      const hasSettings = localStorage.getItem('prayers-settings');
      return !hasLocation && !hasSettings && !hasCompletedOnboarding();
    }
    return false;
  };
  
  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    isNewUser
  };
};