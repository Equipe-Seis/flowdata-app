<template>
  <v-container>
    <h1 class="text-h4 mb-4">{{ $t('supply.edit_supply_item') }}</h1>

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
            :rules="[v => v >= 0 || $t('validation.min_value', { min: 0 })]"
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
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="loading">{{ $t('common.update') }}</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupplyItemEdit } from '~/composables/supplyitem/useSupplyItemEdit'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref(null)
const valid = ref(false)
const erro = ref('')

const { payload, loading, error, load, submit } = useSupplyItemEdit()

onMounted(() => {
  load(id)
})

async function onSubmit() {
  erro.value = ''
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  const ok = await submit(id)
  if (ok) {
    router.push('/supplyitem/supplyItem') // ou a listagem correta
  } else {
    erro.value = error.value || $t('messages.error_updating')
  }
}
</script>

<style scoped>
</style>
