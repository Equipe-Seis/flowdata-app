<template>
    <v-container :key="locale">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4">{{ t('user.view_title') }}</h1>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-btn color="secondary" @click="goBack">
            {{ t('common.back') }}
          </v-btn>
        </v-col>
      </v-row>
  
      <v-card v-if="user">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <strong>{{ t('user.name') }}:</strong> {{ user.person.name }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>{{ t('user.email') }}:</strong> {{ user.person.email }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>{{ t('user.document') }}:</strong> {{ user.person.documentNumber }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>{{ t('user.birth_date') }}:</strong>
              {{ formatDate(user.person.birthDate) }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>{{ t('user.status') }}:</strong>
              <v-chip
                :color="user.person.status === 'active' ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                {{ user.person.status }}
              </v-chip>
            </v-col>
          </v-row>
  
          <v-divider class="my-4" />
  
          <h2 class="text-h6">{{ t('user.profile') }}</h2>
          <v-list density="compact" lines="one">
            <v-list-item
              v-for="profile in user.userProfiles"
              :key="profile.id"
              :title="profile.name"
              :subtitle="profile.description"
            >
              <template #append>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-shield-account-outline" />
                  </template>
                  <span>{{ t('user.permissions_count', { count: profile.permissions?.length || 0 }) }}</span>
                </v-tooltip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
  
      <v-skeleton-loader v-else type="card" />
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useUser } from '~/composables/users/useUsersView'
  import { format } from 'date-fns'
  
  definePageMeta({
    layout: 'default',
    middleware: 'auth',
  })
  
  const { t, locale } = useI18n()
  const route = useRoute()
  const router = useRouter()
  
  const { getById, selected: user } = useUser()
  
  onMounted(() => {
    const id = route.params.id
    if (id) getById(id as string)
  })
  
  function goBack() {
    router.push('/users/users')
  }
  
  function formatDate(date: string) {
    return format(new Date(date), 'dd/MM/yyyy')
  }
  </script>
<style scoped>
</style>
  