import { defineStore } from 'pinia'
import { createEvents } from 'ics';
import { format } from 'date-fns'
import { AddressLocaiton, PrayerTimingsService } from '~/services/PrayerTimeingsService';

interface PrayerCalcMethod {
  id: number
  name: string
}

interface State {
  location: AddressLocaiton
  loading: boolean
  subscribeURL: string
  prayers: any[]
  timings: any[]
  events: any[]
  startDate: Date
  endDate: Date
  dateMode: 'fixed' | 'rolling'
  rollingDuration: number
  calcMethod: number
  calcMethods: PrayerCalcMethod[]
  days: number
  asrMethod: number
}

const mapEventDateToICSDate = (date: any) => {
  const inputDate = new Date(date);
  const formattedDate = format(inputDate, 'yyyy-M-d-H-m');
  const formattedDateArray = formattedDate.split('-').map(d => Number(d));
  return formattedDateArray
}

export const usePrayersStore = defineStore('prayers', {
  state: (): State => {
    return {
      location: { address: "" },
      loading: false,
      subscribeURL: "",
      events: [],
      prayers: [
        {
          checked: true,
          name: "Fajr",
          duration: 10,
          remainder: 15,
          offset: 0
        },
        {
          checked: true,
          name: "Dhuhr",
          duration: 10,
          remainder: 15,
          offset: 0
        }, {
          checked: true,
          name: "Asr",
          duration: 10,
          remainder: 15,
          offset: 0
        }, {
          checked: true,
          name: "Maghrib",
          duration: 10,
          remainder: 15,
          offset: 0
        }, {
          checked: true,
          name: "Isha",
          duration: 10,
          remainder: 15,
          offset: 0
        }, {
          checked: true,
          name: "Jummah",
          duration: 60,
          remainder: 15,
          offset: 0
        },
      ],
      timings: [],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      dateMode: 'rolling', // Default to rolling mode for better UX
      rollingDuration: 18, // Default to 18 months
      calcMethod: 5, // 5 -> egyption calc method
      calcMethods: [],
      days: 7,
      asrMethod: 0,
    }
  },
  actions: {
    async fetchPrayerCalcMethods() {
      let resp = await fetch("https://api.aladhan.com/v1/methods")
      let data = await resp.json()
      let methodsArr = Object.values(data.data)
      this.calcMethods = methodsArr.map((method: any) => ({ id: method.id, name: method.name || "Custom" }))
    },
    setCalcMethod(method: number) {
      this.calcMethod = method
    },
    setLoading(state: boolean) {
      this.loading = state
    }
    ,
    setDays(days: number) {
      this.days = days
    },
    setAsrMethod(method: number) {
      this.asrMethod = method
    },
    setDateMode(mode: 'fixed' | 'rolling') {
      this.dateMode = mode
    },
    setRollingDuration(months: number) {
      this.rollingDuration = months
    },
    setLocation(location: AddressLocaiton) {
      this.location = { ...location }
    },
    getPray(name: string) {
      return this.prayers.find(pray => pray.name == name)
    },
    setEvents(events: any[]) {
      this.events = events
    },
    setPrayActive(pray: any, checked: any) {
      let p = this.getPray(pray.name)
      if (!p) return
      p.checked = checked
    },
    setPrayDuration(pray: any, duration: any) {
      let p = this.getPray(pray.name)
      if (!p) return

      // Convert to number and validate
      const numDuration = Number(duration)
      if (isNaN(numDuration) || numDuration < 0) {
        console.warn(`Invalid duration value: ${duration}. Using default value of 10.`)
        p.duration = 10
        return
      }

      // Ensure reasonable limits (max 180 minutes = 3 hours)
      if (numDuration > 180) {
        console.warn(`Duration too large: ${numDuration}. Setting to maximum of 180 minutes.`)
        p.duration = 180
        return
      }

      p.duration = numDuration
    },
    setPrayOffset(pray: any, offset: any) {
      let p = this.getPray(pray.name)
      if (!p) return

      // Convert to number and validate
      const numOffset = Number(offset)
      if (isNaN(numOffset)) {
        console.warn(`Invalid offset value: ${offset}. Using default value of 0.`)
        p.offset = 0
        return
      }

      // Ensure reasonable limits (e.g. +/- 60 minutes)
      if (Math.abs(numOffset) > 60) {
        console.warn(`Offset too large: ${numOffset}. Setting to maximum of +/- 60 minutes.`)
        p.offset = numOffset > 0 ? 60 : -60
        return
      }

      p.offset = numOffset
    },
    setPrayRemainder(pray: any, duration: any) {
      let p = this.getPray(pray.name)
      if (!p) return

      // Convert to number and validate
      const numRemainder = Number(duration)
      if (isNaN(numRemainder) || numRemainder < 0) {
        console.warn(`Invalid remainder value: ${duration}. Using default value of 15.`)
        p.remainder = 15
        return
      }

      // Ensure reasonable limits (max 60 minutes for reminder)
      if (numRemainder > 60) {
        console.warn(`Remainder too large: ${numRemainder}. Setting to maximum of 60 minutes.`)
        p.remainder = 60
        return
      }

      p.remainder = numRemainder
    },
    setStartDate(date: any) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        alert("Invalid start date");
        return;
      }
      this.startDate = d;
    },
    setEndDate(date: any) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        alert("Invalid end date");
        return;
      }
      this.endDate = d;
    },
    async getPrayersTimings() {
      // Calculate effective dates based on mode
      let effectiveStartDate: Date;
      let effectiveEndDate: Date;

      if (this.dateMode === 'rolling') {
        effectiveStartDate = new Date();
        effectiveStartDate.setHours(0, 0, 0, 0);  // Start of today

        effectiveEndDate = new Date();
        effectiveEndDate.setMonth(effectiveEndDate.getMonth() + this.rollingDuration);
        effectiveEndDate.setHours(23, 59, 59, 999);  // End of last day
      } else {
        effectiveStartDate = new Date(this.startDate);
        effectiveEndDate = new Date(this.endDate);
      }

      if (this.location.lat == undefined || this.location.long == undefined) {
        alert("you must enter valid address")
        return
      }

      const service = new PrayerTimingsService({
        startDate: effectiveStartDate,
        endDate: effectiveEndDate,
        location: this.location,
        calcMethod: this.calcMethod,
        asrMethod: this.asrMethod
      })
      this.loading = true
      await service.getPrayersTimings()
      this.loading = false

      const selectedPrayers = this.prayers.filter(p => p.checked && p.name !== 'Jummah').map(p => p.name).join(',');
      const durationParams = this.prayers
        .filter(p => p.checked && p.name !== 'Jummah')
        .map(p => `${p.name.toLowerCase()}Duration=${p.duration}`)
        .join('&')
      const offsetParams = this.prayers
        .filter(p => p.checked && p.name !== 'Jummah')
        .map(p => `${p.name.toLowerCase()}Offset=${p.offset}`)
        .join('&')

      // Add Jummah parameters separately if checked
      const jummahPrayer = this.prayers.find(p => p.name === 'Jummah')
      const jummahParams = jummahPrayer?.checked
        ? `&jummahDuration=${jummahPrayer.duration}&jummahOffset=${jummahPrayer.offset}`
        : ''

      // Different URL format based on date mode
      let dateParams;
      if (this.dateMode === 'rolling') {
        dateParams = `rollingDuration=${this.rollingDuration}`;
      } else {
        dateParams = `startDate=${effectiveStartDate.toISOString().slice(0, 10)}&endDate=${effectiveEndDate.toISOString().slice(0, 10)}`;
      }

      this.subscribeURL = `${window.location.origin}/api/prayer-calendar?lat=${this.location.lat}&long=${this.location.long}&${dateParams}&alarm=15&${durationParams}&${offsetParams}${jummahParams}&calcMethod=${this.calcMethod}&asrMethod=${this.asrMethod}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&selectedPrayers=${selectedPrayers}`
      this.timings = service.timings
    },
    async reverseGeocoding() {
      let resp = await fetch(`https://geocode.maps.co/reverse?lat=${this.location.lat}&lon=${this.location.long}`)
      let data = await resp.json()
      this.location.address = data.display_name
    },
    async getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.location.lat = position.coords.latitude
          this.location.long = position.coords.longitude
          this.reverseGeocoding()
        });
      } else {
        alert("Geolocation is not supported by this browser.")
      }
    },
    async downloadCalendar() {
      if (this.events.length <= 0) {
        await this.getPrayersTimings()
      }
      const filename = `SalatkPrayers.ics`
      const validEvents = this.events.map(event => {
        event.start = mapEventDateToICSDate(event.start)
        event.end = mapEventDateToICSDate(event.end)
        return event
      })
      const file = await new Promise((resolve, reject) => {

        createEvents(validEvents, (error, value) => {
          if (error) {
            reject(error)
          }

          resolve(new File([value], filename, { type: 'text/calendar' }))
        })
      })
      //@ts-ignore
      const url = URL.createObjectURL(file);

      // trying to assign the file URL to a window could cause cross-site
      // issues so this is a workaround using HTML5
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },
    mapTimingsToEvents(months: any[], t: any) {
      const events: any[] = []
      const jummahConfig = this.prayers.find(p => p.name === 'Jummah')

      // Prayer colors
      const prayerColors: Record<string, string> = {
        'Fajr': '#3B82F6',    // Blue
        'Dhuhr': '#10B981',   // Green
        'Asr': '#F59E0B',     // Orange
        'Maghrib': '#EC4899', // Pink
        'Isha': '#8B5CF6',    // Purple
        'Jummah': '#10B981'   // Green
      }

      months.forEach((month: any) => {
        month.forEach((day: any) => {
          Object.entries(day.timings).map(t => ({ name: t[0], date: t[1] })).forEach(pray => {
            let prayerConfig = this.prayers.find(p => p.name === pray.name)
            if (!prayerConfig || !prayerConfig.checked) return

            let dayName = day.date.gregorian.weekday.en
            let isJummah = dayName == "Friday" && pray.name == "Dhuhr"

            // Use Jummah config if it's Friday and Jummah is enabled, otherwise use regular prayer config
            if (isJummah && jummahConfig?.checked) {
              prayerConfig = jummahConfig
            } else if (isJummah && !jummahConfig?.checked) {
              // If Jummah is disabled, skip showing it on Friday
              return
            }

            let bufferTime = Number(prayerConfig.duration)
            let offset = Number(prayerConfig.offset) || 0
            let prayName = isJummah ? "Jummuah" : pray.name
            let prayDateStart = new Date(`${day.date.readable} ${pray.date}`)
            prayDateStart.setMinutes(prayDateStart.getMinutes() + offset)
            let prayDateEnd = new Date(prayDateStart)
            prayDateEnd.setMinutes(prayDateStart.getMinutes() + bufferTime)

            // Get prayer color
            const colorKey = isJummah ? 'Jummah' : pray.name
            const backgroundColor = prayerColors[colorKey] || '#6B7280'

            events.push({
              title: `🕋 ${t(prayName)}`,
              start: prayDateStart,
              end: prayDateEnd,
              backgroundColor: backgroundColor,
              borderColor: backgroundColor,
              textColor: '#FFFFFF',
              color: backgroundColor,  // This sets the overall color
              className: 'prayer-event',
              display: 'block'
            })
          })
        })
      })
      return events
    }

  },
  persist: true,
})
