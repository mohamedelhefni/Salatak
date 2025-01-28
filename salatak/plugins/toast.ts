// plugins/toast.js
export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            toast: {
                show(message: string, type = 'success') {
                    const event = new CustomEvent('show-toast', {
                        detail: { message, type },
                    });
                    window.dispatchEvent(event);
                },
            },
        }
    }
});