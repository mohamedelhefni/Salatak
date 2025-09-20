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
      <div class="min-h-[400px] flex flex-col justify-center">
        <!-- Step 1: Welcome & Overview -->
        <div v-if="currentStep === 0" class="text-center space-y-6">
          <div class="text-6xl mb-4">🕌</div>
          <h4 class="text-xl font-semibold">{{ $t("Generate Prayer Time Calendars") }}</h4>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ $t("Salatak helps you create and sync prayer times to any calendar application. Generate ICS files or use direct calendar links for seamless integration.") }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="card bg-base-200 p-4">
              <div class="text-2xl mb-2">📍</div>
              <h5 class="font-medium">{{ $t("Set Location") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Choose your location using multiple methods") }}</p>
            </div>
            <div class="card bg-base-200 p-4">
              <div class="text-2xl mb-2">⚙️</div>
              <h5 class="font-medium">{{ $t("Configure Prayers") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Customize prayer times and durations") }}</p>
            </div>
            <div class="card bg-base-200 p-4">
              <div class="text-2xl mb-2">📅</div>
              <h5 class="font-medium">{{ $t("Generate Calendar") }}</h5>
              <p class="text-sm text-gray-600">{{ $t("Create calendar files or subscription links") }}</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Location Setup -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center">
            <div class="text-5xl mb-4">🌍</div>
            <h4 class="text-xl font-semibold">{{ $t("Set Your Location") }}</h4>
            <p class="text-gray-600">{{ $t("Accurate prayer times require your precise location") }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("4 Ways to Set Location:") }}</h5>
              <div class="space-y-3">
                <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <IconsMapPin class="w-5 h-5 text-primary" />
                  <div>
                    <div class="font-medium">{{ $t("Current Location") }}</div>
                    <div class="text-sm text-gray-600">{{ $t("Use browser geolocation") }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <IconsSearch class="w-5 h-5 text-primary" />
                  <div>
                    <div class="font-medium">{{ $t("Search Address") }}</div>
                    <div class="text-sm text-gray-600">{{ $t("Type your city or address") }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <IconsMapPin class="w-5 h-5 text-primary" />
                  <div>
                    <div class="font-medium">{{ $t("Pick on Map") }}</div>
                    <div class="text-sm text-gray-600">{{ $t("Click on interactive map") }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <IconsCoordinates class="w-5 h-5 text-primary" />
                  <div>
                    <div class="font-medium">{{ $t("Enter Coordinates") }}</div>
                    <div class="text-sm text-gray-600">{{ $t("Input latitude/longitude directly") }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("Why Location Matters:") }}</h5>
              <div class="space-y-3 text-sm text-gray-600">
                <p>• {{ $t("Prayer times vary by geographic location") }}</p>
                <p>• {{ $t("More precise location = more accurate times") }}</p>
                <p>• {{ $t("Different calculation methods for different regions") }}</p>
                <p>• {{ $t("Supports worldwide locations") }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Prayer Configuration -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center">
            <div class="text-5xl mb-4">⚙️</div>
            <h4 class="text-xl font-semibold">{{ $t("Configure Your Prayers") }}</h4>
            <p class="text-gray-600">{{ $t("Customize which prayers to include and their durations") }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("Prayer Settings:") }}</h5>
              <div class="space-y-3">
                <div class="p-4 bg-base-200 rounded-lg">
                  <h6 class="font-medium mb-2">{{ $t("Select Prayers") }}</h6>
                  <p class="text-sm text-gray-600">{{ $t("Choose which of the 5 daily prayers to include in your calendar") }}</p>
                </div>
                <div class="p-4 bg-base-200 rounded-lg">
                  <h6 class="font-medium mb-2">{{ $t("Set Durations") }}</h6>
                  <p class="text-sm text-gray-600">{{ $t("Define how long each prayer event should last (1-180 minutes)") }}</p>
                </div>
                <div class="p-4 bg-base-200 rounded-lg">
                  <h6 class="font-medium mb-2">{{ $t("Calculation Method") }}</h6>
                  <p class="text-sm text-gray-600">{{ $t("Choose the Islamic calculation method for your region") }}</p>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("Special Features:") }}</h5>
              <div class="space-y-3 text-sm text-gray-600">
                <p>• {{ $t("Automatic Jummah (Friday) prayer scheduling") }}</p>
                <p>• {{ $t("Different calculation methods (Egyptian, ISNA, etc.)") }}</p>
                <p>• {{ $t("Hanafi and Shafi Asr calculation options") }}</p>
                <p>• {{ $t("Customizable date ranges") }}</p>
                <p>• {{ $t("Multiple language support") }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Calendar Generation -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center">
            <div class="text-5xl mb-4">📅</div>
            <h4 class="text-xl font-semibold">{{ $t("Generate Your Calendar") }}</h4>
            <p class="text-gray-600">{{ $t("Create calendar files or subscription links") }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
              <div class="flex items-center gap-3 mb-4">
                <IconsDownload class="w-6 h-6 text-primary" />
                <h5 class="font-semibold">{{ $t("Download ICS File") }}</h5>
              </div>
              <p class="text-sm text-gray-600 mb-4">
                {{ $t("Download a calendar file that you can import into any calendar application") }}
              </p>
              <div class="text-xs text-gray-500">
                <p>• {{ $t("Works with Google Calendar, Outlook, Apple Calendar") }}</p>
                <p>• {{ $t("One-time import") }}</p>
                <p>• {{ $t("Events are copied to your calendar") }}</p>
              </div>
            </div>

            <div class="card bg-gradient-to-br from-secondary/10 to-primary/10 p-6">
              <div class="flex items-center gap-3 mb-4">
                <IconsClipboard class="w-6 h-6 text-secondary" />
                <h5 class="font-semibold">{{ $t("Copy Subscription URL") }}</h5>
              </div>
              <p class="text-sm text-gray-600 mb-4">
                {{ $t("Get a live subscription link that automatically updates") }}
              </p>
              <div class="text-xs text-gray-500">
                <p>• {{ $t("Always up-to-date") }}</p>
                <p>• {{ $t("Automatically syncs changes") }}</p>
                <p>• {{ $t("Perfect for long-term use") }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Google Calendar Import -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="text-center">
            <div class="text-5xl mb-4">📲</div>
            <h4 class="text-xl font-semibold">{{ $t("Import to Google Calendar") }}</h4>
            <p class="text-gray-600">{{ $t("Step-by-step guide to add prayers to your Google Calendar") }}</p>
          </div>
          
          <div class="space-y-6">
            <div class="alert alert-info">
              <IconsClipboard class="w-6 h-6" />
              <div>
                <h6 class="font-medium">{{ $t("Pro Tip") }}</h6>
                <p class="text-sm">{{ $t("Use the subscription URL for automatic updates, or download ICS for one-time import") }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("Method 1: Subscription URL (Recommended)") }}</h5>
              <div class="steps">
                <div class="step" data-content="1">
                  <div class="font-medium">{{ $t("Generate your prayer calendar") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Set your location, configure prayers, and click 'Preview Calendar'") }}</p>
                </div>
                <div class="step" data-content="2">
                  <div class="font-medium">{{ $t("Copy the subscription URL") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Click the copy button to get your personal calendar URL") }}</p>
                </div>
                <div class="step" data-content="3">
                  <div class="font-medium">{{ $t("Open Google Calendar") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Go to calendar.google.com in your browser") }}</p>
                </div>
                <div class="step" data-content="4">
                  <div class="font-medium">{{ $t("Add calendar by URL") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Click '+' → 'From URL' → Paste your subscription URL") }}</p>
                </div>
                <div class="step" data-content="5">
                  <div class="font-medium">{{ $t("Enjoy automatic updates") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Your prayer times will automatically update in Google Calendar") }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h5 class="font-medium text-lg">{{ $t("Method 2: ICS File Import") }}</h5>
              <div class="steps">
                <div class="step" data-content="1">
                  <div class="font-medium">{{ $t("Download ICS file") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Click 'Download Calendar' to get the .ics file") }}</p>
                </div>
                <div class="step" data-content="2">
                  <div class="font-medium">{{ $t("Import to Google Calendar") }}</div>
                  <p class="text-sm text-gray-600">{{ $t("Settings → Import & Export → Import → Select your .ics file") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Final Tips -->
        <div v-if="currentStep === 5" class="text-center space-y-6">
          <div class="text-5xl mb-4">🎉</div>
          <h4 class="text-xl font-semibold">{{ $t("You're All Set!") }}</h4>
          <p class="text-gray-600">{{ $t("You're ready to start using Salatak for your prayer schedule") }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="card bg-base-200 p-6">
              <h5 class="font-medium mb-3">{{ $t("Quick Tips") }}</h5>
              <div class="text-sm text-gray-600 space-y-2 text-left">
                <p>• {{ $t("Bookmark the subscription URL for easy access") }}</p>
                <p>• {{ $t("Update your location if you move") }}</p>
                <p>• {{ $t("Regenerate calendar after changing settings") }}</p>
                <p>• {{ $t("Share calendar URLs with family members") }}</p>
              </div>
            </div>
            <div class="card bg-base-200 p-6">
              <h5 class="font-medium mb-3">{{ $t("Need Help?") }}</h5>
              <div class="text-sm text-gray-600 space-y-2 text-left">
                <p>• {{ $t("Use the help button for quick guidance") }}</p>
                <p>• {{ $t("All settings are automatically saved") }}</p>
                <p>• {{ $t("Calendar updates reflect your latest changes") }}</p>
                <p>• {{ $t("Works on all devices and platforms") }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <button @click="completeOnboarding" class="btn btn-primary btn-lg">
              {{ $t("Start Using Salatak") }}
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
          class="btn btn-primary"
        >
          {{ $t("Get Started") }}
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
  'location',
  'configuration', 
  'generation',
  'import',
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