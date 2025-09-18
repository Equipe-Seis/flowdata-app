<template>
  <v-container>
    <h1 class="text-h4 mb-4">Create Supply Item</h1>

    <v-alert v-if="erro" type="error" class="mb-5">{{ erro }}</v-alert>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="payload.name" label="* Name" :rules="[v => !!v || 'Required']" required />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="payload.code" label="* Code" :rules="[v => !!v || 'Required']" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model.number="payload.price" label="* Price" type="number" :rules="[v => v >= 0 || '>= 0']" required />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="payload.description" label="* Description" :rules="[v => !!v || 'Required']" required />
        </v-col>
      </v-row>

      <div class="d-flex justify-end ga-4">
        <v-btn class="me-2" @click="router.back()">Cancel</v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="loading">Create</v-btn>
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
    erro.value = error.value || 'Error creating supply item'
  }
}
</script>

<style scoped>
</style>



