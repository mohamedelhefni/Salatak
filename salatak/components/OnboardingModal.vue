<template>
  <div v-if="showOnboarding" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-4xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <div class="text-3xl">🕋</div>
          <div>
            <h3 class="font-bold text-2xl">{{ $t("Welcome to Salatak") }}</h3>
            <p class="text-sm text-gray-500">{{ $t("Your Prayer Times Companion") }}</p>
          </div>
        </div>
        <button 
          @click="skipOnboarding"
          class="btn btn-sm btn-ghost"
        >
          {{ $t("Skip") }}
        </button>
      </div>

      <!-- Progress indicator -->
      <div class="flex justify-center mb-6">
        <div class="flex gap-2">
          <div 
            v-for="(step, index) in onboardingSteps" 
            :key="index"
            :class="[
              'w-3 h-3 rounded-full transition-colors',
              index === currentStep ? 'bg-primary' : 
              index < currentStep ? 'bg-primary/50' : 'bg-gray-300'
            ]"
          ></div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[300px] flex flex-col justify-center">
        <!-- Step 1: Welcome & Quick Overview -->
        <div v-if="currentStep === 0" class="text-center space-y-6">
          <div class="text-6xl mb-4">🕌</div>
          <h4 class="text-2xl font-semibold">{{ $t("Welcome to Salatak") }}</h4>
          <p class="text-gray-600 max-w-2xl mx-auto text-lg">
            {{ $t("Generate prayer time calendars in 3 simple steps") }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="card bg-gradient-to-br from-primary/20 to-primary/10 p-6">
              <div class="text-3xl mb-3">📍</div>
              <h5 class="font-semibold text-lg">{{ $t("1. Set Location") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Click the location button to get your position") }}</p>
            </div>
            <div class="card bg-gradient-to-br from-secondary/20 to-secondary/10 p-6">
              <div class="text-3xl mb-3">⚙️</div>
              <h5 class="font-semibold text-lg">{{ $t("2. Configure") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Choose prayers and calculation method") }}</p>
            </div>
            <div class="card bg-gradient-to-br from-accent/20 to-accent/10 p-6">
              <div class="text-3xl mb-3">📅</div>
              <h5 class="font-semibold text-lg">{{ $t("3. Get Calendar") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Preview and download your calendar") }}</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Quick Setup Guide -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center">
            <div class="text-5xl mb-4">🚀</div>
            <h4 class="text-2xl font-semibold">{{ $t("Quick Setup") }}</h4>
            <p class="text-gray-600">{{ $t("Everything you need to know") }}</p>
          </div>
          
          <div class="space-y-4">
            <!-- Location -->
            <div class="card bg-base-200 p-4">
              <div class="flex items-start gap-4">
                <div class="text-3xl">📍</div>
                <div class="flex-1">
                  <h5 class="font-semibold text-lg mb-2">{{ $t("Set Your Location") }}</h5>
                  <p class="text-sm text-gray-600 mb-3">{{ $t("4 ways to set your location: browser location, address search, map picker, or coordinates") }}</p>
                  <div class="badge badge-primary badge-sm">{{ $t("Tip: Click the pulsing button") }}</div>
                </div>
              </div>
            </div>

            <!-- Configuration -->
            <div class="card bg-base-200 p-4">
              <div class="flex items-start gap-4">
                <div class="text-3xl">⚙️</div>
                <div class="flex-1">
                  <h5 class="font-semibold text-lg mb-2">{{ $t("Configure Prayers") }}</h5>
                  <p class="text-sm text-gray-600 mb-3">{{ $t("Select which prayers to include, set durations, and choose your calculation method") }}</p>
                  <div class="badge badge-secondary badge-sm">{{ $t("Calendar auto-updates when you change settings") }}</div>
                </div>
              </div>
            </div>

            <!-- Calendar -->
            <div class="card bg-base-200 p-4">
              <div class="flex items-start gap-4">
                <div class="text-3xl">📅</div>
                <div class="flex-1">
                  <h5 class="font-semibold text-lg mb-2">{{ $t("Get Your Calendar") }}</h5>
                  <p class="text-sm text-gray-600 mb-3">{{ $t("Download ICS file or copy subscription URL for Google Calendar, Outlook, or Apple Calendar") }}</p>
                  <div class="badge badge-accent badge-sm">{{ $t("Subscription URL auto-syncs") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Ready to Start -->
        <div v-if="currentStep === 2" class="text-center space-y-6">
          <div class="text-6xl mb-4">🎉</div>
          <h4 class="text-2xl font-semibold">{{ $t("You're Ready!") }}</h4>
          <p class="text-gray-600 text-lg">{{ $t("Start by clicking the location button") }}</p>
          
          <div class="card bg-gradient-to-br from-primary/10 to-secondary/10 p-6 max-w-md mx-auto">
            <h5 class="font-semibold mb-3">{{ $t("Quick Tips") }}</h5>
            <div class="text-sm text-gray-600 space-y-2 text-left">
              <p>✓ {{ $t("Calendar auto-previews when location is set") }}</p>
              <p>✓ {{ $t("All settings are saved automatically") }}</p>
              <p>✓ {{ $t("Use subscription URL for auto-updates") }}</p>
              <p>✓ {{ $t("Click help button (?) anytime for guidance") }}</p>
            </div>
          </div>

          <div class="mt-8">
            <button @click="completeOnboarding" class="btn btn-primary btn-lg gap-2">
              <span>{{ $t("Let's Start") }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center mt-8">
        <button 
          @click="previousStep"
          :disabled="currentStep === 0"
          class="btn btn-outline"
          :class="{ 'btn-disabled': currentStep === 0 }"
        >
          {{ $t("Previous") }}
        </button>
        
        <div class="text-sm text-gray-500">
          {{ currentStep + 1 }} / {{ onboardingSteps.length }}
        </div>
        
        <button 
          @click="nextStep"
          v-if="currentStep < onboardingSteps.length - 1"
          class="btn btn-primary"
        >
          {{ $t("Next") }}
        </button>
        <button 
          @click="completeOnboarding"
          v-else
          class="btn btn-primary gap-2"
        >
          <span>{{ $t("Get Started") }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
    <div class="modal-backdrop"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'complete'): void;
  (e: 'skip'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currentStep = ref(0);
const { t } = useI18n();

const showOnboarding = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const onboardingSteps = [
  'welcome',
  'setup',
  'completion'
];

const nextStep = () => {
  if (currentStep.value < onboardingSteps.length - 1) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const completeOnboarding = () => {
  showOnboarding.value = false;
  emit('complete');
};

const skipOnboarding = () => {
  showOnboarding.value = false;
  emit('skip');
};
</script>

<style scoped>
.steps .step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid theme('colors.primary');
  background: theme('colors.base-200');
  border-radius: 0 0.5rem 0.5rem 0;
  position: relative;
}

.steps .step::before {
  content: attr(data-content);
  position: absolute;
  left: -1.5rem;
  top: 1rem;
  width: 2rem;
  height: 2rem;
  background: theme('colors.primary');
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}
</style>