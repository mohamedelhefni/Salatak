<!-- components/Toast.vue -->
<template>
    <div v-if="visible" :class="toastClasses" role="alert"
        class="alert w-auto fixed bottom-4 right-4 flex items-center justify-between p-4 rounded-lg shadow-lg animate-slide-in z-10">
        <span>{{ message }}</span>
        <button @click="hideToast" class="btn btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('success'); // Default toast type

const toastClasses = computed(() => {
    return {
        'alert-success': type.value === 'success',
        'alert-error': type.value === 'error',
        'alert-warning': type.value === 'warning',
        'alert-info': type.value === 'info',
    };
});

const showToast = (msg, toastType = 'success') => {
    message.value = msg;
    type.value = toastType;
    visible.value = true;
    setTimeout(() => {
        visible.value = false;
    }, 4000);
};

const hideToast = () => {
    visible.value = false;
};

// Listen for the custom event
const handleToastEvent = (event) => {
    const { message, type } = event.detail;
    showToast(message, type);
};

onMounted(() => {
    window.addEventListener('show-toast', handleToastEvent);
});

onUnmounted(() => {
    window.removeEventListener('show-toast', handleToastEvent);
});
</script>

<style>
/* Define the slide-in animation */
@keyframes slide-in {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slide-in 0.1s ease-out;
}
</style>