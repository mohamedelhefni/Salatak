<script setup lang="ts">

</script>

<template>
    <AppCard>
        <h2 class="card-title">{{ $t("salatak") }}</h2>
        <p>{{ $t("Schedual prayer times on your google calendar now") }}</p>
        <div class="card-actions justify-start">
            <button class="btn btn-primary mt-3">
                {{ $t("login with google") }}
                <PhosphorIconGoogleLogo :size="28" />
            </button>
        </div>
    </AppCard>
</template>