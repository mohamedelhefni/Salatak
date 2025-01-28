<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { locale, t } = useI18n()
const { prayers, timings } = storeToRefs(prayersStore)
const { setEvents, mapTimingsToEvents } = prayersStore

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

watch(timings, (state) => {
  let mappedEvents = mapTimingsToEvents(state, t)
  //@ts-ignore
  calendarOptions.value.events = mappedEvents
  setEvents(mappedEvents)
})

</script>


<template>
  <div class="self-stretch flex-1">
    <div class="bg-white p-5 bg-white rounded-lg">
      <FullCalendar :options="calendarOptions"/>
    </div>
  </div>
</template>
