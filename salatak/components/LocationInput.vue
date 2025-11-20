<template>
  <div class="form-control w-full">
    <label class="label py-1">
      <span class="label-text text-xs">{{ $t("Location") }}</span>
    </label>
    
    <!-- Location method tabs - compact -->
    <div class="tabs tabs-boxed mb-2 text-xs">
      <button 
        v-for="method in locationMethods" 
        :key="method.key"
        @click="activeMethod = method.key"
        :class="['tab tab-sm', { 'tab-active': activeMethod === method.key }]"
      >
        <IconsMapPin v-if="method.key === 'geolocation'" class="w-3 h-3 mr-1" />
        <IconsSearch v-else-if="method.key === 'address'" class="w-3 h-3 mr-1" />
        <IconsMapPin v-else-if="method.key === 'map'" class="w-3 h-3 mr-1" />
        <IconsCoordinates v-else-if="method.key === 'coordinates'" class="w-3 h-3 mr-1" />
        <span class="hidden sm:inline">{{ $t(method.label) }}</span>
      </button>
    </div>

    <!-- Geolocation method -->
    <div v-if="activeMethod === 'geolocation'" class="space-y-2">
      <div class="join w-full">
        <input 
          type="text" 
          :placeholder="$t('Address')" 
          :value="location.address"
          class="input input-sm input-bordered join-item flex-1"
          readonly
        />
        <button 
          @click="getCurrentLocation()" 
          class="btn btn-sm btn-primary join-item"
          :disabled="loadingLocation"
        >
          <span v-if="loadingLocation" class="loading loading-spinner loading-xs"></span>
          <IconsMapPin v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Address search method -->
    <div v-if="activeMethod === 'address'" class="space-y-2">
      <div class="relative">
        <input 
          v-model="addressQuery"
          @input="searchAddresses"
          @focus="showSuggestions = true"
          type="text" 
          :placeholder="$t('Enter your address or city name')"
          class="input input-sm input-bordered w-full"
        />
        
        <!-- Address suggestions -->
        <div 
          v-if="showSuggestions && addressSuggestions.length > 0"
          class="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          <button
            v-for="(suggestion, index) in addressSuggestions"
            :key="index"
            @click="selectAddress(suggestion)"
            class="w-full text-left px-3 py-2 hover:bg-base-200 border-b border-base-300 last:border-b-0 text-sm"
          >
            <div class="font-medium truncate">{{ suggestion.display_name }}</div>
            <div class="text-xs text-gray-500">
              {{ suggestion.lat }}, {{ suggestion.lon }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Coordinates method -->
    <div v-if="activeMethod === 'coordinates'" class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <div class="form-control">
          <input 
            v-model.number="manualCoords.lat"
            @blur="validateAndSetCoordinates"
            type="number"
            step="any"
            :placeholder="$t('Latitude')"
            class="input input-xs input-bordered"
          />
        </div>
        <div class="form-control">
          <input 
            v-model.number="manualCoords.lon"
            @blur="validateAndSetCoordinates"
            type="number"
            step="any"
            :placeholder="$t('Longitude')"
            class="input input-xs input-bordered"
          />
        </div>
      </div>
      <button 
        @click="validateAndSetCoordinates"
        class="btn btn-xs btn-secondary w-full"
        :disabled="!manualCoords.lat || !manualCoords.lon"
      >
        {{ $t("Set Location") }}
      </button>
    </div>

    <!-- Map picker method -->
    <div v-if="activeMethod === 'map'" class="space-y-2">
      <button 
        @click="showMapModal = true"
        class="btn btn-sm btn-primary w-full"
      >
        <IconsMapPin class="w-4 h-4" />
        {{ $t("Open Map") }}
      </button>
    </div>

    <!-- Map Modal -->
    <div v-if="showMapModal" class="modal modal-open">
      <div class="modal-box w-11/12 max-w-5xl h-5/6 max-h-[90vh] flex flex-col p-0">
        <div class="flex justify-between items-center p-6 pb-4 flex-shrink-0">
          <h3 class="font-bold text-lg">{{ $t("Select Your Location") }}</h3>
          <button 
            @click="showMapModal = false"
            class="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
        
        <div class="flex-1 px-6 pb-4 min-h-0">
          <MapPicker 
            ref="mapPickerRef"
            :latitude="location.lat || 51.505"
            :longitude="location.long || -0.09"
            @location-selected="onLocationSelectedFromMap"
          />
        </div>
        
        <div class="modal-action px-6 pb-6 flex-shrink-0 mt-0">
          <button @click="showMapModal = false" class="btn">
            {{ $t("Close") }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showMapModal = false"></div>
    </div>

    <!-- Current location display - compact badge -->
    <div v-if="location.lat && location.long" class="mt-2">
      <div class="badge badge-success badge-sm gap-1 w-full py-3 text-xs truncate">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="truncate">{{ location.address || `${location.lat?.toFixed(2)}, ${location.long?.toFixed(2)}` }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const prayersStore = usePrayersStore();
const { location } = storeToRefs(prayersStore);
const { t } = useI18n();

// Location input methods
const locationMethods = ref([
  { key: 'geolocation', label: 'Use Current Location', icon: 'IconsMapPin' },
  { key: 'address', label: 'Search Address', icon: 'IconsSearch' },
  { key: 'map', label: 'Pick on Map', icon: 'IconsMapPin' },
  { key: 'coordinates', label: 'Enter Coordinates', icon: 'IconsCoordinates' },
]);

const activeMethod = ref('geolocation');
const loadingLocation = ref(false);
const showMapModal = ref(false);
const mapPickerRef = ref<any>(null);

// Address search
const addressQuery = ref('');
const addressSuggestions = ref<any[]>([]);
const showSuggestions = ref(false);
let searchTimeout: NodeJS.Timeout | null = null;

// Manual coordinates
const manualCoords = ref({
  lat: null as number | null,
  lon: null as number | null
});

// Get current geolocation
const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert(t("Geolocation is not supported by this browser."));
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
      
      // Try to get address from reverse geocoding
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
      
      alert(message);
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
const searchAddresses = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  if (!addressQuery.value || addressQuery.value.length < 3) {
    addressSuggestions.value = [];
    return;
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery.value)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      addressSuggestions.value = data;
    } catch (error) {
      console.error('Address search error:', error);
      addressSuggestions.value = [];
    }
  }, 300);
};

