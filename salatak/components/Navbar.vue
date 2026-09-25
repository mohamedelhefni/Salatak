<script setup lang="ts">
const colorMode = useColorMode()
const { locale, setLocale } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')
const toggleTheme = () => { colorMode.preference = isDark.value ? 'light' : 'dark' }
const toggleLocale = () => setLocale(locale.value === 'ar' ? 'en' : 'ar')
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
      <span class="flex items-center gap-2 text-lg font-semibold">
        <span aria-hidden="true">🕋</span>
        {{ $t("salatak") }}
      </span>
      <div class="flex items-center gap-1">
        <UButton
          color="neutral"
          variant="ghost"
          :label="locale === 'ar' ? 'English' : 'العربية'"
          @click="toggleLocale"
        />
        <ClientOnly>
          <UButton
            color="neutral"
            variant="ghost"
            :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
            :aria-label="isDark ? 'Light mode' : 'Dark mode'"
            @click="toggleTheme"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-simple-icons-github"
          to="https://github.com/mohamedelhefni/salatak"
          target="_blank"
          aria-label="GitHub"
        />
      </div>
    </div>
  </header>
</template>
