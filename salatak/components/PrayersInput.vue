<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
import { usePrayerColors } from '~/composables/usePrayerColors';

const prayersStore = usePrayersStore()
const { prayers } = storeToRefs(prayersStore)
const { setPrayActive, setPrayDuration, setPrayRemainder, setPrayOffset, setPrayDisplayName, setPrayColor, setPrayEmoji } = prayersStore
const { getColor } = usePrayerColors()

const fields = [
  { key: 'duration', label: 'Duration', help: 'Duration in minutes (1-180)', min: 1, max: 180, set: setPrayDuration },
  { key: 'offset', label: 'Offset', help: 'Offset in minutes (-60 to 60)', min: -60, max: 60, set: setPrayOffset },
  { key: 'remainder', label: 'Reminder', help: 'Reminder in minutes (0-60, 0 to disable)', min: 0, max: 60, set: setPrayRemainder },
] as const
</script>

<template>
  <ul class="space-y-3">
    <li
      v-for="prayer in prayers"
      :key="prayer.name"
      class="rounded-lg border border-default p-3 transition-opacity"
      :class="{ 'opacity-60': !prayer.checked }"
    >
      <div class="flex items-center gap-2">
        <USwitch
          :model-value="prayer.checked"
          :aria-label="$t(prayer.name)"
          @update:model-value="(v) => setPrayActive(prayer, v)"
        />
        <input
          type="text"
          maxlength="8"
          class="w-7 shrink-0 cursor-pointer bg-transparent text-center text-lg focus:outline-none"
          :value="prayer.emoji || '🕋'"
          :title="$t('Click to change emoji')"
          :aria-label="$t('Click to change emoji')"
          @focus="(e: any) => e.target.select()"
          @input="(e: any) => setPrayEmoji(prayer, e.target.value)"
        >
        <input
          type="color"
          class="color-swatch size-5 shrink-0 cursor-pointer"
          :value="prayer.color || getColor(prayer.name)"
          :title="$t('Click to change color')"
          :aria-label="$t('Click to change color')"
          @input="(e: any) => setPrayColor(prayer, e.target.value)"
        >
        <UInput
          :model-value="prayer.displayName"
          :placeholder="$t(prayer.name)"
          :aria-label="$t('Prayer name')"
          :title="$t('Click name to rename')"
          maxlength="50"
          variant="ghost"
          trailing-icon="i-lucide-pencil"
          class="min-w-0 flex-1"
          :ui="{ base: 'font-medium', trailingIcon: 'size-3.5 opacity-50' }"
          @update:model-value="(v) => setPrayDisplayName(prayer, v)"
        />
      </div>

      <div v-if="prayer.checked" class="mt-3 grid grid-cols-3 gap-2">
        <UFormField
          v-for="field in fields"
          :key="field.key"
          :label="$t(field.label)"
          :hint="$t('min')"
          :title="$t(field.help)"
          size="xs"
        >
          <UInputNumber
            :model-value="prayer[field.key]"
            :min="field.min"
            :max="field.max"
            size="sm"
            orientation="vertical"
            class="w-full"
            @update:model-value="(v) => field.set(prayer, v ?? 0)"
          />
        </UFormField>
      </div>
    </li>
  </ul>
  <p class="mt-3 text-xs text-muted">
    {{ $t("Duration: event length") }} · {{ $t("Offset: minutes before/after") }} · {{ $t("Reminder: minutes before prayer") }}
  </p>
</template>

<style scoped>
.color-swatch {
  border: none;
  padding: 0;
  border-radius: 9999px;
  overflow: hidden;
  background: none;
}
.color-swatch::-webkit-color-swatch-wrapper { padding: 0; }
.color-swatch::-webkit-color-swatch { border: none; border-radius: 9999px; }
.color-swatch::-moz-color-swatch { border: none; border-radius: 9999px; }
</style>
