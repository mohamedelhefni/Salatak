<script setup lang="ts">
import { useUiStore } from '~/stores/uiStore';
const uiStore = useUiStore()

</script>
<template>
  <div class="navbar bg-base-300 px-10">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">🕋 <span class="mt-1">{{ $t("salatak") }}</span></a>
    </div>
    <div class="flex items-center gap-3 ">
      <div class="">
        <NuxtLink to="/en" v-if="$i18n.locale == 'ar'">English</NuxtLink>
        <NuxtLink to="/ar" v-else>ع</NuxtLink>
      </div>
      <button class="btn btn-ghost btn-circle" @click="uiStore.toggleTheme()">
        <IconsSun v-if="uiStore.theme == 'dark'" class="w-6 h-6" />
        <IconsMoon v-else class="w-6 h-6" />
      </button>
      <NuxtLink href="https://github.com/mohamedelhefni/salatak" target="_blank">
        <IconsGithub class="w-6 h-6 " :class="{ 'fill-white': uiStore.theme == 'dark' }" />
      </NuxtLink>
    </div>
  </div>
</template>
