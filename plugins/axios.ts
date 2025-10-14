import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { NuxtApp } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
  })

  nuxtApp.provide('axios', api)
})
