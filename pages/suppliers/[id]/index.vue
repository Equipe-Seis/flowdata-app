<template>
  <v-container>
    <h1 class="text-h4 mb-2">{{ t('supplier.detail_title') }}</h1>
    <div class="d-flex justify-end ga-2 mb-4">
      <v-btn variant="text" @click="goBack">{{ t('common.back') }}</v-btn>
      <v-btn color="primary" @click="goToCreate">{{ t('supplier.new') }}</v-btn>
      <v-btn color="secondary" @click="goToEdit">{{ t('common.edit') }}</v-btn>
      <v-btn color="error" @click="confirmDelete">{{ t('common.delete') }}</v-btn>
    </div>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>

    <div v-else-if="supplier">
      <v-card class="mb-4">
        <v-card-title>{{ t('supplier.person_section') }}</v-card-title>
        <v-card-text>
          <div><strong>{{ t('supplier.name') }}:</strong> {{ supplier.person.name }}</div>
          <div><strong>{{ t('supplier.person_type') }}:</strong> {{ supplier.person.personType }}</div>
          <div><strong>{{ t('supplier.document') }}:</strong> {{ supplier.person.documentNumber }}</div>
          <div v-if="supplier.person.birthDate"><strong>{{ t('supplier.birth_date') }}:</strong> {{ formatDate(supplier.person.birthDate) }}</div>
          <div><strong>{{ t('supplier.email') }}:</strong> {{ supplier.person.email }}</div>
          <div><strong>{{ t('supplier.status') }}:</strong> {{ supplier.person.status }}</div>
        </v-card-text>
      </v-card>

      <v-card
        v-if="supplier.tradeName || supplier.openingDate || supplier.type || supplier.size || supplier.legalNature"
        class="mb-4"
      >
        <v-card-title>{{ t('supplier.company_section') }}</v-card-title>
        <v-card-text>
          <div v-if="supplier.tradeName"><strong>{{ t('supplier.trade_name') }}:</strong> {{ supplier.tradeName }}</div>
          <div v-if="supplier.openingDate"><strong>{{ t('supplier.opening_date') }}:</strong> {{ formatDate(supplier.openingDate) }}</div>
          <div v-if="supplier.type"><strong>{{ t('supplier.type') }}:</strong> {{ supplier.type }}</div>
          <div v-if="supplier.size"><strong>{{ t('supplier.size') }}:</strong> {{ supplier.size }}</div>
          <div v-if="supplier.legalNature"><strong>{{ t('supplier.legal_nature') }}:</strong> {{ supplier.legalNature }}</div>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>{{ t('supplier.contacts') }}</v-card-title>
        <v-card-text>
          <div v-if="!(supplier.contacts && supplier.contacts.length)">{{ t('supplier.no_contacts') }}</div>
          <v-list v-else density="compact">
            <v-list-item v-for="c in supplier.contacts" :key="c.id">
              <v-list-item-title>{{ c.type }} - {{ c.value }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ c.note }} <span v-if="c.primary">• {{ t('supplier.primary') }}</span> • {{ c.linkType }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>{{ t('supplier.addresses') }}</v-card-title>
        <v-card-text>
          <div v-if="!(supplier.addresses && supplier.addresses.length)">{{ t('supplier.no_addresses') }}</div>
          <v-list v-else density="compact">
            <v-list-item v-for="a in supplier.addresses" :key="a.id">
              <v-list-item-title>{{ a.street }}, {{ a.district }} - {{ a.city }}/{{ a.state }}</v-list-item-title>
              <v-list-item-subtitle>{{ a.postalCode }} • {{ a.linkType }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupplier } from '~/composables/supplier/useSupplier'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { supplier, loading, error, load } = useSupplier()

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

onMounted(() => {
  if (route.params.id) load(String(route.params.id))
})

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toISOString().slice(0, 10)
  } catch {
    return iso
  }
}

function goBack() {
  router.back()
}

function goToCreate() {
  router.push('/suppliers/create')
}

function goToEdit() {
  router.push({ name: 'suppliers-id-edit', params: { id: String(route.params.id) } })
}

async function confirmDelete() {
  if (!confirm('Excluir este supplier?')) return
  const { remove } = useSupplier()
  const ok = await remove(String(route.params.id))
  if (ok) router.push('/suppliers/suppliers')
}
</script>

<style scoped>
</style>


