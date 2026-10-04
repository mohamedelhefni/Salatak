import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const { analyticsUrl } = useRuntimeConfig().public
  // Load the SDK from the Siraaj server itself instead of bundling the npm package.
  // Calls made before the script loads are queued and replayed after init.
  const queue = []
  let analytics = null
  const call = (method, ...args) => (analytics ? analytics[method](...args) : queue.push([method, args]))

  const load = (file, onload) => {
    const script = document.createElement('script')
    script.src = `${analyticsUrl}/sdk/${file}`
    script.defer = true
    script.onload = onload
    document.head.appendChild(script)
  }

  load('analytics.min.js', () => {
    analytics = window.SiraajAnalytics.analytics
    analytics.init({
      apiUrl: analyticsUrl,
      projectId: 'salatak',
      autoTrack: true,
      debug: import.meta.dev,
      trackingToken: "siraaj_trk_hHEjN9y7SNXAU7g9AKKMwQqfktID5W4w4lwIYTc2pV0"
    });
    queue.forEach(([method, args]) => analytics[method](...args))
    // Session replay (rrweb, ~23KB gzipped) loads only after init. Inputs are always masked.
    load('replay.min.js', () => window.SiraajReplay.startReplay(analytics))
  })

  return {
    provide: {
      siraaj: {
        track: (name, properties) => call('track', name, properties),
        identify: (userId, traits) => call('identify', userId, traits),
      }
    }
  }
});
