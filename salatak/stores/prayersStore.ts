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
          remainder: 15
        },
        {
          checked: true,
          name: "Dhuhr",
          duration: 10,
          remainder: 15
        }, {
          checked: true,
          name: "Asr",
          duration: 10,
          remainder: 15
        }, {
          checked: true,
          name: "Maghrib",
          duration: 10,
          remainder: 15
        }, {
          checked: true,
          name: "Isha",
          duration: 10,
          remainder: 15
        },
      ],
      timings: [],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
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
      const startDate = new Date(this.startDate)
      const endDate = new Date(this.endDate)
      if (this.location.lat == undefined || this.location.long == undefined) {
        alert("you must enter valid address")
        return
      }
      const service = new PrayerTimingsService({
        startDate: startDate,
        endDate: endDate,
        location: this.location,
        calcMethod: this.calcMethod,
        asrMethod: this.asrMethod
      })
      this.loading = true
      await service.getPrayersTimings()
      this.loading = false

      const selectedPrayers = this.prayers.filter(p => p.checked).map(p => p.name).join(',');
      const durationParams = this.prayers
        .filter(p => p.checked)
        .map(p => `${p.name.toLowerCase()}Duration=${p.duration}`)
        .join('&')
      this.subscribeURL = `${window.location.origin}/api/prayer-calendar?lat=${this.location.lat}&long=${this.location.long}&startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate.toISOString().slice(0, 10)}&alarm=15&${durationParams}&calcMethod=${this.calcMethod}&asrMethod=${this.asrMethod}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&selectedPrayers=${selectedPrayers}`
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
      const JUMMAH_TIME_BUFFER = 60
      months.forEach((month: any) => {
        month.forEach((day: any) => {
          Object.entries(day.timings).map(t => ({ name: t[0], date: t[1] })).forEach(pray => {
            let prayerConfig = this.prayers.find(p => p.name === pray.name)
            if (!prayerConfig || !prayerConfig.checked) return

            let dayName = day.date.gregorian.weekday.en
            let bufferTime = dayName == "Friday" && pray.name == "Dhuhr" ? JUMMAH_TIME_BUFFER : Number(prayerConfig.duration)
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

  },
  persist: true,
})
