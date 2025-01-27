<script setup lang="ts">

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { locale, t } = useI18n()
const { prayers, timings } = storeToRefs(prayersStore)
const { setEvents } = prayersStore

let calendarOptions = ref({
  plugins: [dayGridPlugin],
  locales: [enLocales, arLocales],
  locale: locale.value || "en",
  initialView: 'dayGridMonth',
  events: []
})


const mapTimingsToEvents = (months: any[]): any[] => {
  const events: any[] = []
  const PRAY_TIME_BUFFER = 30
  const JUMMAH_TIME_BUFFER = 60
  console.log("timings ", timings)
  months.forEach(month => {
    month.forEach(day => {
      Object.entries(day.timings).map(t => ({ name: t[0], date: t[1] })).forEach(pray => {
        let allowedPrays = prayers.value.filter(p => p.checked).map(p => p.name)
        if (!allowedPrays.includes(pray.name)) return
        let dayName = day.date.gregorian.weekday.en
        let bufferTime = dayName == "Friday" && pray.name == "Dhuhr" ? JUMMAH_TIME_BUFFER : PRAY_TIME_BUFFER
        let prayName = dayName == "Friday" && pray.name == "Dhuhr" ? "Jummuah" : pray.name
        let prayDateStart = new Date(`${day.date.readable} ${pray.date}`)
        let prayDateEnd = new Date(prayDateStart)
        prayDateEnd.setMinutes(prayDateStart.getMinutes() + bufferTime)
        events.push({ title: `🕋 ${t(prayName)}`, start: prayDateStart, end: prayDateEnd })
      })

    })

  })
  return events
}



watch(locale, () => {
  calendarOptions.value.locale = locale.value
})

watch(timings, (state) => {
  let mappedEvents = mapTimingsToEvents(state)
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
