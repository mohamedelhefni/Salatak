<template>
    <div>
        <div>
            <label for="start-date">Start Date:</label>
            <input type="month" id="start-date" :value="startDateInput" @change="updateStartDate" />
        </div>
        <div>
            <label for="end-date">End Date:</label>
            <input type="month" id="end-date" :value="endDateInput" @change="updateEndDate" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePrayersStore } from '~/stores/prayersStore';
import { storeToRefs } from 'pinia';

const prayersStore = usePrayersStore();
const { startDate, endDate } = storeToRefs(prayersStore);
const { setStartDate, setEndDate } = prayersStore;

const startDateInput = computed(() => new Date(startDate.value).toISOString().slice(0, 7));
const endDateInput = computed(() => new Date(endDate.value).toISOString().slice(0, 7));

const updateStartDate = (event) => {
    const date = new Date(event.target.value + "-01"); // Add "-01" to make it a valid date
    setStartDate(date);
};

// Update end date in the store
const updateEndDate = (event) => {
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

<style scoped>
div {
    margin-bottom: 1rem;
}

label {
    margin-right: 0.5rem;
}

input[type="month"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>