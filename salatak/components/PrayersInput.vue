<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
import { usePrayerColors } from '~/composables/usePrayerColors';

const prayersStore = usePrayersStore()
const { prayers } = storeToRefs(prayersStore)
const { setPrayActive, setPrayDuration, setPrayRemainder, setPrayOffset, setPrayDisplayName, setPrayColor, setPrayEmoji } = prayersStore
const { getColor } = usePrayerColors()

// Handle duration input with validation
const handleDurationInput = (prayer: any, event: any) => {
  const value = event.target.value
  setPrayDuration(prayer, value)

  // Update the input value to reflect any corrections made by the store
  const updatedPrayer = prayersStore.getPray(prayer.name)
  if (updatedPrayer && updatedPrayer.duration !== Number(value)) {
    event.target.value = updatedPrayer.duration
  }
}

// Handle reminder input with validation
const handleReminderInput = (prayer: any, event: any) => {
  const value = event.target.value
  setPrayRemainder(prayer, value)

  // Update the input value to reflect any corrections made by the store
  const updatedPrayer = prayersStore.getPray(prayer.name)
  if (updatedPrayer && updatedPrayer.remainder !== Number(value)) {
    event.target.value = updatedPrayer.remainder
  }
}

// Handle offset input with validation
const handleOffsetInput = (prayer: any, event: any) => {
  const value = event.target.value
  setPrayOffset(prayer, value)

  // Update the input value to reflect any corrections made by the store
  const updatedPrayer = prayersStore.getPray(prayer.name)
  if (updatedPrayer && updatedPrayer.offset !== Number(value)) {
    event.target.value = updatedPrayer.offset
  }
}

// Get prayer color
const getPrayerColor = (prayerName: string) => {
  return getColor(prayerName as any)
}

</script>


