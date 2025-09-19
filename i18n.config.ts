import defineI18nConfig  from '@nuxtjs/i18n'

export default defineI18nConfig((_nuxtApp, _nuxtConfig) => ({
  legacy: false,
  globalInjection: true,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  availableLocales: ['pt-BR', 'en']
}))


