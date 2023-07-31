<script setup lang="ts">

let prayers = [
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
]

</script>


<template>
    <div class="flex flex-col gap-3 ml-1 my-5">
        <h3 class="font-bold text-xl">{{ $t("Prayers") }}</h3>

        <div class="overflow-x-auto">
            <table class="table">
                <!-- head -->
                <thead>
                    <tr>
                        <th>
                        </th>
                        <th>{{ $t("Prayer") }}</th>
                        <th>{{ $t("Duration") }}</th>
                        <th>{{ $t("Remainder") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="" v-for="prayer in prayers" :key="prayer.name">
                        <th>
                            <label>
                                <input type="checkbox" class="checkbox" :checked="prayer.checked" />
                            </label>
                        </th>
                        <td>
                            {{ $t(prayer.name) }}
                        </td>
                        <td>
                            <input type="number" class="input w-20" :value="prayer.duration">
                        </td>
                        <td>
                            <input type="number" class="input w-20" :value="prayer.remainder">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>