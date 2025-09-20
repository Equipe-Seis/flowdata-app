<template>
    <v-container :key="locale">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4">{{ t('user.edit_title') }}</h1>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end">
          <v-btn color="secondary" @click="goBack">
            {{ t('common.back') }}
          </v-btn>
        </v-col>
      </v-row>
  
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  :label="t('user.name')"
                  :rules="[rules.required]"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  :label="t('user.email')"
                  type="email"
                  :rules="[rules.required]"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.documentNumber"
                  :label="t('user.document')"
                  :rules="[rules.required]"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.birthDate"
                  :label="t('user.birth_date')"
                  type="date"
                  :rules="[rules.required]"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.status"
                  :label="t('user.status')"
                  :items="statuses"
                  item-value="value"
                  item-title="text"
                  :rules="[rules.required]"
                />
              </v-col>
  
              <v-col cols="12" md="6">
                <v-select
  v-model="form.profiles"
  :label="t('user.profile')"
  :items="profileItems"
  :item-title="(item) => t(`profile.${item.name}`)"
  item-value="id"
  :rules="[rules.required]"
/>
              </v-col>
            </v-row>
  
            <div class="d-flex justify-end mt-4">
              <v-btn color="primary" type="submit" :loading="loading">
                {{ t('common.save') }}
              </v-btn>
            </div>
          </v-form>
  
          <v-alert
            v-if="error"
            type="error"
            class="mt-4"
            border="start"
          >
            {{ error }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useUserEdit } from '~/composables/users/useUsersEdit'
  import { useProfiles } from '~/composables/users/useProfiles'
  
  definePageMeta({
    layout: 'default',
    middleware: 'auth',
  })
  
  const route = useRoute()
  const router = useRouter()
  const { t, locale } = useI18n()
  
  const { payload: form, load, submit, loading, error } = useUserEdit()
  const { list: profileList, load: loadProfiles } = useProfiles()
  
    import { markRaw, watch, Ref } from 'vue'

    type StatusItem = { text: string; value: string }

    const statuses = ref<StatusItem[]>([])

    watch(locale, () => {
      statuses.value = markRaw([
        { text: t('common.active'), value: 'individual' },
        { text: t('common.inactive'), value: 'inactive' }
      ])
    }, { immediate: true })
  
  const profileItems = computed(() => profileList.value || [])
  
  const rules = {
    required: (v: any) => !!v || t('validation.required'),
  }
  
  onMounted(async () => {
    const id = route.params.id as string
    await Promise.all([load(id), loadProfiles()])
  })
  
  const submitForm = async () => {
  if (!Array.isArray(form.value.profiles)) {
    form.value.profiles = [form.value.profiles]
  }

  const success = await submit(form.value.id)

  if (success) {
    router.push('/users/users') // ajuste esse path se estiver errado
  }
}
  
  const goBack = () => {
    router.push('/users/users')
  }
  </script>
  