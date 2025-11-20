<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { location, calcMethod, asrMethod, loading, startDate, endDate } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, setDays, getPrayersTimings, downloadCalendar, setLoading, setStartDate, setEndDate } = prayersStore

// Onboarding
const { hasCompletedOnboarding, completeOnboarding, isNewUser } = useOnboarding();
const showOnboarding = ref(false);

const methods = computed(() => {
  setLoading(false)
  return prayersStore.calcMethods
})

// Date picker functions (moved from DatePicker component for inline display)
const startDateInput = computed(() => new Date(startDate.value).toISOString().slice(0, 7));
const endDateInput = computed(() => new Date(endDate.value).toISOString().slice(0, 7));

const updateStartDate = (event: any) => {
    const date = new Date(event.target.value + "-01");
    setStartDate(date);
};

const updateEndDate = (event: any) => {
    const date = new Date(event.target.value + "-01");
    let sd = new Date(startDate.value)
    if (date < sd) {
        alert("End date should be greater than or equal to the start date");
        setEndDate(new Date());
        return;
    }
    setEndDate(date);
};

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

// Tab management
const activeTab = ref('configuration');
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">{{ $t("salatak") }}</h1>
        <p class="text-base-content/70">{{ $t("schedule_prayers") }}</p>
      </div>
      <button 
        @click="showOnboardingManually" 
        class="btn btn-ghost btn-circle"
        :title="$t('Help & Tutorial')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c0-1.019.566-1.902 1.4-2.352 0.833-.45 1.866-.45 2.7 0 .833.45 1.399 1.333 1.399 2.352 0 .617-.237 1.175-.658 1.588L12 10.5m0 4.5v-1.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.75a9.75 9.75 0 1 1 0-19.5 9.75 9.75 0 0 1 0 19.5Z" />
        </svg>
      </button>
    </div>

    <!-- Main Layout: Two Column on Desktop -->
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
      <!-- Left Column: Configuration (30%) -->
      <div class="lg:col-span-3 space-y-4">
        <!-- Settings Card with Tabs -->
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body p-4">
            <!-- Tab Navigation -->
            <div role="tablist" class="tabs tabs-boxed mb-4">
              <button 
                @click="activeTab = 'configuration'"
                role="tab" 
                :class="['tab', { 'tab-active': activeTab === 'configuration' }]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ $t("Configuration") }}
              </button>
              <button 
                @click="activeTab = 'prayers'"
                role="tab" 
                :class="['tab', { 'tab-active': activeTab === 'prayers' }]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ $t("Prayers") }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content-wrapper">
              <!-- Configuration Tab -->
              <div v-show="activeTab === 'configuration'" class="tab-content-panel">
                <!-- Compact Date Picker -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="form-control">
                    <label class="label py-1">
                      <span class="label-text text-xs">{{ $t("start_date") }}</span>
                    </label>
                    <input type="month" class="input input-sm input-bordered" :value="startDateInput" @change="updateStartDate" />
                  </div>
                  <div class="form-control">
                    <label class="label py-1">
                      <span class="label-text text-xs">{{ $t("end_date") }}</span>
                    </label>
                    <input type="month" class="input input-sm input-bordered" :value="endDateInput" @change="updateEndDate" />
                  </div>
                </div>

                <!-- Location -->
                <div class="mb-3">
                  <LocationInput />
                </div>

                <!-- Calculation Methods -->
                <div class="space-y-2">
                  <div class="form-control">
                    <label class="label py-1">
                      <span class="label-text text-xs">{{ $t("Method of calculation") }}</span>
                    </label>
                    <select @change="(e: any) => setCalcMethod(Number(e.target.value))" class="select select-sm select-bordered w-full">
                      <option disabled selected>{{ $t("Select method") }}</option>
                      <option v-for="method in methods" :value="method.id" :selected="method.id == calcMethod">{{ $t(method.name || " ") }}</option>
                    </select>
                  </div>

                  <div class="form-control">
                    <label class="label py-1">
                      <span class="label-text text-xs">{{ $t("Asr Calculation Method") }}</span>
                    </label>
                    <select @change="(e: any) => setAsrMethod(Number(e.target.value))" class="select select-sm select-bordered w-full">
                      <option :selected="asrMethod == 0" value="0">{{ $t("Shafi") }}</option>
                      <option :selected="asrMethod == 1" value="1">{{ $t("Hanafi") }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Prayers Tab -->
              <div v-show="activeTab === 'prayers'" class="tab-content-panel">
                <PrayersInput />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2">
          <button v-if="loading" class="btn btn-secondary flex-1">
            <span class="loading loading-spinner"></span>
            {{ $t("Loading") }}...
          </button>
          <button v-else class="btn btn-secondary  flex items-center gap-2" @click="getPrayersTimings">
            <IconsEye class="w-5 h-5" />
            {{ $t("Preview Calendar") }}
          </button>
          <button class="btn btn-primary   flex items-center gap-2" @click="downloadCalendar">
            <IconsDownload class="w-5 h-5" />
            {{ $t("Download Calendar") }}
          </button>
        </div>
      </div>

      <!-- Right Column: Calendar Preview (70%) -->
      <div class="lg:col-span-7">
        <CalendarPreview />
      </div>
    </div>
  </div>
  
  <Toast />
  
  <!-- Onboarding Modal -->
  <OnboardingModal 
    v-model="showOnboarding"
    @complete="handleOnboardingComplete"
    @skip="handleOnboardingSkip"
  />
</template>

<style scoped>
/* Ensure compact layout on all screen sizes */
.container {
  max-height: calc(100vh - 4rem);
}

/* Smooth transitions */
.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

/* Compact form inputs */
.input-sm, .select-sm {
  font-size: 0.875rem;
}

/* Better mobile responsiveness */
@media (max-width: 768px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}

/* Ensure calendar is responsive */
:deep(.fc) {
  font-size: 0.875rem;
}

:deep(.fc-toolbar-title) {
  font-size: 1.125rem !important;
}

/* Tab styling improvements */
.tabs-boxed .tab {
  font-weight: 500;
  transition: all 0.2s ease;
}

.tabs-boxed .tab-active {
  font-weight: 600;
}

.tab-content-wrapper {
  max-height: 60vh;
  overflow-y: auto;
}

.tab-content-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth scrolling for tab content */
.tab-content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.tab-content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.tab-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.tab-content-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
