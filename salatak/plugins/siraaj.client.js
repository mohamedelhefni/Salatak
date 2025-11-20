import { defineNuxtPlugin } from '#app'
import analytics from '@hefni101/siraaj';

// plugins/siraaj.client.js
export default defineNuxtPlugin(() => {
  analytics.init({
    apiUrl: useRuntimeConfig().public.analyticsUrl,
    projectId: 'salatak',
    autoTrack: true,
    debug: true
  });
  return {
    provide: {
      siraaj: () => analytics
    }
  }
});

