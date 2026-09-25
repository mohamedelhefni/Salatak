<template>
  <div ref="mapContainer" class="h-[60dvh] min-h-80 w-full overflow-hidden rounded-md border border-default" />
</template>

<script setup lang="ts">
interface Props {
  latitude?: number;
  longitude?: number;
}

const props = withDefaults(defineProps<Props>(), {
  latitude: 51.505,
  longitude: -0.09
});

const emit = defineEmits<{
  (e: 'locationSelected', location: { lat: number, lng: number }): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let marker: any = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
  // Leaflet touches window, so load it on the client only
  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  if (!mapContainer.value) return;

  map = L.map(mapContainer.value).setView([props.latitude, props.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  marker = L.marker([props.latitude, props.longitude]).addTo(map);

  map.on('click', (e: any) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    emit('locationSelected', { lat, lng });
  });

  // The modal animates open, so re-measure whenever the container resizes
  resizeObserver = new ResizeObserver(() => map?.invalidateSize());
  resizeObserver.observe(mapContainer.value);
});

watch([() => props.latitude, () => props.longitude], ([lat, lng]) => {
  if (map && marker && lat && lng) {
    map.setView([lat, lng], map.getZoom());
    marker.setLatLng([lat, lng]);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  map?.remove();
});
</script>
