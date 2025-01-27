<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';


const prayersStore = usePrayersStore()
const { location, calcMethod, asrMethod, days, timings, prayers , loading } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, setDays, getPrayersTimings, downloadCalendar, setLoading} = prayersStore


const methods = computed(() => {
  setLoading(false)
  return prayersStore.calcMethods
})


onMounted(async () => {
  prayersStore.fetchPrayerCalcMethods()
})


</script>

<template>
  <div class="flex items-start justify-between gap-1 w-full h-full px-10 my-10 flex-wrap">
    <AppCard>
      <h2 class="card-title">{{ $t("salatak") }}</h2>
      <p>{{ $t("schedule_prayers") }}</p>
      <div class="flex flex-col gap-2">
        <div class="form-control w-full max-w-lg">
          <DatePicker />
          <label class="label">
            <span class="label-text">{{ $t("Address") }}</span>
          </label>
          <div class="input-group rtl:flex-row-reverse ">
            <input type="text" :placeholder="$t('Address')" :value="location.address"
              class=" input input-bordered w-full" />
            <button @click="prayersStore.getLocation()" class="btn btn-primary btn-square">
              <PhosphorIconMapPin :size="28" />
            </button>
          </div>
        </div>

        <div class="form-control w-full max-w-lg">
          <label class="label">
            <span class="label-text">{{ $t("Method of calculation") }}</span>
          </label>
          <select @change="(e: any) => setCalcMethod(Number(e.target.value))" class="select select-bordered w-full ">
            <option disabled selected>{{ $t("Prayer time method calculation") }}</option>
            <option v-for="method in methods" :value="method.id" :selected="method.id == calcMethod">{{
              $t(method.name || " ") }}</option>
          </select>
        </div>

        <div class="form-control w-full max-w-lg">
          <label class="label">
            <span class="label-text">{{ $t("Asr Calculation Method") }}</span>
          </label>
          <select @change="(e: any) => setAsrMethod(Number(e.target.value))" class="select select-bordered w-full ">
            <option :selected="asrMethod == 0" value="0">{{ $t("Shafi") }}</option>
            <option :selected="asrMethod == 1" value="1">{{ $t("Hanafi") }}</option>
          </select>
        </div>

        <PrayersInput />
      </div>

      <div class="card-actions justify-start">
        <button v-if="loading" class="btn btn-secondary mt-3" >
          <span class="loading loading-spinner"></span>
        </button>
        <button v-else class="btn btn-secondary mt-3" @click="getPrayersTimings">
          <PhosphorIconEyeglasses size="28" />
          {{ $t("Preview Calendar") }}
        </button>
        <button class="btn btn-primary mt-3" @click="downloadCalendar">
          <PhosphorIconDownload :size="28" />
          {{ $t("Download Calendar") }}
        </button>
      </div>
    </AppCard>

    <CalendarPreview />

  </div>
</template>
