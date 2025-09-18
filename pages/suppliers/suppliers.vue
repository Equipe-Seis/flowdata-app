<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Suppliers</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToCreate"> New Supplier </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>Filters</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="search"
                hide-details
                label="Search by name, email, document"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="status"
                hide-details
                clearable
                label="Status"
                :items="['active', 'inactive']"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          <div class="d-flex justify-start ga-4">
            <v-btn color="primary" @click.prevent="applyFilters">Search</v-btn>
            <v-btn class="me-2" @click.prevent="clearFilters">Clear</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="suppliers || []"
          v-model:page="page"
          v-model:items-per-page="limit"
          :items-length="total"
          :items-per-page-options="[5, 10, 25, 50, 100]"
          class="elevation-1"
          :loading="loading"
          @update:page="onPageChange"
          @update:items-per-page="onLimitChange"
        >
          <template #item="{ item }">
            <tr class="d-none d-md-table-row">
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
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-eye"
                  @click="viewSupplier(item.id)"
                  title="View Supplier"
                ></v-btn>
                <v-btn
                  size="small"
                  color="secondary"
                  icon="mdi-file-document-edit-outline"
                  @click="editSupplier(item.id)"
                  title="Edit Supplier"
                ></v-btn>
                <v-btn
                  size="small"
                  color="error"
                  icon="mdi-delete"
                  @click="deleteSupplier(item.id)"
                  title="Delete Supplier"
                ></v-btn>
              </td>
            </tr>

            <div class="d-md-none pa-2 my-2 border rounded">
              <div><strong>ID:</strong> {{ item.id }}</div>
              <div><strong>Name:</strong> {{ item.name }}</div>
              <div><strong>Trade Name:</strong> {{ item.tradeName }}</div>
              <div><strong>Email:</strong> {{ item.email }}</div>
              <div><strong>Document:</strong> {{ item.documentNumber }}</div>
              <div><strong>Status:</strong> {{ item.status }}</div>
              <div class="mt-2">
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  @click="editSupplier(item.id)"
                  title="Edit Supplier"
                ></v-btn>
              </div>
            </div>
          </template>

          <template #no-data> No suppliers found. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSuppliers } from '~/composables/supplier/useSuppliers'
import { useSupplier } from '~/composables/supplier/useSupplier'

const router = useRouter()
const route = useRoute()

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { list, total, loading, error, load } = useSuppliers()
const suppliers = list

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Trade Name', key: 'tradeName' },
  { title: 'Email', key: 'email' },
  { title: 'Document', key: 'documentNumber' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const search = ref(route.query.search || '')
const status = ref(route.query.status || '')
const page = ref(Number(route.query.page || 1))
const initialLimit = Number(route.query.limit || 10)
const limit = ref(!Number.isFinite(initialLimit) || initialLimit < 1 ? 10 : initialLimit)

onMounted(() => {
  applyFilters(true)
})

function applyFilters(initial = false) {
  const query = {
    search: search.value || undefined,
    status: status.value || undefined,
    page: page.value || 1,
    limit: limit.value || 10,
  }
  if (!initial) {
    router.push({ query })
  }
  load(query)
}

function clearFilters() {
  search.value = ''
  status.value = ''
  page.value = 1
  router.push({ query: {} })
  load({ page: 1, limit: limit.value })
}

function goToCreate() {
    router.push('/suppliers/create');
}

function viewSupplier(id) {
  router.push({ path: `/suppliers/${id}` })
}

function editSupplier(id) {
  router.push({ path: `/suppliers/${String(id)}/edit` })
}
async function deleteSupplier(id) {
  if (!confirm('Excluir supplier?')) return
  const { remove } = useSupplier()
  const ok = await remove(String(id))
  if (ok) applyFilters(true)
}

function onPageChange(p) {
  page.value = p
  applyFilters()
}

function onLimitChange(l) {
  limit.value = l < 1 ? 10 : l
  page.value = 1
  applyFilters()
}
</script>

<style scoped>
.v-data-table .d-md-none {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.v-data-table .v-data-table__td {
  vertical-align: middle;
}
</style>


