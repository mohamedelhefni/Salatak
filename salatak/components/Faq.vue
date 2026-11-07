<script setup lang="ts">
const { locale } = useI18n()

const faqs = {
  en: [
    ['What is Salatak?', 'Salatak is a free web app that puts the five daily prayer times for your location into your calendar, with optional reminders before each prayer.'],
    ['Which calendars does it work with?', 'Any calendar that supports the iCalendar (.ics) standard, including Google Calendar, Apple Calendar on iPhone and Mac, and Microsoft Outlook. You can download a file or subscribe with a link.'],
    ['How accurate are the prayer times?', 'Times are calculated for your exact coordinates using the AlAdhan API. You choose the calculation method (Egyptian General Authority, Muslim World League, Umm al-Qura and others) and the Asr school (Shafi or Hanafi).'],
    ['Can I add reminders and Jumu\'ah?', 'Yes. Set a reminder of up to 60 minutes before each prayer, adjust each prayer\'s duration and offset, and add Jumu\'ah on Fridays.'],
    ['Is Salatak free?', 'Yes. Salatak is free and open source, with no account required.'],
  ],
  ar: [
    ['ما هو صلاتك؟', 'صلاتك تطبيق ويب مجاني يضيف مواقيت الصلوات الخمس لموقعك إلى تقويمك، مع تنبيه اختياري قبل كل صلاة.'],
    ['مع أي تقويم يعمل؟', 'مع أي تقويم يدعم معيار iCalendar ‏(.ics)، ومنها تقويم Google وتقويم Apple على الآيفون والماك وMicrosoft Outlook. يمكنك تنزيل ملف أو الاشتراك برابط.'],
    ['ما مدى دقة المواقيت؟', 'تُحسب المواقيت لإحداثيات موقعك بدقة عبر AlAdhan API. تختار طريقة الحساب (الهيئة المصرية العامة للمساحة، رابطة العالم الإسلامي، أم القرى وغيرها) ومذهب العصر (الشافعي أو الحنفي).'],
    ['هل يمكن إضافة تنبيهات وصلاة الجمعة؟', 'نعم. اضبط تنبيهًا حتى ٦٠ دقيقة قبل كل صلاة، وعدّل مدة كل صلاة وإزاحتها، وأضف صلاة الجمعة.'],
    ['هل صلاتك مجاني؟', 'نعم، صلاتك مجاني ومفتوح المصدر ولا يحتاج إلى حساب.'],
  ],
}

const items = computed(() => faqs[locale.value === 'ar' ? 'ar' : 'en'])

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.value.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    }),
  }],
})
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 pb-12" aria-labelledby="faq-title">
    <h2 id="faq-title" class="mb-4 text-xl font-medium">{{ locale === 'ar' ? 'أسئلة شائعة' : 'Frequently asked questions' }}</h2>
    <div class="divide-y divide-default rounded-xl border border-default">
      <details v-for="[q, a] in items" :key="q" class="group p-4">
        <summary class="cursor-pointer list-none font-medium">{{ q }}</summary>
        <p class="mt-2 text-muted">{{ a }}</p>
      </details>
    </div>
  </section>
</template>
