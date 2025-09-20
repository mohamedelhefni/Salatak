<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { location, calcMethod, asrMethod, loading } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, setDays, getPrayersTimings, downloadCalendar, setLoading } = prayersStore

// Onboarding
const { hasCompletedOnboarding, completeOnboarding, isNewUser } = useOnboarding();
const showOnboarding = ref(false);

const methods = computed(() => {
  setLoading(false)
  return prayersStore.calcMethods
})

onMounted(async () => {
  prayersStore.fetchPrayerCalcMethods()
  
  // Show onboarding for new users
  if (isNewUser()) {
    setTimeout(() => {
      showOnboarding.value = true;
    }, 1000); // Small delay to let the page load
  }
})

const handleOnboardingComplete = () => {
  completeOnboarding();
  showOnboarding.value = false;
};

const handleOnboardingSkip = () => {
  completeOnboarding();
  showOnboarding.value = false;
};

const showOnboardingManually = () => {
  showOnboarding.value = true;
};
</script>

<template>
  <Analytics />
  <div class="grid grid-cols-1 md:grid-cols-3 gap-1 w-full h-full px-10 my-10 ">
    <AppCard class="self-start">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="card-title">{{ $t("salatak") }}</h2>
          <p>{{ $t("schedule_prayers") }}</p>
        </div>
        <button 
          @click="showOnboardingManually" 
          class="btn btn-sm btn-ghost btn-circle"
          :title="$t('Help & Tutorial')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c0-1.019.566-1.902 1.4-2.352 0.833-.45 1.866-.45 2.7 0 .833.45 1.399 1.333 1.399 2.352 0 .617-.237 1.175-.658 1.588L12 10.5m0 4.5v-1.5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.75a9.75 9.75 0 1 1 0-19.5 9.75 9.75 0 0 1 0 19.5Z" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <DatePicker />
        <LocationInput />
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
        <button v-if="loading" class="btn btn-sm btn-secondary mt-3">
          <span class="loading loading-spinner"></span>
        </button>
        <button v-else class="btn btn-secondary btn-sm mt-3" @click="getPrayersTimings">
          <IconsEye class="w-6 h-6" />
          {{ $t("Preview Calendar") }}
        </button>
        <button class="btn btn-primary btn-sm  mt-3" @click="downloadCalendar">
          <IconsDownload class="w-5 h-5" />
          {{ $t("Download Calendar") }}
        </button>
      </div>
    </AppCard>
    <CalendarPreview />
  </div>
  <Toast />
  
  <!-- Onboarding Modal -->
  <OnboardingModal 
    v-model="showOnboarding"
    @complete="handleOnboardingComplete"
    @skip="handleOnboardingSkip"
  />
</template>
