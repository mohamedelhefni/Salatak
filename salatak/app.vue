<script setup lang="ts">
import { ar, en } from '@nuxt/ui/locale'

const { locale } = useI18n()
const uiLocale = computed(() => (locale.value === 'ar' ? ar : en))

useHead({
  htmlAttrs: {
    lang: () => uiLocale.value.code,
    dir: () => uiLocale.value.dir
  }
})

// Identify user on app mount for PostHog tracking
onMounted(() => {
  const { identifyUser } = usePostHog()
  identifyUser()
})
</script>

<template>
  <UApp :locale="uiLocale" :toaster="{ position: 'top-center' }">
    <div class="min-h-dvh flex flex-col bg-default">
      <Navbar />
      <main class="flex-1">
        <TheApp />
      </main>
    </div>
  </UApp>
</template>
