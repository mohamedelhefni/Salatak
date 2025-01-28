<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
import { storeToRefs } from 'pinia';

const prayersStore = usePrayersStore();
const { startDate, endDate } = storeToRefs(prayersStore);
const { setStartDate, setEndDate } = prayersStore;

const startDateInput = computed(() => new Date(startDate.value).toISOString().slice(0, 7));
const endDateInput = computed(() => new Date(endDate.value).toISOString().slice(0, 7));

const updateStartDate = (event: any) => {
    const date = new Date(event.target.value + "-01"); // Add "-01" to make it a valid date
    setStartDate(date);
};

const updateEndDate = (event: any) => {
    const date = new Date(event.target.value + "-01"); // Add "-01" to make it a valid date
    let sd = new Date(startDate.value)
    if (date < sd) {
        alert("End date should be greater than or equal to the start date");
        setEndDate(new Date());
        return;
    }
    setEndDate(date);
};
</script>

<template>
    <div class="flex items-center justify-start flex-wrap  gap-4">
        <div class="form-control w-full max-w-lg">
            <label for="start-date" class="label">
                <span class="label-text"> {{ $t("start_date") }} </span>
            </label>
            <input type="month" class="input" id="start-date" :value="startDateInput" @change="updateStartDate" />
        </div>
        <div class="form-control w-full max-w-lg">
            <label for="end-date" class="label">
                <span class="label-text"> {{ $t("end_date")  }} </span>
            </label>
            <input type="month" class="input" id="end-date" :value="endDateInput" @change="updateEndDate" />
        </div>
    </div>
</template>