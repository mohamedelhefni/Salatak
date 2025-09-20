<template>
  <div class="w-full h-full flex flex-col">
    <div id="map" ref="mapContainer" class="w-full flex-1 min-h-[400px] rounded-lg border"></div>
    <div class="text-sm text-gray-500 mt-2 flex-shrink-0">
      {{ $t("Click on the map to select your location") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface Props {
  latitude?: number;
  longitude?: number;
}

interface Emits {
  (e: 'locationSelected', location: { lat: number, lng: number }): void;
}

const props = withDefaults(defineProps<Props>(), {
  latitude: 51.505,
  longitude: -0.09
});

const emit = defineEmits<Emits>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let marker: any = null;
let L: any = null;

onMounted(async () => {
  // Dynamically import Leaflet to avoid SSR issues
  if (process.client) {
    const leafletModule = await import('leaflet');
    L = leafletModule.default;
    
    // Import CSS
    await import('leaflet/dist/leaflet.css');
    
    // Fix default markers (webpack issue)
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    
    // Wait a bit for the DOM to be ready, especially in modal
    setTimeout(initializeMap, 100);
  }
});

const initializeMap = () => {
  if (!mapContainer.value || !L) return;
  
  // Create map
  map = L.map(mapContainer.value, {
    preferCanvas: true,
    attributionControl: true
  }).setView([props.latitude, props.longitude], 13);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add initial marker
  marker = L.marker([props.latitude, props.longitude])
    .addTo(map)
    .bindPopup('Your selected location')
    .openPopup();
  
  // Handle map clicks
  map.on('click', (e: any) => {
    const { lat, lng } = e.latlng;
    
    // Update marker position
    marker.setLatLng([lat, lng]);
    
    // Emit the selected location
    emit('locationSelected', { lat, lng });
  });
  
  // Force initial size invalidation
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 100);
};

// Watch for prop changes to update map view
watch([() => props.latitude, () => props.longitude], ([newLat, newLng]) => {
  if (map && marker && newLat && newLng) {
    const newPos = [newLat, newLng];
    map.setView(newPos, map.getZoom());
    marker.setLatLng(newPos);
  }
});

// Expose method to invalidate map size (useful when shown in modal)
const invalidateSize = () => {
  if (map) {
    // Multiple attempts to ensure the map resizes properly
    setTimeout(() => {
      map.invalidateSize(true);
    }, 50);
    setTimeout(() => {
      map.invalidateSize(true);
    }, 200);
    setTimeout(() => {
      map.invalidateSize(true);
    }, 500);
  }
};

defineExpose({
  invalidateSize
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
/* Ensure Leaflet styles are properly applied */
:deep(.leaflet-container) {
  height: 100% !important;
  width: 100% !important;
  min-height: 400px;
}

/* Ensure the map container has proper height */
#map {
  height: 100% !important;
  min-height: 400px !important;
}

/* Fix any potential z-index issues in modal */
:deep(.leaflet-control-container) {
  z-index: 1000;
}

:deep(.leaflet-popup) {
  z-index: 1001;
}
</style>