export const usePostHog = () => {
  const { $posthog } = useNuxtApp()
  const posthogClient = $posthog()

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

  // Initialize user identification
  const identifyUser = () => {
    if (!posthogClient) return
    
    const userId = getUserId()
    posthogClient.identify(userId)
    
    // Track page view with user info
    posthogClient.capture('$pageview', {
      user_type: 'anonymous_identified'
    })
  }

  // Track calendar preview view
  const trackCalendarPreview = () => {
    if (!posthogClient) return
    
    posthogClient.capture('calendar_preview_viewed', {
      timestamp: new Date().toISOString(),
      user_id: getUserId()
    })
  }

  // Track calendar download
  const trackCalendarDownload = () => {
    if (!posthogClient) return
    
    posthogClient.capture('calendar_downloaded', {
      timestamp: new Date().toISOString(),
      user_id: getUserId()
    })
  }

  // Track URL copy
  const trackUrlCopy = () => {
    if (!posthogClient) return
    
    posthogClient.capture('calendar_url_copied', {
      timestamp: new Date().toISOString(),
      user_id: getUserId()
    })
  }

  return {
    identifyUser,
    trackCalendarPreview,
    trackCalendarDownload,
    trackUrlCopy,
    getUserId
  }
}