<template>
  <div class="space-y-2">
    <div class="overflow-x-auto -mx-2 px-2">
      <table class="table table-compact table-zebra w-full">
        <thead>
          <tr>
            <th class="w-8 md:w-10 p-2"></th>
            <th class="text-xs md:text-sm p-2">
              <div class="flex items-center gap-1">
                {{ $t("Prayer") }}
                <div class="tooltip tooltip-bottom" :data-tip="$t('Click name to rename')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </div>
              </div>
            </th>
            <th class="text-xs p-2 w-px whitespace-nowrap">
              <div class="flex items-center gap-1">
                <span class="hidden sm:inline">{{ $t("Duration") }}</span>
                <span class="sm:hidden">Dur.</span>
                <div class="tooltip tooltip-bottom" :data-tip="$t('Duration in minutes (1-180)')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
              </div>
            </th>
            <th class="text-xs p-2 w-px whitespace-nowrap">
              <div class="flex items-center gap-1">
                <span class="hidden sm:inline">{{ $t("Offset") }}</span>
                <span class="sm:hidden">Off.</span>
                <div class="tooltip tooltip-bottom" :data-tip="$t('Offset in minutes (-60 to 60)')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
              </div>
            </th>
            <th class="text-xs p-2 w-px whitespace-nowrap">
              <div class="flex items-center gap-1">
                <span class="hidden sm:inline">{{ $t("Reminder") }}</span>
                <span class="sm:hidden">Alr.</span>
                <div class="tooltip tooltip-bottom" :data-tip="$t('Reminder in minutes (0-60, 0 to disable)')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prayer in prayers" :key="prayer.name" class="hover">
            <td class="p-2">
              <label class="cursor-pointer">
                <input
                  @input="(e: any) => { setPrayActive(prayer, e.target.checked) }"
                  type="checkbox"
                  class="checkbox checkbox-xs md:checkbox-sm checkbox-primary"
                  :checked="prayer.checked"
                />
              </label>
            </td>
            <td class="font-medium text-xs md:text-sm p-2">
              <div class="flex items-center gap-1.5">
                <input
                  type="text"
                  maxlength="8"
                  class="emoji-input flex-shrink-0"
                  :value="prayer.emoji || '🕋'"
                  :title="$t('Click to change emoji')"
                  @focus="(e: any) => e.target.select()"
                  @input="(e: any) => setPrayEmoji(prayer, e.target.value)"
                >
                <input
                  type="color"
                  class="color-swatch flex-shrink-0"
                  :value="prayer.color || getPrayerColor(prayer.name)"
                  :title="$t('Click to change color')"
                  @input="(e: any) => setPrayColor(prayer, e.target.value)"
                >
                <input
                  type="text"
                  maxlength="50"
                  class="prayer-name-input w-full font-medium text-xs md:text-sm bg-transparent border-none outline-none focus:outline-none cursor-pointer hover:opacity-70 focus:cursor-text"
                  :value="prayer.displayName || $t(prayer.name)"
                  :placeholder="$t(prayer.name)"
                  :aria-label="$t('Prayer name')"
                  @focus="(e: any) => { if (!prayer.displayName) e.target.select() }"
                  @input="(e: any) => setPrayDisplayName(prayer, e.target.value)"
                >
              </div>
            </td>
            <td class="p-2 w-px whitespace-nowrap">
              <input
                @input="(e: any) => handleDurationInput(prayer, e)"
                type="number"
                class="input input-xs input-bordered w-12 text-center"
                :value="prayer.duration"
                min="1"
                max="180"
                step="1"
                :placeholder="'15'"
              >
            </td>
            <td class="p-2 w-px whitespace-nowrap">
              <input
                @input="(e: any) => handleOffsetInput(prayer, e)"
                type="number"
                class="input input-xs input-bordered w-12 text-center"
                :value="prayer.offset"
                min="-60"
                max="60"
                step="1"
                :placeholder="'0'"
              >
            </td>
            <td class="p-2 w-px whitespace-nowrap">
              <input
                @input="(e: any) => handleReminderInput(prayer, e)"
                type="number"
                class="input input-xs input-bordered w-12 text-center"
                :value="prayer.remainder"
                min="0"
                max="60"
                step="1"
                :placeholder="'0'"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Quick info badge -->
    <div class="alert alert-info py-2 px-3 text-xs leading-tight">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4 hidden sm:block"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span class="text-[10px] sm:text-xs">
        <span class="hidden sm:inline">{{ $t("Duration: event length") }} | {{ $t("Offset: minutes before/after") }} | {{ $t("Reminder: minutes before prayer") }} | {{ $t("Click name to rename") }} | {{ $t("Click to change emoji") }} | {{ $t("Click to change color") }}</span>
        <span class="sm:hidden">{{ $t("Click name to rename") }} · {{ $t("Click to change emoji") }} · {{ $t("Click to change color") }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
[dir="rtl"] .checkbox:checked {
  background-image: linear-gradient(-45deg, transparent 65%, hsl(var(--chkbg)) 65.99%), linear-gradient(45deg, transparent 75%, hsl(var(--chkbg)) 75.99%), linear-gradient(-45deg, hsl(var(--chkbg)) 40%, transparent 40.99%), linear-gradient(45deg, hsl(var(--chkbg)) 30%, hsl(var(--chkfg)) 30.99%, hsl(var(--chkfg)) 40%, transparent 40.99%), linear-gradient(-45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);
}

/* Mobile-friendly table */
@media (max-width: 639px) {
  .table {
    font-size: 0.75rem;
  }
  
  .table :where(th, td) {
    padding: 0.5rem 0.25rem;
  }
  
  /* Ensure inputs don't zoom on iOS */
  input[type="number"] {
    font-size: 16px !important;
  }
}

/* Touch-friendly checkbox */
@media (hover: none) and (pointer: coarse) {
  .checkbox {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  label {
    padding: 0.25rem;
  }
}

/* Emoji input: shows current emoji, click to replace */
.emoji-input {
  width: 1.4rem;
  font-size: 0.85rem;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  line-height: 1;
}
.emoji-input:focus {
  outline: none;
  background: transparent;
}

/* Color swatch: native color picker styled as a dot */
.color-swatch {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  background: none;
}
.color-swatch::-webkit-color-swatch-wrapper { padding: 0; }
.color-swatch::-webkit-color-swatch { border: none; border-radius: 50%; }
.color-swatch::-moz-color-swatch { border: none; border-radius: 50%; }

/* Prayer name: always legible, editable on click */
.prayer-name-input {
  color: inherit;
  padding: 0;
  min-height: 0;
  height: auto;
  line-height: inherit;
}

.prayer-name-input:focus {
  background: transparent;
  box-shadow: none;
}

/* Better number input styling */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
