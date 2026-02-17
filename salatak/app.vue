<script setup lang="ts">
import { useUiStore } from '~/stores/uiStore';
const uiStore = useUiStore()

// Identify user on app mount for PostHog tracking
onMounted(() => {
  const { identifyUser } = usePostHog()
  identifyUser()
})

</script>
<template >
  <div :data-theme="uiStore.theme" class="min-h-screen w-full flex flex-col bg-base-100"
    :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
    <Navbar />
    <div class="flex-1 overflow-y-auto">
      <TheApp />
    </div>
  </div>
</template>
