<template>
  <v-container>
    <h1 class="text-h4 mb-4">Edit Supplier</h1>

    <v-alert v-if="erro" type="error" class="mb-5">{{ erro }}</v-alert>
    <v-skeleton-loader v-if="loading" type="article" class="mb-4"></v-skeleton-loader>

    <v-form v-if="payload" ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="8">
          <v-text-field v-model="payload.person.name" label="* Name" :rules="[v => !!v || 'Required']" required />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select v-model="payload.person.personType" :items="['individual','legalentity']" label="* Person Type" :rules="[v => !!v || 'Required']" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="payload.person.documentNumber"
            label="* Document"
            :rules="[v => !!v || 'Required']"
            required
            v-mask="documentMask"
          >
            <template #append-inner>
              <v-btn
                v-if="canLookupCnpj"
                icon
                @click="onLookupCnpj"
                :loading="carregandoCnpj"
                color="primary"
                aria-label="Consultar CNPJ"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="payload.person.email" label="* Email" type="email" :rules="emailRules" required />
        </v-col>
      </v-row>

      <template v-if="payload.person.personType === 'individual'">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="payload.person.birthDate"
              label="* Birth date"
              :rules="birth_date_rule"
              v-mask="'##/##/####'"
              required
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="payload.person.personType === 'legalentity'">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="payload.tradeName" label="* Trade Name" :rules="[v => !!v || 'Required']" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="payload.openingDate"
              label="* Opening Date"
              v-mask="'##/##/####'"
              :rules="opening_date_rule"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.type" label="Type" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.size" label="Size" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.legalNature" label="Legal Nature" />
          </v-col>
        </v-row>
      </template>

      <h2 class="text-h6 mt-6">Contacts</h2>
      <v-divider class="mb-4"></v-divider>
      <SupplierContactsForm v-model="payload.contacts" />

      <h2 class="text-h6 mt-6">Addresses</h2>
      <v-divider class="mb-4"></v-divider>
      <SupplierAddressesForm v-model="payload.addresses" />

      <div class="d-flex justify-end ga-4">
        <v-btn class="me-2" @click="router.back()">Cancel</v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="loading">Save</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SupplierContactsForm from '~/components/supplier/SupplierContactsForm.vue'
import SupplierAddressesForm from '~/components/supplier/SupplierAddressesForm.vue'
import { useSupplierEdit } from '~/composables/supplier/useSupplierEdit'
import { useCnpj } from '~/composables/useCnpj'
import { useCep } from '~/composables/useCep'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const form = ref<any>(null)
const valid = ref(false)
const erro = ref('')

const { payload, loading, error, load, submit } = useSupplierEdit()
const { lookup: lookupCnpj } = useCnpj()
const { lookup: lookupCep } = useCep()

const emailRules = [
  (v: string) => (!v ? 'E-mail is required' : true),
  (v: string) => (!/.+@.+\..+/.test(v) ? 'E-mail is invalid' : true),
]
const birth_date_rule = [
  (v: string) => (!!v ? true : 'Birth date is required'),
  (v: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) ? true : 'Formato inválido (DD/MM/AAAA)')
]
const opening_date_rule = [
  (v: string) => (!!v ? true : 'Opening date is required'),
  (v: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) ? true : 'Formato inválido (DD/MM/AAAA)')
]
const documentMask = computed(() => (payload.value?.person?.personType === 'legalentity' ? '##.###.###/####-##' : '###.###.###-##'))
const carregandoCnpj = ref(false)
const canLookupCnpj = computed(() => {
  const personType = payload.value?.person?.personType
  if (personType !== 'legalentity') return false
  const clean = String(payload.value?.person?.documentNumber || '').replace(/\D/g, '')
  return /^\d{14}$/.test(clean)
})

onMounted(async () => {
  await load(String(route.params.id))
})

async function onSubmit() {
  erro.value = ''
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return

  const todayIso = new Date().toISOString().slice(0, 10)
  if (payload.value?.person?.personType === 'legalentity') {
    if (!payload.value.person.birthDate) {
      payload.value.person.birthDate = todayIso
    }
  }
  if (payload.value?.person?.personType === 'individual') {
    if (!payload.value.openingDate) {
      payload.value.openingDate = todayIso
    }
  }

  const toIso = (br?: string | null) => {
    if (!br) return null
    const parts = String(br).split('/')
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts
      return `${yyyy}-${mm}-${dd}`
    }
    return br
  }
  payload.value.person.birthDate = toIso(payload.value.person.birthDate)
  payload.value.openingDate = toIso(payload.value.openingDate)

  const ok = await submit(String(route.params.id))
  if (ok) {
    router.push(`/suppliers/${String(route.params.id)}`)
  } else {
    erro.value = error.value || 'Error updating supplier'
  }
}

async function onLookupCnpj() {
  if (payload.value?.person?.personType !== 'legalentity') {
    erro.value = 'Consulta de CNPJ disponível apenas para legalentity.'
    return
  }
  const clean = String(payload.value?.person?.documentNumber || '').replace(/\D/g, '')
  if (!/^\d{14}$/.test(clean)) {
    erro.value = 'CNPJ inválido. Deve conter 14 números.'
    return
  }
  carregandoCnpj.value = true
  erro.value = ''
  try {
    const data = await lookupCnpj(clean)
    if (!data || !payload.value) return
    payload.value.person.name = data.nome || payload.value.person.name
    payload.value.tradeName = data.fantasia || payload.value.tradeName
    payload.value.person.email = data.email || payload.value.person.email
    if (data.cep) {
      const onlyDigits = String(data.cep).replace(/\D/g, '')
      if (payload.value.addresses.length === 0) {
        payload.value.addresses.push({ street: '', district: '', city: '', state: '', postalCode: '', linkType: 'supplier' })
      }
      payload.value.addresses[0].postalCode = onlyDigits
      const cepData = await lookupCep(onlyDigits)
      if (cepData) {
        payload.value.addresses[0].street = cepData.logradouro || payload.value.addresses[0].street
        payload.value.addresses[0].district = cepData.bairro || payload.value.addresses[0].district
        payload.value.addresses[0].city = cepData.localidade || payload.value.addresses[0].city
        payload.value.addresses[0].state = cepData.uf || payload.value.addresses[0].state
      }
    }
  } finally {
    carregandoCnpj.value = false
  }
}
</script>

<style scoped>
</style>


