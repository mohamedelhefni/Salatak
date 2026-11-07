// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      analyticsUrl: 'https://analytics.hefni101.dev',
    }
  },
  devtools: { enabled: true },
  nitro: { preset: 'cloudflare_module' },
  compatibilityDate: '2026-09-25',
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: ['en', 'ar'],
    vueI18n: './i18n.config.ts'
  },
  app: {
    head: {
      title: 'Salatak · صلاتك — Prayer Times in Your Calendar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Free prayer times calendar: add accurate Fajr to Isha times for your city to Google Calendar, Apple Calendar or Outlook, with reminders.' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'application-name', content: 'Salatak' },
        { name: 'apple-mobile-web-app-title', content: 'Salatak' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Salatak · صلاتك' },
        { property: 'og:title', content: 'Salatak · صلاتك — Prayer Times in Your Calendar' },
        { property: 'og:description', content: 'Add accurate prayer times for your city to Google, Apple or Outlook calendar, with reminders. Free.' },
        { property: 'og:url', content: 'https://salatak.online/' },
        { property: 'og:image', content: 'https://salatak.online/og.png?v=2' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'أوقات الصلاة في تقويمك — Salatak' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'ar_AR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Salatak · صلاتك — Prayer Times in Your Calendar' },
        { name: 'twitter:description', content: 'Add accurate prayer times for your city to Google, Apple or Outlook calendar, with reminders. Free.' },
        { name: 'twitter:image', content: 'https://salatak.online/og.png?v=2' },
        { name: 'google-site-verification', content: 'H8WCxUrzjlC4jvBfHu0MkxkaUKfNq6YRKmu1QjkmFIM' },
      ],
      link: [
        { rel: 'canonical', href: 'https://salatak.online/' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      script: [
        { type: 'application/ld+json', innerHTML: JSON.stringify({"@context": "https://schema.org", "@graph": [{"@type": "WebSite", "@id": "https://salatak.online/#website", "url": "https://salatak.online/", "name": "Salatak", "alternateName": "صلاتك", "inLanguage": ["en", "ar"]}, {"@type": "WebApplication", "@id": "https://salatak.online/#app", "name": "Salatak", "alternateName": "صلاتك", "url": "https://salatak.online/", "image": "https://salatak.online/og.png?v=2", "description": "Add accurate prayer times for your city to Google, Apple or Outlook calendar, with reminders. Free.", "applicationCategory": "LifestyleApplication", "operatingSystem": "Any (web)", "browserRequirements": "Requires JavaScript", "inLanguage": ["en", "ar"], "isAccessibleForFree": true, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "featureList": ["Prayer times for any location worldwide", "Export to Google Calendar, Apple Calendar and Outlook (.ics)", "Calendar subscription link", "Reminders before each prayer", "Multiple calculation methods and Hanafi/Shafi Asr", "Jumu'ah, custom durations and offsets", "Arabic and English"], "author": {"@type": "Person", "name": "Mohamed Elhefni"}}]}) },
      ],
      htmlAttrs: {
        lang: 'en', // Default language
      },
    },
  }

})
