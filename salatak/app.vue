<script setup lang="ts">
import { useUiStore } from '~/stores/uiStore';
const uiStore = useUiStore()


</script>
<template >
  <div :data-theme="uiStore.theme" class="min-h-screen w-full h-full flex flex-col"
    :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'">
    <Navbar />
    <TheApp />
  </div>
</template>
