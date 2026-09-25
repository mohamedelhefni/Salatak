<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';
const prayersStore = usePrayersStore()
const { locale, t } = useI18n()
const { subscribeURL, timings, prayers } = storeToRefs(prayersStore)
const { setEvents, mapTimingsToEvents } = prayersStore
const toast = useToast()

// Detect screen size
const isMobile = ref(false)
const isTablet = ref(false)
const calendarRef = ref<any>(null)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Get appropriate view based on screen size
const getResponsiveView = () => {
  if (isMobile.value || isTablet.value) {
    return 'listWeek'
  }
  return 'dayGridMonth'
}

let calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: isMobile.value || isTablet.value ? 'listWeek,dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  locales: [enLocales, arLocales],
  locale: locale.value || "en",
  initialView: getResponsiveView(),
  height: 'auto',
  expandRows: true,
  events: [],
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: 'short'
  },
  displayEventTime: true,
  displayEventEnd: false,
  dayMaxEvents: 3,
  moreLinkText: (num: number) => `+${num} ${t('more')}`
})

// Watch screen size changes and update header toolbar
watch([isMobile, isTablet], () => {
  calendarOptions.value.headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: isMobile.value || isTablet.value ? 'listWeek,dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay'
  }

  // Update calendar view if needed
  if (calendarRef.value && (isMobile.value || isTablet.value)) {
    const calendarApi = calendarRef.value.getApi()
    const currentView = calendarApi.view.type
    if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
      calendarApi.changeView('listWeek')
    }
  }
})


watch(locale, () => {
  calendarOptions.value.locale = locale.value
})

watch([timings, prayers], () => {
  const mappedEvents = mapTimingsToEvents(timings.value, t)
  calendarOptions.value = { ...calendarOptions.value, events: mappedEvents }
  setEvents(mappedEvents)
}, { deep: true })


const copyToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(subscribeURL.value)
      .then(() => {
        toast.add({ title: t('text_copied_to_clipboard'), color: 'success', icon: 'i-lucide-check' });
        // Track copy URL event for PostHog survey trigger
        const { trackUrlCopy } = usePostHog()
        trackUrlCopy()
      })
      .catch((error) => {
        toast.add({ title: t('failed_to_copy'), color: 'error' });
        console.error('Failed to copy:', error);
      });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = subscribeURL.value;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.add({ title: t('text_copied_to_clipboard'), color: 'success', icon: 'i-lucide-check' });
      // Track copy URL event for PostHog survey trigger
      const { trackUrlCopy } = usePostHog()
      trackUrlCopy()
    } catch (error) {
      toast.add({ title: t('failed_to_copy'), color: 'error' });
      console.error('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  }
}

</script>


<template>
  <div class="space-y-4">
    <!-- Subscribe URL -->
    <div v-if="subscribeURL != ''" class="rounded-lg border border-default bg-elevated/50 p-3">
      <p class="mb-2 flex items-center gap-1.5 text-sm font-medium">
        <UIcon name="i-lucide-link" class="size-4 text-primary" />
        {{ $t("Calendar URL") }}
      </p>
      <div class="flex items-center gap-2">
        <UInput :model-value="subscribeURL" readonly dir="ltr" size="sm" class="min-w-0 flex-1" @focus="(e: any) => e.target.select()" />
        <UButton icon="i-lucide-copy" size="sm" :label="$t('Copy to clipboard')" :ui="{ label: 'hidden sm:inline' }" @click="copyToClipboard" />
      </div>
    </div>

    <!-- Calendar -->
    <div>
      <h3 class="mb-2 flex items-center gap-1.5 text-sm font-medium">
        <UIcon name="i-lucide-calendar-days" class="size-4 text-primary" />
        {{ $t("Calendar Preview") }}
      </h3>
      <div class="calendar-wrapper overflow-hidden rounded-lg border border-default p-2 sm:p-3">
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Map FullCalendar's theme variables onto Nuxt UI's so it follows light/dark mode */
.calendar-wrapper {
  --fc-border-color: var(--ui-border);
  --fc-page-bg-color: var(--ui-bg);
  --fc-neutral-bg-color: var(--ui-bg-elevated);
  --fc-list-event-hover-bg-color: var(--ui-bg-elevated);
  --fc-today-bg-color: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  --fc-button-bg-color: var(--ui-bg-elevated);
  --fc-button-border-color: var(--ui-border);
  --fc-button-text-color: var(--ui-text);
  --fc-button-hover-bg-color: var(--ui-bg-accented);
  --fc-button-hover-border-color: var(--ui-border-accented);
  --fc-button-active-bg-color: var(--ui-primary);
  --fc-button-active-border-color: var(--ui-primary);
  color: var(--ui-text);
}

:deep(.fc) {
  font-family: inherit;
  font-size: 0.8rem;
}

:deep(.fc-toolbar) {
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.fc-toolbar-title) {
  font-size: 1rem !important;
  font-weight: 600;
}

:deep(.fc-button) {
  padding: 0.3rem 0.6rem !important;
  font-size: 0.8rem !important;
  border-radius: calc(var(--ui-radius) * 1.5) !important;
  box-shadow: none !important;
}

:deep(.fc-button-active) {
  color: var(--ui-text-inverted) !important;
}

:deep(.fc-col-header-cell) {
  padding: 0.4rem 0.25rem;
  font-weight: 600;
}

:deep(.fc-list-day-cushion) {
  font-weight: 600;
}

:deep(.fc-more-link) {
  color: var(--ui-primary);
  font-weight: 500;
  font-size: 0.7rem;
}

:deep(.fc-event) {
  cursor: default;
  border-inline-start-width: 4px !important;
}

/* Prayer events carry their own colour; keep text readable on it */
:deep(.fc-event.prayer-event),
:deep(.fc-list-event.prayer-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

:deep(.fc-list-event.prayer-event td) {
  background-color: inherit !important;
}

:deep(.prayer-event .fc-event-main),
:deep(.prayer-event .fc-event-title),
:deep(.prayer-event .fc-event-time),
:deep(.prayer-event .fc-list-event-title),
:deep(.prayer-event .fc-list-event-time) {
  color: white !important;
  font-weight: 500;
}

@media (min-width: 1024px) {
  :deep(.fc) { font-size: 0.875rem; }
  :deep(.fc-toolbar-title) { font-size: 1.125rem !important; }
}

@media (max-width: 767px) {
  :deep(.fc-toolbar) { flex-direction: column; }
  :deep(.fc-toolbar-chunk) { display: flex; justify-content: center; }
}
</style>
