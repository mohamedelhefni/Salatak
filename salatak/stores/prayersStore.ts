import { defineStore } from 'pinia'
import { createEvents } from 'ics';
import { format } from 'date-fns'

interface PrayerCalcMethod {
  id: number
  name: string
}


interface AddressLocaiton {
  address: string
  lat?: number
  long?: number
}


interface State {
  location: AddressLocaiton
  prayers: any[]
  timings: any[]
  events: any[]
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
      p.duration = duration
    },
    setPrayRemainder(pray: any, duration: any) {
      let p = this.getPray(pray.name)
      if (!p) return
      p.remainder = duration
    },
    async getPrayersTimings() {
      const d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1 // months starts from 0
      let resp = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${this.location.lat}&longitude=${this.location.long}&method=${this.calcMethod}&school=${this.asrMethod}`)
      let data = await resp.json()
      this.timings = data.data
    },
    async reverseGeocoding() {
      let resp = await fetch(`https://geocode.maps.co/reverse?lat=${this.location.lat}&lon=${this.location.long}`)
      let data = await resp.json()
      this.location.address = data.display_name
    },
    async getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("position is", position)
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
    }
  },
  persist: true,
})
