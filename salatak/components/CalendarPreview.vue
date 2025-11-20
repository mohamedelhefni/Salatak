<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { locale, t } = useI18n()
const { subscribeURL, timings, prayers } = storeToRefs(prayersStore)
const { setEvents, mapTimingsToEvents } = prayersStore
const { $toast } = useNuxtApp()

let calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  locales: [enLocales, arLocales],
  locale: locale.value || "en",
  initialView: 'dayGridMonth',
  height: 'auto',
  expandRows: true,
  events: []
})


watch(locale, () => {
  calendarOptions.value.locale = locale.value
})

watch([timings, prayers], () => {
  let mappedEvents = mapTimingsToEvents(timings.value, t)
  //@ts-ignore
  calendarOptions.value.events = mappedEvents
  setEvents(mappedEvents)
}, { deep: true })


const copyToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(subscribeURL.value)
      .then(() => {
        $toast.show(t('text_copied_to_clipboard'), 'info');
      })
      .catch((error) => {
        $toast.show(t('failed_to_copy'), 'error');
        console.error('Failed to copy:', error);
      });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = subscribeURL.value;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      $toast.show(t('text_copied_to_clipboard'), 'info');
    } catch (error) {
      $toast.show(t('failed_to_copy'), 'error');
      console.error('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  }
}

</script>


<template>
  <div class="space-y-3">
    <!-- Subscribe URL Card -->
    <div v-if="subscribeURL != ''" class="card bg-base-200 shadow-xl">
      <div class="card-body p-4">
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold mb-1">📅 {{ $t("Calendar URL") }}</p>
            <p class="text-xs truncate text-base-content/70">{{ subscribeURL }}</p>
          </div>
          <button 
            @click="copyToClipboard"
            class="btn btn-sm btn-primary btn-circle flex-shrink-0"
            :title="$t('Copy to clipboard')"
          >
            <IconsClipboard class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar Card -->
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body p-4">
        <h2 class="card-title text-lg mb-3">📅 {{ $t("Calendar Preview") }}</h2>
        <div class="bg-white p-3 rounded-lg">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
