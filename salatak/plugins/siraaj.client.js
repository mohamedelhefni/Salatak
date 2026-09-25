import { defineNuxtPlugin } from '#app'
import analytics from '@hefni101/siraaj';

// plugins/siraaj.client.js
export default defineNuxtPlugin(() => {
  analytics.init({
    apiUrl: useRuntimeConfig().public.analyticsUrl,
    projectId: 'salatak',
    autoTrack: true,
    debug: true,
    trackingToken: "siraaj_trk_hHEjN9y7SNXAU7g9AKKMwQqfktID5W4w4lwIYTc2pV0"
  });
  return {
    provide: {
      siraaj: () => analytics
    }
  }
});

