// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
    buildModules: [
        'nuxt-vite'
    ],
  devtools: {
      enabled: true
  },
  modules: [
      'usebootstrap',
      '@pinia/nuxt'
  ]
});