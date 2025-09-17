// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  devServer: {
    port: 3001
  },

  build: {
    transpile: ["vuetify"],
  },

  css: [
    "vuetify/styles",           // necessário para Vuetify
    "~/assets/main.css"
  ],

  modules: [
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Noto+Sans": {
            wght: "100..900",
            ital: "100..900",
          },
        },
      },
    ],
  ],

  vite: {
    plugins: [
      vuetify({ autoImport: true })  // ✅ maneira correta de adicionar o plugin
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    define: {
      // workarounds para crypto (em alguns casos)
      'crypto.hash': 'undefined',
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify'
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  }
})
