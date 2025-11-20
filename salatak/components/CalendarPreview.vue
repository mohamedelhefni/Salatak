<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { locale, t } = useI18n()
const { subscribeURL, timings, prayers } = storeToRefs(prayersStore)
const { setEvents, mapTimingsToEvents } = prayersStore
const { $toast } = useNuxtApp()

let calendarOptions = ref({
  plugins: [dayGridPlugin],
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
  <div class="col-span-2 self-start">
    <div class="indicator w-full " v-if="subscribeURL != ''">
      <span class="indicator-item badge badge-primary py-3 rounded top-3 right-3 cursor-pointer"
        @click="copyToClipboard">
        <IconsClipboard class="w-5 h-5" />
      </span>
      <div class="p-3 bg-base-200 my-2 rounded-lg truncate"> {{ subscribeURL }} </div>
    </div>
    <div class="bg-white p-5 rounded-lg">
      <FullCalendar :options="calendarOptions" />
    </div>

  </div>
</template>
