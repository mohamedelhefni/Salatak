<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { location, calcMethod, asrMethod, loading, startDate, endDate, dateMode, rollingDuration } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, getPrayersTimings, downloadCalendar, setLoading, setStartDate, setEndDate, setDateMode, setRollingDuration } = prayersStore
const { t } = useI18n()
const toast = useToast()

const steps = [
  { key: 'location', label: 'Location', title: 'Where are you?', hint: 'step_location_hint', icon: 'i-lucide-map-pin' },
  { key: 'timing', label: 'Timing', title: 'How should times be calculated?', hint: 'step_timing_hint', icon: 'i-lucide-clock' },
  { key: 'prayers', label: 'Prayers', title: 'Which prayers do you want?', hint: 'step_prayers_hint', icon: 'i-lucide-list-checks' },
  { key: 'calendar', label: 'Calendar', title: 'Your calendar is ready', hint: 'step_calendar_hint', icon: 'i-lucide-calendar-check' },
]
const current = ref(0)
const step = computed(() => steps[current.value])
const hasLocation = computed(() => location.value.lat != undefined && location.value.long != undefined)
const isLast = computed(() => current.value === steps.length - 1)

// Every step after the first needs a location to be meaningful
const stepperItems = computed<StepperItem[]>(() => steps.map((s, i) => ({
  title: t(s.label),
  icon: s.icon,
  value: i,
  disabled: i > 0 && !hasLocation.value,
})))

const goTo = (i: number) => {
  if (i < 0 || i >= steps.length) return
  if (i > 0 && !hasLocation.value) {
    toast.add({ title: t('Set your location to continue'), color: 'error', icon: 'i-lucide-map-pin-off' })
    return
  }
  current.value = i
}

watch(current, (i) => {
  usePostHog().trackStep(steps[i].key, i + 1)
  if (steps[i].key === 'calendar') getPrayersTimings()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const calcMethodItems = computed(() => prayersStore.calcMethods.map((m: any) => ({ label: t(m.name || ' '), value: m.id })))
const calcMethodModel = computed({ get: () => calcMethod.value, set: (v) => setCalcMethod(Number(v)) })
const asrItems = computed(() => [{ label: t('Shafi'), value: 0 }, { label: t('Hanafi'), value: 1 }])
const asrModel = computed({ get: () => Number(asrMethod.value), set: (v) => setAsrMethod(Number(v)) })
const dateModeItems = computed(() => [{ label: t('Rolling Duration'), value: 'rolling' }, { label: t('Fixed Dates'), value: 'fixed' }])
const dateModeModel = computed({ get: () => dateMode.value, set: (v) => setDateMode(v) })
const durationItems = computed(() => [3, 6, 12, 18, 24, 36].map(m => ({
  label: m === 18 ? `${t(`${m} months`)} (${t('Recommended')})` : t(`${m} months`),
  value: m,
})))
const durationModel = computed({ get: () => rollingDuration.value, set: (v) => setRollingDuration(Number(v)) })

const startDateInput = computed(() => new Date(startDate.value).toISOString().slice(0, 7));
const endDateInput = computed(() => new Date(endDate.value).toISOString().slice(0, 7));

const updateStartDate = (event: any) => {
  setStartDate(new Date(event.target.value + "-01"));
};

const updateEndDate = (event: any) => {
  const date = new Date(event.target.value + "-01");
  if (date < new Date(startDate.value)) {
    toast.add({ title: t('End date should be greater than or equal to the start date'), color: 'error' })
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
  <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
    <header class="mb-6 text-center sm:mb-8">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ $t("salatak") }}</h1>
      <p class="mt-1 text-sm text-muted sm:text-base">{{ $t("schedule_prayers") }}</p>
    </header>

    <UStepper
      :model-value="current"
      :items="stepperItems"
      :linear="false"
      size="sm"
      class="mb-6 w-full"
      :ui="{ title: 'text-xs sm:text-sm', content: 'hidden' }"
      @update:model-value="(v) => goTo(Number(v))"
    />

    <UCard :ui="{ body: 'p-4 sm:p-6', footer: 'p-4 sm:px-6' }">
      <div class="mb-5">
        <h2 class="text-lg font-semibold sm:text-xl">{{ $t(step.title) }}</h2>
        <p class="mt-1 text-sm text-muted">{{ $t(step.hint) }}</p>
      </div>

      <!-- Step 1: Location -->
      <LocationInput v-if="step.key === 'location'" />

      <!-- Step 2: Calculation method and date range -->
      <div v-else-if="step.key === 'timing'" class="space-y-5">
        <UFormField :label="$t('Method of calculation')">
          <USelect v-model="calcMethodModel" :items="calcMethodItems" :placeholder="$t('Select method')" class="w-full" />
        </UFormField>

        <UFormField :label="$t('Asr Calculation Method')">
          <URadioGroup v-model="asrModel" :items="asrItems" orientation="horizontal" variant="table" indicator="hidden" />
        </UFormField>

        <UFormField :label="$t('Date Range Mode')">
          <URadioGroup v-model="dateModeModel" :items="dateModeItems" orientation="horizontal" variant="table" indicator="hidden" />
        </UFormField>

        <UFormField v-if="dateMode === 'rolling'" :help="$t('Automatically includes prayers from today')">
          <USelect v-model="durationModel" :items="durationItems" class="w-full" />
        </UFormField>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormField :label="$t('start_date')">
            <UInput type="month" :model-value="startDateInput" class="w-full" @change="updateStartDate" />
          </UFormField>
          <UFormField :label="$t('end_date')">
            <UInput type="month" :model-value="endDateInput" class="w-full" @change="updateEndDate" />
          </UFormField>
        </div>
      </div>

      <!-- Step 3: Prayers -->
      <PrayersInput v-else-if="step.key === 'prayers'" />

      <!-- Step 4: Get the calendar -->
      <div v-else class="space-y-4">
        <UButton
          block
          size="lg"
          icon="i-lucide-download"
          :loading="loading"
          :label="$t('Download Calendar')"
          @click="downloadCalendar"
        />
        <CalendarPreview />
      </div>

      <template #footer>
        <div class="flex items-center justify-between gap-2">
          <UButton
            v-if="current > 0"
            color="neutral"
            variant="ghost"
            icon="i-lucide-arrow-left"
            :ui="{ leadingIcon: 'rtl:rotate-180' }"
            :label="$t('Previous')"
            @click="goTo(current - 1)"
          />
          <span v-else />
          <UButton
            v-if="!isLast"
            trailing-icon="i-lucide-arrow-right"
            :ui="{ trailingIcon: 'rtl:rotate-180' }"
            :disabled="step.key === 'location' && !hasLocation"
            :label="$t('Next')"
            @click="goTo(current + 1)"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
