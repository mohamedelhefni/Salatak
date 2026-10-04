export const useAnalytics = () => {
  const { $siraaj } = useNuxtApp()

  // Generate a persistent unique user ID
  const getUserId = () => {
    const USER_ID_KEY = 'salatak_user_id'

    // Check if user ID exists in localStorage
    let userId = localStorage.getItem(USER_ID_KEY)

    if (!userId) {
      // Generate a readable unique ID: salatak_user_[timestamp]_[random]
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 9)
      userId = `salatak_user_${timestamp}_${random}`
      localStorage.setItem(USER_ID_KEY, userId)
    }

    return userId
  }

  // Keep the id PostHog used so returning visitors stay the same user. Page views are auto-tracked.
  const identifyUser = () => $siraaj.identify(getUserId())

  // Event names double as survey triggers in the Siraaj dashboard.
  const trackCalendarPreview = () => $siraaj.track('calendar_preview_viewed')
  const trackCalendarPreviewClick = () => $siraaj.track('calendar_preview_clicked')
  const trackCalendarDownload = () => $siraaj.track('calendar_downloaded')
  const trackUrlCopy = () => $siraaj.track('calendar_url_copied')

  // Track which wizard step the user reached (for a funnel in Siraaj)
  const trackStep = (step: string, stepNumber: number) =>
    $siraaj.track('wizard_step_viewed', { step, step_number: stepNumber })

  return {
    identifyUser,
    trackStep,
    trackCalendarPreview,
    trackCalendarPreviewClick,
    trackCalendarDownload,
    trackUrlCopy,
    getUserId
  }
}
