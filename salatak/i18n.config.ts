export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      salatak: "Salatak",
      'Fajr': 'Fajr',
      'Dhuhr': 'Dhuhr',
      'Asr': 'Asr',
      'Maghrib': 'Maghrib',
      'Isha': 'Isha'
    },
    ar: {
      welcome: 'اهلا',
      salatak: "صلاتك",
      'Fajr': 'الفجر',
      'Dhuhr': 'الضهر',
      'Asr': 'العصر',
      'Maghrib': 'المغرب',
      'Isha': 'العشاء'
    }
  }
}))
