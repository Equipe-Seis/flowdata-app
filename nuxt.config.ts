import { defineNuxtConfig } from "nuxt/config";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  devServer: {
    port: 3001,
  },

  build: {
    transpile: ["vuetify"],
  },

  css: ["vuetify/styles", "~/assets/main.css"],

  modules: [
    "@nuxtjs/i18n",
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

  i18n: {
    langDir: 'locales', // pasta onde estão os arquivos JSON
    defaultLocale: 'pt-BR',
    strategy: 'no_prefix', // ou 'prefix_except_default' se quiser /en/ na URL
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'pt-BR'
    },
    locales: [
      {
        code: 'pt-BR',
        file: 'pt-BR.json',
        name: 'Português'
      },
      {
        code: 'en',
        file: 'en.json',
        name: 'English'
      }
    ]
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    define: {
      'crypto.hash': 'undefined',
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
    },
  },
});
