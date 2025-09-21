<template>
  <v-container :key="locale">
    <h1 class="text-h4 mb-4">{{ t('supplier.edit') }}</h1>

    <v-alert v-if="erro" type="error" class="mb-5">{{ erro }}</v-alert>
    <v-skeleton-loader v-if="loading" type="article" class="mb-4"></v-skeleton-loader>

    <v-form v-if="payload" ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="payload.person.name"
            :label="`* ${t('supplier.name')}`"
            :rules="[v => !!v || t('validation.required')]"
            required
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="payload.person.personType"
            :items="personTypeItems"
            item-title="text"
            item-value="value"
            :label="`* ${t('supplier.person_type')}`"
            :rules="[v => !!v || t('validation.required')]"
            required
          />
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
          <v-text-field
            v-model="payload.person.email"
            :label="`* ${t('supplier.email')}`"
            type="email"
            :rules="emailRules"
            required
          />
        </v-col>
      </v-row>

      <template v-if="payload.person.personType === 'individual'">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="payload.person.birthDate"
              :label="`* ${t('supplier.birth_date')}`"
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
            <v-text-field
              v-model="payload.tradeName"
              :label="`* ${t('supplier.trade_name')}`"
              :rules="[v => !!v || t('validation.required')]"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="payload.openingDate"
              :label="`* ${t('supplier.opening_date')}`"
              v-mask="'##/##/####'"
              :rules="opening_date_rule"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.type" :label="t('supplier.type')" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.size" :label="t('supplier.size')" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="payload.legalNature" :label="t('supplier.legal_nature')" />
          </v-col>
        </v-row>
      </template>

      <h2 class="text-h6 mt-6">{{ t('supplier.contacts') }}</h2>
      <v-divider class="mb-4"></v-divider>
      <SupplierContactsForm v-model="payload.contacts" />

      <h2 class="text-h6 mt-6">{{ t('supplier.addresses') }}</h2>
      <v-divider class="mb-4"></v-divider>
      <SupplierAddressesForm v-model="payload.addresses" />

      <div class="d-flex justify-end ga-4">
        <v-btn class="me-2" @click="router.back()">{{ t('supplier.cancel') }}</v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="loading">{{ t('supplier.edit') }}</v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, ref as vueRef, watch, markRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SupplierContactsForm from '~/components/supplier/SupplierContactsForm.vue'
import SupplierAddressesForm from '~/components/supplier/SupplierAddressesForm.vue'
import { useSupplierEdit } from '~/composables/supplier/useSupplierEdit'
import { useCnpj } from '~/composables/useCnpj'
import { useCep } from '~/composables/useCep'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const form = ref<any>(null)
const valid = ref(false)
const erro = ref('')

const { payload, loading, error, load, submit } = useSupplierEdit()
const { lookup: lookupCnpj } = useCnpj()
const { lookup: lookupCep } = useCep()

const emailRules = [
  (v: string) => (!!v || t('validation.email_required')),
  (v: string) => (/.+@.+\..+/.test(v) || t('validation.email_invalid')),
]
const birth_date_rule = [
  (v: string) => (!!v || t('validation.birth_date_required')),
  (v: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) || t('validation.birth_date_invalid')),
]
const opening_date_rule = [
  (v: string) => (!!v || t('validation.opening_date_required')),
  (v: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(v) || t('validation.opening_date_invalid')),
]

const personTypeItems = ref<{ text: string; value: string }[]>([])
watch(locale, () => {
  personTypeItems.value = markRaw([
    { text: t('supplier.person_type_individual'), value: 'individual' },
    { text: t('supplier.person_type_legalentity'), value: 'legalentity' },
  ])
}, { immediate: true })
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
    erro.value = t('messages.cnpj_only_legal')
    return
  }
  const clean = String(payload.value?.person?.documentNumber || '').replace(/\D/g, '')
  if (!/^\d{14}$/.test(clean)) {
    erro.value = t('messages.cnpj_invalid')
    return
  }
  carregandoCnpj.value = true
  erro.value = ''
  try {
    const data = await lookupCnpj(clean)
    if (!data || !payload.value) return
    payload.value.person.name = data.nome || payload.value.person.name
    payload.value.person.email = data.email || payload.value.person.email
    payload.value.tradeName = data.fantasia || payload.value.tradeName
    payload.value.openingDate = data.abertura || payload.value.openingDate
    payload.value.type = data.tipo || payload.value.type
    payload.value.size = data.porte || payload.value.size
    payload.value.legalNature = data.natureza_juridica || payload.value.legalNature

    if (data.cep) {
      const onlyDigits = String(data.cep).replace(/\D/g, '')
      if (payload.value.addresses.length === 0) {
        payload.value.addresses.push({ street: '', district: '', city: '', state: '', postalCode: '', linkType: 'supplier' })
      }
      const addr = payload.value.addresses[0]
      addr.postalCode = onlyDigits
      addr.street = `${data.logradouro}, ${data.numero}`.trim() || addr.street
      addr.district = data.bairro || addr.district
      addr.city = data.municipio || addr.city
      addr.state = data.uf || addr.state

      const cepData = await lookupCep(onlyDigits)
      if (cepData) {
        addr.street = cepData.logradouro ? `${cepData.logradouro}, ${data.numero}`.trim() : addr.street
        addr.district = cepData.bairro || addr.district
        addr.city = cepData.localidade || addr.city
        addr.state = cepData.uf || addr.state
      }
    }

    if (data.telefone) {
      if (payload.value.contacts.length === 0 || !payload.value.contacts.some(c => c.type === 'phone')) {
        payload.value.contacts.push({
          type: 'phone',
          value: data.telefone,
          linkType: 'supplier'
        })
      } else {
        const phoneContact = payload.value.contacts.find(c => c.type === 'phone')
        if (phoneContact) phoneContact.value = data.telefone
      }
    }
  } finally {
    carregandoCnpj.value = false
  }
}
</script>

<style scoped>
</style>


