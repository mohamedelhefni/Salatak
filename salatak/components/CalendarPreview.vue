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
  <div class="flex flex-col gap-3 mt-4 flex-1 h-full">
    <h3 class="font-bold text-xl">{{ $t("Preview") }}</h3>
    <div class="p-5 bg-white rounded">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
