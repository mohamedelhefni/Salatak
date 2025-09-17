// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      posthogPublicKey: 'phc_KeGTxoocJ5h4e5ikDSxqx2zYAriw7MjaazetmmC28LX',
      posthogHost: 'https://us.i.posthog.com',
      posthogDefaults: '2025-05-24'
    }
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
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
        { hid: 'og:image', property: 'og:image', content: 'https://og.tailgraph.com/og?fontFamily=Roboto&title=Salatak&titleTailwind=font-bold%20text-6xl%20text-emerald-800&titleFontFamily=Roboto&text=Schedule%20your%20prayer%20times%20now%20!%20&textTailwind=text-gray-700%20text-2xl%20mt-4&logoTailwind=h-8&bgTailwind=bg-white&footer=tailgraph.com&footerTailwind=text-teal-600&t=1738073382939&refresh=1' },
        { hid: 'og:url', property: 'og:url', content: 'https://salatak.vercel.app/' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Salatak - Your Prayer Times Companion' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'Salatak helps you generate and download ICS files for prayer times. Easily sync prayer schedules to your calendar and stay connected to your faith.' },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://og.tailgraph.com/og?fontFamily=Roboto&title=Salatak&titleTailwind=font-bold%20text-6xl%20text-emerald-800&titleFontFamily=Roboto&text=Schedule%20your%20prayer%20times%20now%20!%20&textTailwind=text-gray-700%20text-2xl%20mt-4&logoTailwind=h-8&bgTailwind=bg-white&footer=tailgraph.com&footerTailwind=text-teal-600&t=1738073382939&refresh=1' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://salatak.vercel.app/' },
      ],
      htmlAttrs: {
        lang: 'en', // Default language
      },
    },
  }

})
