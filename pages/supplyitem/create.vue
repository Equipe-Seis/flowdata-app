<template>
  <v-container>
    <h1 class="text-h4 mb-4">{{ $t('supply.create_title') }}</h1>

    <v-alert v-if="erro" type="error" class="mb-5">{{ erro }}</v-alert>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field 
            v-model="payload.name" 
            :label="$t('supply.name')" 
            :rules="[v => !!v || $t('validation.required')]" 
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field 
            v-model="payload.code" 
            :label="$t('supply.code')" 
            :rules="[v => !!v || $t('validation.required')]" 
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field 
            v-model.number="payload.price" 
            :label="$t('supply.price')" 
            type="number" 
            :rules="[v => v >= 0 || $t('validation.gte_0')]" 
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field 
            v-model="payload.description" 
            :label="$t('supply.description')" 
            :rules="[v => !!v || $t('validation.required')]" 
            required
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end ga-4">
        <v-btn class="me-2" @click="router.back()">{{ $t('common.cancel') }}</v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="loading">{{ $t('common.create') }}</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplyItemCreate } from '~/composables/supplyitem/useSupplyItemCreate'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const router = useRouter()
const form = ref(null)
const valid = ref(false)
const erro = ref('')

const { payload, loading, error, submit } = useSupplyItemCreate()

async function onSubmit() {
  erro.value = ''
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  const ok = await submit()
  if (ok) {
    router.push('/supplyitem/supplyItem')
  } else {
    erro.value = error.value || $t('messages.error_creating')
  }
}
</script>

<style scoped>
</style>
