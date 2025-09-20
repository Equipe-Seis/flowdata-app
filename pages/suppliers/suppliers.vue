<template>
  <v-container :key="locale">
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-2">{{ t('supplier.page_title') }}</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToCreate">{{ t('supplier.new') }}</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>{{ t('supplier.filters') }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                hide-details
                :label="t('supplier.search_placeholder')"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-end ga-4 mt-4">
            <v-btn color="primary" @click.prevent="applyFilters">{{ t('common.search') }}</v-btn>
            <v-btn class="me-2" @click.prevent="clearFilters">{{ t('common.clear') }}</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <v-data-table-server
          v-if="!mdAndDown"
          :key="locale"
          :headers="headers"
          :items="filteredSuppliers"
          :items-length="total"
          :loading="loading"
          :items-per-page-options="[5, 10, 25, 50, 100]"
          @update:options="loadSuppliers"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.tradeName }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.documentNumber }}</td>
              <td>
                <v-chip :color="item.status === 'active' ? 'green' : 'grey'" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </td>
              <td class="d-flex ga-2">
                <v-btn size="small" color="primary" icon="mdi-eye" @click="viewSupplier(item.id)" />
                <v-btn size="small" color="secondary" icon="mdi-file-document-edit-outline" @click="editSupplier(item.id)" />
                <v-btn size="small" color="error" icon="mdi-delete" @click="deleteSupplier(item.id)" />
              </td>
            </tr>
          </template>
          <template #no-data>
            {{ t('supplier.no_results') }}
          </template>
        </v-data-table-server>

        <div v-else>
          <div
            v-for="item in filteredSuppliers"
            :key="item.id"
            class="pa-2 my-2 border rounded"
          >
            <div><strong>{{ t('supplier.id') }}:</strong> {{ item.id }}</div>
            <div><strong>{{ t('supplier.name') }}:</strong> {{ item.name }}</div>
            <div><strong>{{ t('supplier.trade_name') }}:</strong> {{ item.tradeName }}</div>
            <div><strong>{{ t('supplier.email') }}:</strong> {{ item.email }}</div>
            <div><strong>{{ t('supplier.document') }}:</strong> {{ item.documentNumber }}</div>
            <div><strong>{{ t('supplier.status') }}:</strong> {{ item.status }}</div>
            <div class="mt-2 d-flex ga-2">
              <v-btn size="small" color="primary" icon="mdi-eye" @click="viewSupplier(item.id)" />
              <v-btn size="small" color="secondary" icon="mdi-file-document-edit-outline" @click="editSupplier(item.id)" />
              <v-btn size="small" color="error" icon="mdi-delete" @click="deleteSupplier(item.id)" />
            </div>
          </div>
          <v-pagination
            v-model="page"
            :length="Math.ceil(total / limit)"
            :total-visible="5"
            @update:modelValue="loadSuppliers"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSuppliers } from '~/composables/supplier/useSuppliers'
import { useSupplier } from '~/composables/supplier/useSupplier'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const { mdAndDown } = useDisplay() 

const { list, total, loading, load } = useSuppliers()
const suppliers = list

const page = ref(Number(route.query.page || 1))
const limit = ref(Number(route.query.limit || 10))
const search = ref(route.query.search || '')

const headers = ref([])
watch(locale, () => {
  headers.value = markRaw([
    { title: t('supplier.id'), key: 'id' },
    { title: t('supplier.name'), key: 'name' },
    { title: t('supplier.trade_name'), key: 'tradeName' },
    { title: t('supplier.email'), key: 'email' },
    { title: t('supplier.document'), key: 'documentNumber' },
    { title: t('supplier.status'), key: 'status' },
    { title: t('supplier.actions'), key: 'actions', sortable: false },
  ])
}, { immediate: true })

const filteredSuppliers = computed(() => {
  const query = search.value.toLowerCase().trim()
  if (!query) return suppliers.value || []
  return (suppliers.value || []).filter(item => {
    return (
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.documentNumber?.toLowerCase().includes(query)
    )
  })
})

onMounted(() => {
  loadSuppliers()
})

function applyFilters() {
  page.value = 1
  loadSuppliers()
}

function clearFilters() {
  search.value = ''
  page.value = 1
  loadSuppliers()
}



async function loadSuppliers(options = {}) {
  const query = {
    page: options.page || page.value,
    limit: options.itemsPerPage || limit.value,
    search: search.value
  }
  await load(query)

  router.replace({ query })
}

function goToCreate() {
  router.push('/suppliers/create')
}

function viewSupplier(id) {
  router.push(`/suppliers/${id}`)
}

function editSupplier(id) {
  router.push(`/suppliers/${id}/edit`)
}

async function deleteSupplier(id) {
  if (!confirm('Excluir supplier?')) return
  const { remove } = useSupplier()
  const ok = await remove(String(id))
  if (ok) loadSuppliers()
}
</script>

<style scoped>
.border {
  border: 1px solid #ccc;
}
</style>
