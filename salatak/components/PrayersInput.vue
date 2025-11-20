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
  <div class="flex flex-col gap-3 ml-1 my-5">
    <h3 class="font-bold text-xl">{{ $t("Prayers") }}</h3>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>
            </th>
            <th>{{ $t("Prayer") }}</th>
            <th>{{ $t("Duration") }} ({{ $t("minutes") }})</th>
            <th>{{ $t("Offset") }} ({{ $t("minutes") }})</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prayer in prayers" :key="prayer.name">
            <th>
              <label>
                <input @input="(e: any) => { setPrayActive(prayer, e.target.checked) }" type="checkbox" class="checkbox"
                  :checked="prayer.checked" />
              </label>
            </th>
            <td>
              {{ $t(prayer.name) }}
            </td>
            <td>
              <input 
                @input="(e: any) => handleDurationInput(prayer, e)" 
                type="number" 
                class="input w-20"
                :value="prayer.duration"
                min="1"
                max="180"
                step="1"
                :placeholder="$t('minutes')"
                title="Duration in minutes (1-180)"
              >
            </td>
            <td>
              <input 
                @input="(e: any) => handleOffsetInput(prayer, e)" 
                type="number" 
                class="input w-20"
                :value="prayer.offset"
                min="-60"
                max="60"
                step="1"
                :placeholder="$t('minutes')"
                title="Offset in minutes (-60 to 60)"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style>
[dir="rtl"] .checkbox:checked {
  background-image: linear-gradient(-45deg, transparent 65%, hsl(var(--chkbg)) 65.99%), linear-gradient(45deg, transparent 75%, hsl(var(--chkbg)) 75.99%), linear-gradient(-45deg, hsl(var(--chkbg)) 40%, transparent 40.99%), linear-gradient(45deg, hsl(var(--chkbg)) 30%, hsl(var(--chkfg)) 30.99%, hsl(var(--chkfg)) 40%, transparent 40.99%), linear-gradient(-45deg, hsl(var(--chkfg)) 50%, hsl(var(--chkbg)) 50.99%);
}
</style>
