// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-phosphor-icons',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',

  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      'storeToRefs',

      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    vueI18n: './i18n.config.ts' // if you are using custom path, default 
  },
  app: {
    head: {
      title: 'Salatak - Your Prayer Times Companion',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Salatak helps you generate and download ICS files for prayer times. Easily sync prayer schedules to your calendar and stay connected to your faith.' },
        { hid: 'og:title', property: 'og:title', content: 'Salatak - Your Prayer Times Companion' },
        { hid: 'og:description', property: 'og:description', content: 'Salatak helps you generate and download ICS files for prayer times. Easily sync prayer schedules to your calendar and stay connected to your faith.' },
        { hid: 'og:image', property: 'og:image', content: 'https://salatak.netlify.app/images/salatak-og-image.jpg' },
        { hid: 'og:url', property: 'og:url', content: 'https://salatak.netlify.app/' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Salatak - Your Prayer Times Companion' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Salatak helps you generate and download ICS files for prayer times. Easily sync prayer schedules to your calendar and stay connected to your faith.' },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://salatak.netlify.app/images/salatak-twitter-image.jpg' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://salatak.netlify.app/' },
      ],
      htmlAttrs: {
        lang: 'en', // Default language
      },
    },
  }

})
