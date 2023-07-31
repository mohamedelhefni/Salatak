<script setup lang="ts">

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocales from "@fullcalendar/core/locales/en-gb"
import arLocales from "@fullcalendar/core/locales/ar"
import { usePrayersStore } from '~/stores/prayersStore';

const { locale } = useI18n()

const prayersStore = usePrayersStore()


let calendarOptions = ref({
    plugins: [dayGridPlugin],
    locales: [enLocales, arLocales],
    locale: locale.value || "en",
    initialView: 'dayGridMonth'
})

watch(locale, () => {
    calendarOptions.value.locale = locale.value
})

const { location, calcMethod, asrMethod, days } = storeToRefs(prayersStore)
const { setCalcMethod, setAsrMethod, setDays, getPrayersTimings } = prayersStore

const methods = computed(() => {
    return prayersStore.calcMethods
})


onMounted(async () => {
    prayersStore.fetchPrayerCalcMethods()
})


</script>

<template>
    <AppCard>
        <h2 class="card-title">{{ $t("salatak") }}</h2>
        <p>{{ $t("Schedual prayer times on your google calendar now") }}</p>
        <div class="flex flex-col gap-2">
            <div class="form-control w-full max-w-lg">
                <label class="label">
                    <span class="label-text">{{ $t("Address") }}</span>
                </label>
                <div class="input-group rtl:flex-row-reverse ">
                    <input type="text" :placeholder="$t('Address')" :value="location.address"
                        class=" input input-bordered w-full" />
                    <button @click="prayersStore.getLocation()" class="btn btn-primary btn-square">
                        <PhosphorIconMapPin :size="28" />
                    </button>
                </div>
            </div>

            <div class="form-control w-full max-w-lg">
                <label class="label">
                    <span class="label-text">{{ $t("Method of calculation") }}</span>
                </label>
                <select @change="(e: any) => setCalcMethod(Number(e.target.value))" class="select select-bordered w-full ">
                    <option disabled selected>{{ $t("Prayer time method calculation") }}</option>
                    <option v-for="method in methods" :value="method.id" :selected="method.id == calcMethod">{{
                        $t(method.name || " ") }}</option>
                </select>
            </div>

            <div class="form-control w-full max-w-lg">
                <label class="label">
                    <span class="label-text">{{ $t("Asr Calculation Method") }}</span>
                </label>
                <select @change="(e: any) => setAsrMethod(Number(e.target.value))" class="select select-bordered w-full ">
                    <option :selected="asrMethod == 0" value="0">{{ $t("Shafi") }}</option>
                    <option :selected="asrMethod == 1" value="1">{{ $t("Hanafi") }}</option>
                </select>
            </div>


            <div class="form-control w-full max-w-lg">
                <label class="label">
                    <span class="label-text">{{ $t("Days to add to calendar") }}</span>
                </label>
                <select @change="(e: any) => setDays(Number(e.target.value))" class="select select-bordered w-full ">
                    <option :selected="days == 7" value="7">{{ $t("Week") }}</option>
                    <option :selected="days == 30" value="30">{{ $t("Month") }}</option>
                </select>
            </div>

            <PrayersInput />

            <div class="flex flex-col gap-3 mt-4">
                <h3 class="font-bold text-xl">{{ $t("Preview") }}</h3>
                <div class="p-5 bg-white rounded ">
                    <FullCalendar :options="calendarOptions" />
                </div>
            </div>




        </div>

        <div class="card-actions justify-start">
            <button class="btn btn-primary mt-3" @click="getPrayersTimings">

                <PhosphorIconDownload :size="28" />
                {{ $t("Download Calendar") }}
            </button>
        </div>
    </AppCard>
</template>