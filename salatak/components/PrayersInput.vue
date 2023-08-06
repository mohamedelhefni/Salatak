<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';

const prayersStore = usePrayersStore()
const { prayers } = storeToRefs(prayersStore)
const { setPrayActive, setPrayDuration, setPrayRemainder } = prayersStore
console.log("prayers", prayers.value)

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
            <th>{{ $t("Duration") }}</th>
            <th>{{ $t("Remainder") }}</th>
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
              <input @input="(e: any) => { setPrayDuration(prayer, e.target.value) }" type="number" class="input w-20"
                :value="prayer.duration">
            </td>
            <td>
              <input @input="(e: any) => { setPrayRemainder(prayer, e.target.value) }" type="number" class="input w-20"
                :value="prayer.remainder">
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
