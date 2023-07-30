<script setup lang="ts">
import { PhMoon, PhSun } from '@phosphor-icons/vue';
import { useUiStore } from '~/stores/uiStore';
const uiStore = useUiStore()

</script>
<template>
    <div class="navbar bg-base-300">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">🕋 <span class="mt-1">{{ $t("salatak") }}</span></a>
        </div>
        <div class="flex items-center ">
            <div class="">
                <NuxtLink to="/en" v-if="$i18n.locale == 'ar'">English</NuxtLink>
                <NuxtLink to="/ar" v-else>ع</NuxtLink>
            </div>
            <button class="btn btn-ghost btn-circle" @click="uiStore.toggleTheme()">
                <PhSun v-if="uiStore.theme == 'dark'" :size="24" />
                <PhMoon v-else :size="24" />
            </button>

        </div>
    </div>
</template>