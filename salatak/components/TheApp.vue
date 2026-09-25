<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { location, calcMethod, asrMethod, loading, startDate, endDate, dateMode, rollingDuration } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, getPrayersTimings, downloadCalendar, setLoading, setStartDate, setEndDate, setDateMode, setRollingDuration } = prayersStore
const { t } = useI18n()
const { $toast } = useNuxtApp()

const steps = [
  { key: 'location', label: 'Location', title: 'Where are you?', hint: 'step_location_hint' },
  { key: 'timing', label: 'Timing', title: 'How should times be calculated?', hint: 'step_timing_hint' },
  { key: 'prayers', label: 'Prayers', title: 'Which prayers do you want?', hint: 'step_prayers_hint' },
  { key: 'calendar', label: 'Calendar', title: 'Your calendar is ready', hint: 'step_calendar_hint' },
]
const current = ref(0)
const step = computed(() => steps[current.value])
const hasLocation = computed(() => location.value.lat != undefined && location.value.long != undefined)
const isLast = computed(() => current.value === steps.length - 1)

const goTo = (i: number) => {
  if (i < 0 || i >= steps.length) return
  // Every step after the first needs a location to be meaningful
  if (i > 0 && !hasLocation.value) {
    $toast.show(t('Set your location to continue'), 'error')
    return
  }
  current.value = i
}

watch(current, (i) => {
  usePostHog().trackStep(steps[i].key, i + 1)
  if (steps[i].key === 'calendar') getPrayersTimings()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const startDateInput = computed(() => new Date(startDate.value).toISOString().slice(0, 7));
const endDateInput = computed(() => new Date(endDate.value).toISOString().slice(0, 7));

const updateStartDate = (event: any) => {
  setStartDate(new Date(event.target.value + "-01"));
};

const updateEndDate = (event: any) => {
  const date = new Date(event.target.value + "-01");
  if (date < new Date(startDate.value)) {
    alert("End date should be greater than or equal to the start date");
    setEndDate(new Date());
    return;
  }
  setEndDate(date);
};

onMounted(() => {
  setLoading(false) // loading is persisted; clear a stale spinner from a previous visit
  prayersStore.fetchPrayerCalcMethods()
  usePostHog().trackStep(steps[0].key, 1)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-3xl">
    <!-- Header -->
    <div class="text-center mb-4 md:mb-6">
      <h1 class="text-2xl md:text-3xl font-bold">{{ $t("salatak") }}</h1>
      <p class="text-sm md:text-base text-base-content/70">{{ $t("schedule_prayers") }}</p>
    </div>

    <!-- Step indicator -->
    <ul class="steps w-full mb-6">
      <li v-for="(s, i) in steps" :key="s.key" :class="['step text-xs md:text-sm', { 'step-primary': i <= current }]">
        <button type="button" class="disabled:cursor-default" :disabled="i === current" @click="goTo(i)">
          {{ $t(s.label) }}
        </button>
      </li>
    </ul>

    <div class="card bg-base-200 shadow-xl">
      <div class="card-body p-4 md:p-6">
        <h2 class="card-title text-lg md:text-xl">{{ $t(step.title) }}</h2>
        <p class="text-sm text-base-content/70 mb-2">{{ $t(step.hint) }}</p>

        <!-- Step 1: Location -->
        <div v-if="step.key === 'location'">
          <LocationInput />
        </div>

        <!-- Step 2: Calculation method and date range -->
        <div v-else-if="step.key === 'timing'" class="space-y-3">
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text">{{ $t("Method of calculation") }}</span>
            </label>
            <select @change="(e: any) => setCalcMethod(Number(e.target.value))" class="select select-bordered w-full">
              <option disabled :selected="!calcMethod">{{ $t("Select method") }}</option>
              <option v-for="method in prayersStore.calcMethods" :key="method.id" :value="method.id" :selected="method.id == calcMethod">{{ $t(method.name || " ") }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text">{{ $t("Asr Calculation Method") }}</span>
            </label>
            <select @change="(e: any) => setAsrMethod(Number(e.target.value))" class="select select-bordered w-full">
              <option :selected="asrMethod == 0" value="0">{{ $t("Shafi") }}</option>
              <option :selected="asrMethod == 1" value="1">{{ $t("Hanafi") }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label py-1">
              <span class="label-text">{{ $t("Date Range Mode") }}</span>
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateMode" class="radio radio-sm radio-primary" :checked="dateMode === 'rolling'" @change="setDateMode('rolling')" />
                <span class="label-text">{{ $t("Rolling Duration") }}</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dateMode" class="radio radio-sm radio-primary" :checked="dateMode === 'fixed'" @change="setDateMode('fixed')" />
                <span class="label-text">{{ $t("Fixed Dates") }}</span>
              </label>
            </div>
          </div>

          <div v-if="dateMode === 'rolling'" class="form-control">
            <select @change="(e: any) => setRollingDuration(Number(e.target.value))" class="select select-bordered w-full">
              <option v-for="m in [3, 6, 12, 18, 24, 36]" :key="m" :selected="rollingDuration === m" :value="m">
                {{ $t(`${m} months`) }}<template v-if="m === 18"> ({{ $t("Recommended") }})</template>
              </option>
            </select>
            <label class="label py-0">
              <span class="label-text-alt opacity-70">{{ $t("Automatically includes prayers from today") }}</span>
            </label>
          </div>

          <div v-else class="grid grid-cols-2 gap-2">
            <div class="form-control">
              <label class="label py-1"><span class="label-text">{{ $t("start_date") }}</span></label>
              <input type="month" class="input input-bordered" :value="startDateInput" @change="updateStartDate" />
            </div>
            <div class="form-control">
              <label class="label py-1"><span class="label-text">{{ $t("end_date") }}</span></label>
              <input type="month" class="input input-bordered" :value="endDateInput" @change="updateEndDate" />
            </div>
          </div>
        </div>

        <!-- Step 3: Prayers -->
        <div v-else-if="step.key === 'prayers'">
          <PrayersInput />
        </div>

        <!-- Step 4: Get the calendar -->
        <div v-else class="space-y-3">
          <button class="btn btn-primary w-full" :disabled="loading" @click="downloadCalendar">
            <span v-if="loading" class="loading loading-spinner"></span>
            <IconsDownload v-else class="w-5 h-5" />
            {{ $t("Download Calendar") }}
          </button>
          <CalendarPreview />
          <FeedbackCard />
        </div>

        <!-- Navigation -->
        <div class="card-actions justify-between mt-4">
          <button v-if="current > 0" class="btn btn-ghost" @click="goTo(current - 1)">{{ $t("Previous") }}</button>
          <span v-else></span>
          <button v-if="!isLast" class="btn btn-primary" :disabled="step.key === 'location' && !hasLocation" @click="goTo(current + 1)">
            {{ $t("Next") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <Toast />
</template>

<style scoped>
/* Prevent zoom on input focus (iOS) */
@media (max-width: 639px) {
  input[type="text"],
  input[type="number"],
  input[type="month"],
  select {
    font-size: 16px !important;
  }
}
</style>
