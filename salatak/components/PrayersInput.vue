<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';

const prayersStore = usePrayersStore()
const { prayers } = storeToRefs(prayersStore)
const { setPrayActive, setPrayDuration, setPrayRemainder, setPrayOffset } = prayersStore

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

</script>


<template>
  <div class="space-y-2">
    <div class="overflow-x-auto -mx-2 px-2">
      <table class="table table-compact table-zebra w-full">
        <thead>
          <tr>
            <th class="w-8 md:w-10 p-2"></th>
            <th class="text-xs md:text-sm p-2">{{ $t("Prayer") }}</th>
            <th class="text-xs p-2">
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
            <th class="text-xs p-2">
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
              {{ $t(prayer.name) }}
            </td>
            <td class="p-2">
              <input 
                @input="(e: any) => handleDurationInput(prayer, e)" 
                type="number" 
                class="input input-xs input-bordered w-14 md:w-16 text-center"
                :value="prayer.duration"
                min="1"
                max="180"
                step="1"
                :placeholder="'15'"
              >
            </td>
            <td class="p-2">
              <input 
                @input="(e: any) => handleOffsetInput(prayer, e)" 
                type="number" 
                class="input input-xs input-bordered w-14 md:w-16 text-center"
                :value="prayer.offset"
                min="-60"
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
        <span class="hidden sm:inline">{{ $t("Duration: event length") }} | {{ $t("Offset: minutes before/after") }}</span>
        <span class="sm:hidden">Duration: length | Offset: +/- mins</span>
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
