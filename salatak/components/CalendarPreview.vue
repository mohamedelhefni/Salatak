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
const { $toast } = useNuxtApp()

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
      <div class="card-body p-2 sm:p-3 md:p-4">
        <h2 class="card-title text-base sm:text-lg mb-3">📅 {{ $t("Calendar Preview") }}</h2>
        <div class="calendar-wrapper bg-base-100 p-2 sm:p-3 rounded-lg border border-base-300">
          <FullCalendar ref="calendarRef" :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  @apply overflow-hidden;
}

/* Calendar theme support */
:deep(.fc) {
  @apply bg-base-100 text-base-content;
}

:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th) {
  @apply border-base-300;
}

:deep(.fc-scrollgrid) {
  @apply border-base-300;
}

:deep(.fc-theme-standard .fc-scrollgrid) {
  border-color: inherit;
}

/* Ensure event backgrounds render in all themes */
:deep(.fc-h-event),
:deep(.fc-v-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

:deep(.fc-event .fc-event-main) {
  color: var(--fc-event-text-color) !important;
}

/* Specific selectors for daygrid events */
:deep(.fc-daygrid-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

:deep(.fc-daygrid-event .fc-event-main) {
  color: white !important;
}

:deep(.fc-daygrid-block-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

:deep(.fc-daygrid-block-event .fc-event-title) {
  color: white !important;
}

/* FullCalendar responsive styling */
:deep(.fc) {
  font-family: inherit;
}

/* Mobile styles (< 768px) */
@media (max-width: 767px) {
  :deep(.fc) {
    font-size: 0.7rem;
  }

  :deep(.fc-toolbar-title) {
    font-size: 0.9rem !important;
  }

  :deep(.fc-button) {
    padding: 0.25rem 0.4rem !important;
    font-size: 0.7rem !important;
  }

  :deep(.fc-list-event-time) {
    font-size: 0.7rem !important;
  }

  :deep(.fc-list-event-title) {
    font-size: 0.75rem !important;
  }

  :deep(.fc-list-day-cushion) {
    padding: 0.5rem !important;
  }
}

/* Tablet styles (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  :deep(.fc) {
    font-size: 0.8rem;
  }

  :deep(.fc-toolbar-title) {
    font-size: 1rem !important;
  }

  :deep(.fc-button) {
    padding: 0.3rem 0.5rem !important;
    font-size: 0.8rem !important;
  }

  :deep(.fc-list-event-time) {
    font-size: 0.8rem !important;
  }

  :deep(.fc-list-event-title) {
    font-size: 0.85rem !important;
  }
}

/* Desktop styles (>= 1024px) */
@media (min-width: 1024px) {
  :deep(.fc) {
    font-size: 0.875rem;
  }

  :deep(.fc-toolbar-title) {
    font-size: 1.125rem !important;
  }
}

/* List view enhancements */
:deep(.fc-list-day-cushion) {
  @apply bg-base-200 text-base-content;
  @apply font-semibold;
}

:deep(.fc-list-event) {
  @apply border-base-300;
  background-color: transparent;
}

:deep(.fc-list-event:hover) {
  @apply bg-base-200/50;
}

/* Non-prayer events in list view */
:deep(.fc-list-event-time):not(.prayer-event .fc-list-event-time) {
  @apply text-base-content/70;
}

:deep(.fc-list-event-title):not(.prayer-event .fc-list-event-title) {
  @apply text-base-content;
}

:deep(.fc-list-event-dot) {
  border-color: inherit !important;
}

/* List view colored backgrounds for prayer events */
:deep(.fc-list-event.prayer-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-left-width: 4px !important;
  border-left-color: var(--fc-event-border-color) !important;
}

:deep(.fc-list-event.prayer-event .fc-list-event-graphic) {
  background-color: transparent !important;
}

:deep(.fc-list-event.prayer-event td) {
  background-color: inherit !important;
}

/* Event styling */
:deep(.fc-event) {
  @apply cursor-default;
  border-left-width: 4px !important;
}

/* Prayer events with colored backgrounds */
:deep(.fc-event.prayer-event) {
  /* Ensure background color is applied */
  opacity: 1 !important;
}

:deep(.fc-event.prayer-event .fc-event-main) {
  color: white !important;
}

/* Force white text on colored event backgrounds in all views */
:deep(.prayer-event .fc-event-title),
:deep(.prayer-event .fc-event-time),
:deep(.prayer-event .fc-daygrid-event-dot),
:deep(.fc-event.prayer-event .fc-event-title-container),
:deep(.fc-event.prayer-event .fc-event-time) {
  color: white !important;
  font-weight: 500;
}

:deep(.fc-daygrid-event.prayer-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

:deep(.fc-timegrid-event.prayer-event) {
  background-color: var(--fc-event-bg-color) !important;
  border-color: var(--fc-event-border-color) !important;
}

/* List view prayer events */
:deep(.prayer-event .fc-list-event-title),
:deep(.prayer-event .fc-list-event-time) {
  color: white !important;
  font-weight: 500;
}

:deep(.fc-daygrid-day-number) {
  padding: 0.25rem;
  color: inherit;
}

:deep(.fc-daygrid-day) {
  background-color: transparent;
}

:deep(.fc-day-today) {
  @apply bg-primary/10 !important;
}

:deep(.fc-daygrid-day-frame) {
  background-color: transparent;
}

/* Ensure proper text contrast */
:deep(.fc-daygrid-day-top) {
  color: inherit;
}

/* Header styling */
:deep(.fc-col-header) {
  @apply bg-base-200 text-base-content;
}

:deep(.fc-col-header-cell) {
  @apply font-semibold border-base-300;
  padding: 0.5rem 0.25rem;
}

:deep(.fc-col-header-cell-cushion) {
  @apply text-base-content;
}

/* More link styling */
:deep(.fc-more-link) {
  @apply text-primary;
  @apply font-medium;
  font-size: 0.7rem;
}

/* Toolbar responsiveness */
:deep(.fc-toolbar) {
  @apply flex-wrap;
  gap: 0.5rem;
}

:deep(.fc-toolbar-title) {
  @apply text-base-content;
}

:deep(.fc-button) {
  @apply bg-base-200 text-base-content border-base-300;
}

:deep(.fc-button:hover) {
  @apply bg-base-300;
}

:deep(.fc-button-primary) {
  background-color: oklch(var(--p)) !important;
  border-color: oklch(var(--p)) !important;
  color: oklch(var(--pc)) !important;
}

:deep(.fc-button-primary:hover) {
  background-color: oklch(var(--p)) !important;
  filter: brightness(0.9);
}

:deep(.fc-button-primary:disabled) {
  opacity: 0.6;
}

:deep(.fc-button-active) {
  background-color: oklch(var(--p)) !important;
  border-color: oklch(var(--p)) !important;
  color: oklch(var(--pc)) !important;
}

@media (max-width: 767px) {
  :deep(.fc-toolbar) {
    @apply flex-col;
  }

  :deep(.fc-toolbar-chunk) {
    @apply flex justify-center;
  }
}
</style>
