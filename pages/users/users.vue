<template>
    <v-container :key="locale">
    
      <v-row>
        <v-col>
          <div class="mt-10">
            <h1 class="text-h4 mb-2">{{ t('user.page_title') }}</h1>
          </div>
        </v-col>
        <v-col>
          <div class="d-flex justify-end ga-4 mt-10">
            <v-btn color="primary" @click="goToCreate">{{ t('user.new') }}</v-btn>
          </div>
        </v-col>
      </v-row>
  
      <v-card>
        <v-card-title>{{ t('user.filters') }}</v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  hide-details
                  :label="t('user.search_placeholder')"
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
          <v-data-table
            v-if="!mdAndDown"
            :key="locale"
            :headers="headers"
            :items="filteredUsers"
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
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td class="d-flex ga-2">
                  <v-btn size="small" color="primary" icon="mdi-eye" @click="viewUser(item.id)" />
                  <v-btn size="small" color="secondary" icon="mdi-file-document-edit-outline" @click="editUser(item.id)" />
                  <v-btn size="small" color="error" icon="mdi-delete" @click="deleteUser(item.id)" />
                </td>
              </tr>
            </template>
  
            <template #no-data>
              {{ t('user.no_results') }}
            </template>
          </v-data-table>
  
          <!-- Mobile layout -->
          <div v-else>
            <div
              v-for="item in filteredUsers"
              :key="item.id"
              class="pa-2 my-2 border rounded"
            >
              <div><strong>{{ t('user.id') }}:</strong> {{ item.id }}</div>
              <div><strong>{{ t('user.name') }}:</strong> {{ item.name }}</div>
              <div><strong>{{ t('user.email') }}:</strong> {{ item.email }}</div>
              <div class="mt-2 d-flex ga-2">
                <v-btn size="small" color="primary" icon="mdi-eye" @click="viewUser(item.id)" />
                <v-btn size="small" color="secondary" icon="mdi-file-document-edit-outline" @click="editUser(item.id)" />
                <v-btn size="small" color="error" icon="mdi-delete" @click="deleteUser(item.id)" />
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch, markRaw } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useUsers } from '~/composables/users/useUsers'
  import { useI18n } from 'vue-i18n'
  import { useDisplay } from 'vuetify'
  
  definePageMeta({
    layout: 'default',
    middleware: 'auth',
  })
  
  const { t, locale } = useI18n()
  const { mdAndDown } = useDisplay()
  const router = useRouter()
  const route = useRoute()
  
  
  const { users, total, loading, page, limit, loadUsers } = useUsers()
  
  const search = ref('')
  
 
  const headers = ref([])
  watch(locale, () => {
    headers.value = markRaw([
      { title: t('user.id'), key: 'id' },
      { title: t('user.name'), key: 'name' },
      { title: t('user.email'), key: 'email' },
      { title: t('user.actions'), key: 'actions', sortable: false },
    ])
  }, { immediate: true })
  

  const toLowerSafe = (v: unknown) => String(v ?? '').toLowerCase()

  const filteredUsers = computed(() => {
    const query = toLowerSafe(search.value).trim()
    if (!query) return users.value || []

    return (users.value || []).filter((user: any) =>
      toLowerSafe(user?.name).includes(query) ||
      toLowerSafe(user?.email).includes(query)
    )
  })
  

  onMounted(() => {
    loadUsers()
  })
  

  function applyFilters() {
    page.value = 1
    loadUsers()
  }
  
  function clearFilters() {
    search.value = ''
    applyFilters()
  }
  
  function onPageChange(p: number) {
    page.value = p
    loadUsers()
  }
  
  function onLimitChange(l: number) {
    limit.value = l < 1 ? 10 : l
    page.value = 1
    loadUsers()
  }
  
  function goToCreate() {
    router.push('/users/create')
  }
  
  function viewUser(id: number) {
    router.push(`/users/${id}`)
  }
  
  function editUser(id: number) {
    router.push(`/users/${id}/edit`)
  }
  
  function deleteUser(id: number) {
    if (confirm(t('user.confirm_delete'))) {
      //console.log('Excluir usuário', id)
      
    }
  }
  </script>
  
  <style scoped>
  .border {
    border: 1px solid #ccc;
  }
  </style>
  