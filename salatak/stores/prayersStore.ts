import { defineStore } from 'pinia'

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
    calcMethod: number
    calcMethods: PrayerCalcMethod[]
    days: number
    asrMethod: number
}

export const usePrayersStore = defineStore('prayers', {
    state: (): State => {
        return {
            location: { address: "" },
            prayers: [],
            timings: [],
            calcMethod: 5, // 5 -> egyption calc method
            calcMethods: [],
            days: 7,
            asrMethod: 0
        }
    }
    ,
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
        async getPrayersTimings() {
            const d = new Date()
            let year = d.getFullYear()
            let month = d.getMonth()
            let resp = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${this.location.lat}&longitude=${this.location.long}`)
            let data = await resp.json()
            console.log("timings", data)
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



    },
    persist: true,
})