// Select an address from suggestions
const selectAddress = (suggestion: any) => {
  prayersStore.setLocation({
    lat: parseFloat(suggestion.lat),
    long: parseFloat(suggestion.lon),
    address: suggestion.display_name
  });
  
  addressQuery.value = suggestion.display_name;
  addressSuggestions.value = [];
  showSuggestions.value = false;
};

// Validate and set manual coordinates
const validateAndSetCoordinates = () => {
  if (!manualCoords.value.lat || !manualCoords.value.lon) {
    return;
  }
  
  const lat = Number(manualCoords.value.lat);
  const lon = Number(manualCoords.value.lon);
  
  if (isNaN(lat) || isNaN(lon)) {
    alert(t("Please enter valid numbers for coordinates"));
    return;
  }
  
  if (lat < -90 || lat > 90) {
    alert(t("Latitude must be between -90 and 90"));
    return;
  }
  
  if (lon < -180 || lon > 180) {
    alert(t("Longitude must be between -180 and 180"));
    return;
  }
  
  prayersStore.setLocation({
    lat: lat,
    long: lon,
    address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  });
};

// Handle location selection from map
const onLocationSelectedFromMap = (location: { lat: number, lng: number }) => {
  prayersStore.setLocation({
    lat: location.lat,
    long: location.lng,
    address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  });
  showMapModal.value = false; // Close modal after selection
};

// Watch for modal opening to fix map rendering
watch(showMapModal, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      setTimeout(() => {
        if (mapPickerRef.value?.invalidateSize) {
          mapPickerRef.value.invalidateSize();
        }
      }, 100);
      setTimeout(() => {
        if (mapPickerRef.value?.invalidateSize) {
          mapPickerRef.value.invalidateSize();
        }
      }, 300);
      setTimeout(() => {
        if (mapPickerRef.value?.invalidateSize) {
          mapPickerRef.value.invalidateSize();
        }
      }, 600);
    });
  }
});

// Hide suggestions when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>