<template>
  <v-card class="pa-4 d-flex flex-wrap justify-center align-center" elevation="2">
    <v-avatar color="primary" size="48" class="me-4 mb-2 mb-sm-0">
      <v-icon icon="mdi-account-group" />
    </v-avatar>
    <div class="text-center">
      <div class="text-subtitle-1">{{ $t('dashboard.total_suppliers') }}</div>
      <div class="text-h5 font-weight-bold">{{ total }}</div>
    </div>
  </v-card>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSupplierSummary } from '~/composables/supplier/useSupplierSummary'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { total, load } = useSupplierSummary()

onMounted(() => {
  load()
})
</script>
