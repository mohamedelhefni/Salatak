<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';

const prayersStore = usePrayersStore();
const { location } = storeToRefs(prayersStore);
const { t } = useI18n();
const toast = useToast();

const locationMethods = computed(() => [
  { value: 'geolocation', label: t('Use Current Location'), icon: 'i-lucide-locate-fixed' },
  { value: 'address', label: t('Search Address'), icon: 'i-lucide-search' },
  { value: 'map', label: t('Pick on Map'), icon: 'i-lucide-map' },
  { value: 'coordinates', label: t('Enter Coordinates'), icon: 'i-lucide-crosshair' },
]);

const activeMethod = ref('geolocation');
const loadingLocation = ref(false);
const showMapModal = ref(false);

const hasLocation = computed(() => location.value.lat != undefined && location.value.long != undefined);
const locationLabel = computed(() => location.value.address || `${location.value.lat?.toFixed(4)}, ${location.value.long?.toFixed(4)}`);

const showError = (title: string) => toast.add({ title, color: 'error', icon: 'i-lucide-circle-alert' });

// Address search
const addressQuery = ref('');
const addressSuggestions = ref<any[]>([]);
const searching = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Manual coordinates
const manualCoords = ref({
  lat: undefined as number | undefined,
  lon: undefined as number | undefined
});

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    showError(t("Geolocation is not supported by this browser."));
    return;
  }

  loadingLocation.value = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      prayersStore.setLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
        address: ''
      });

      try {
        await prayersStore.reverseGeocoding();
      } catch (error) {
        console.warn('Reverse geocoding failed:', error);
      }

      loadingLocation.value = false;
    },
    (error) => {
      console.error('Geolocation error:', error);
      let message = t("Unable to get your location.");

      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = t("Location access denied. Please allow location access or use another method.");
          break;
        case error.POSITION_UNAVAILABLE:
          message = t("Location information unavailable.");
          break;
        case error.TIMEOUT:
          message = t("Location request timed out.");
          break;
      }

      showError(message);
      loadingLocation.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
};

// Search addresses using Nominatim
watch(addressQuery, (query) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  if (!query || query.length < 3) {
    addressSuggestions.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    searching.value = true;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      addressSuggestions.value = await response.json();
    } catch (error) {
      console.error('Address search error:', error);
      addressSuggestions.value = [];
    } finally {
      searching.value = false;
    }
  }, 300);
});

const selectAddress = (suggestion: any) => {
  prayersStore.setLocation({
    lat: parseFloat(suggestion.lat),
    long: parseFloat(suggestion.lon),
    address: suggestion.display_name
  });
  addressSuggestions.value = [];
};

const validateAndSetCoordinates = () => {
  const { lat, lon } = manualCoords.value;
  if (lat == undefined || lon == undefined || isNaN(lat) || isNaN(lon)) {
    showError(t("Please enter valid numbers for coordinates"));
    return;
  }
  if (lat < -90 || lat > 90) {
    showError(t("Latitude must be between -90 and 90"));
    return;
  }
  if (lon < -180 || lon > 180) {
    showError(t("Longitude must be between -180 and 180"));
    return;
  }

  prayersStore.setLocation({
    lat,
    long: lon,
    address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  });
};

const onLocationSelectedFromMap = (picked: { lat: number, lng: number }) => {
  prayersStore.setLocation({
    lat: picked.lat,
    long: picked.lng,
    address: `${picked.lat.toFixed(4)}, ${picked.lng.toFixed(4)}`
  });
  showMapModal.value = false;
};

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout);
});
</script>

<template>
  <div class="space-y-4">
    <UTabs
      v-model="activeMethod"
      :items="locationMethods"
      :content="false"
      size="sm"
      class="w-full"
      :ui="{ label: 'hidden sm:inline' }"
    />

    <!-- Current location -->
    <div v-if="activeMethod === 'geolocation'">
      <UButton
        block
        size="xl"
        icon="i-lucide-locate-fixed"
        :loading="loadingLocation"
        :variant="hasLocation ? 'soft' : 'solid'"
        :label="$t(hasLocation ? 'Update my location' : 'Use my current location')"
        @click="getCurrentLocation"
      />
    </div>

    <!-- Address search -->
    <div v-else-if="activeMethod === 'address'" class="space-y-2">
      <UInput
        v-model="addressQuery"
        icon="i-lucide-search"
        size="lg"
        :loading="searching"
        :placeholder="$t('Enter your address or city name')"
        class="w-full"
      />
      <ul v-if="addressSuggestions.length" class="divide-y divide-default overflow-hidden rounded-md border border-default">
        <li v-for="(suggestion, index) in addressSuggestions" :key="index">
          <button
            type="button"
            class="w-full px-3 py-2.5 text-start hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
            @click="selectAddress(suggestion)"
          >
            <span class="block truncate text-sm font-medium">{{ suggestion.display_name }}</span>
            <span class="block text-xs text-muted" dir="ltr">{{ suggestion.lat }}, {{ suggestion.lon }}</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Map picker -->
    <div v-else-if="activeMethod === 'map'">
      <UModal
        v-model:open="showMapModal"
        :title="$t('Select Your Location')"
        :description="$t('Click on the map to select your location')"
        :ui="{ content: 'sm:max-w-3xl' }"
      >
        <UButton block size="xl" icon="i-lucide-map" :label="$t('Open Map')" />
        <template #body>
          <MapPicker
            :latitude="location.lat || 51.505"
            :longitude="location.long || -0.09"
            @location-selected="onLocationSelectedFromMap"
          />
        </template>
      </UModal>
    </div>

    <!-- Coordinates -->
    <form v-else class="space-y-3" @submit.prevent="validateAndSetCoordinates">
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="$t('Latitude')">
          <UInput v-model.number="manualCoords.lat" type="number" step="any" placeholder="21.4225" dir="ltr" class="w-full" />
        </UFormField>
        <UFormField :label="$t('Longitude')">
          <UInput v-model.number="manualCoords.lon" type="number" step="any" placeholder="39.8262" dir="ltr" class="w-full" />
        </UFormField>
      </div>
      <UButton
        type="submit"
        block
        color="neutral"
        variant="subtle"
        :disabled="manualCoords.lat == undefined || manualCoords.lon == undefined"
        :label="$t('Set Location')"
      />
    </form>

    <UAlert
      v-if="hasLocation"
      color="success"
      variant="subtle"
      icon="i-lucide-circle-check"
      :title="$t('Location set')"
      :description="locationLabel"
      :ui="{ description: 'truncate' }"
    />
  </div>
</template>
