<template>
    <v-container :key="locale">
      <h1 class="text-h4 mb-6 mt-4">{{ t('user.create_title') }}</h1>
  
      <v-form @submit.prevent="submit" ref="formRef" validate-on="submit" :disabled="loading">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.person.name"
              :label="t('user.name')"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.person.email"
              :label="t('user.email')"
              :rules="[rules.required, rules.email]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.person.documentNumber"
              :label="t('user.document')"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.person.birthDate"
              :label="t('user.birth_date')"
              type="date"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedProfile"
              :items="profileOptions"
              item-value="id"
              :item-title="(item) => t(item.name)"
              :label="t('user.profile')"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.password"
              :label="t('user.password')"
              type="password"
              :rules="[rules.required, rules.min(6)]"
              variant="outlined"
            />
          </v-col>
  
          <v-col cols="12" class="d-flex justify-end ga-4">
            <v-btn color="secondary" @click="cancel">{{ t('common.cancel') }}</v-btn>
            <v-btn color="primary" type="submit" :loading="loading">{{ t('common.save') }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useUser } from '~/composables/users/useUsersCreate'
  import { fetchProfiles } from '~/services/users/profileService'
  import type { CreateUserPayload } from '~/models/user/User'
  
  definePageMeta({
    layout: 'default',
    middleware: 'auth',
  })
  
  const { t, locale } = useI18n()
  const router = useRouter()
  
  const formRef = ref()
  const selectedProfile = ref<number | null>(null)
  const profileOptions = ref<{ id: number; name: string }[]>([])
  
  const { create, loading } = useUser()
  
  const form = reactive<CreateUserPayload>({
    person: {
      name: '',
      personType: 'individual',
      documentNumber: '',
      birthDate: '',
      status: 'active',
      email: '',
    },
    password: '',
    profiles: [],
  })
  
  const rules = {
    required: (v: any) => !!v || t('validation.required'),
    email: (v: any) => /.+@.+\..+/.test(v) || t('validation.invalid_email'),
    min: (min: number) => (v: string) => (v?.length >= min) || t('validation.min_length', { min }),
  }
  
  onMounted(async () => {
    try {
      const profiles = await fetchProfiles()
      profileOptions.value = profiles
    } catch (e) {
      console.error('Erro ao buscar perfis', e)
    }
  })
  
  async function submit() {
    const isValid = await formRef.value?.validate()
    if (!isValid.valid) return
  
    if (selectedProfile.value) {
      form.profiles = [selectedProfile.value]
    }
  
    const result = await create(form)
  
    if (result) {
      router.push('/users/users')
    }
  }
  
  function cancel() {
    router.push('/users/users')
  }
  </script>
  