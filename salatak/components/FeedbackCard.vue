<script setup lang="ts">
const FEEDBACK_KEY = 'salatak-feedback-sent'
const ratings = ['😞', '🙁', '😐', '🙂', '😍']

const rating = ref(0)
const comment = ref('')
const sent = ref(false)

onMounted(() => {
  try { sent.value = localStorage.getItem(FEEDBACK_KEY) === 'true' } catch {}
})

const submit = () => {
  usePostHog().trackFeedback(rating.value, comment.value.trim())
  sent.value = true
  try { localStorage.setItem(FEEDBACK_KEY, 'true') } catch {}
}
</script>

<template>
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body p-4">
      <p v-if="sent" class="text-center font-medium">{{ $t("Thanks for your feedback!") }}</p>
      <template v-else>
        <h3 class="font-semibold">{{ $t("How was your experience?") }}</h3>
        <div class="flex justify-center gap-2">
          <button
            v-for="(emoji, i) in ratings"
            :key="i"
            type="button"
            :class="['btn btn-ghost text-2xl', { 'btn-active': rating === i + 1 }]"
            :aria-label="`${i + 1} / 5`"
            @click="rating = i + 1"
          >{{ emoji }}</button>
        </div>
        <template v-if="rating">
          <textarea v-model="comment" class="textarea textarea-bordered w-full" rows="2" maxlength="1000"
            :placeholder="$t('Tell us more (optional)')"></textarea>
          <button class="btn btn-primary btn-sm self-end" @click="submit">{{ $t("Send Feedback") }}</button>
        </template>
      </template>
    </div>
  </div>
</template>
