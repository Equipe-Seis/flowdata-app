<template>
  <div :key="locale">
    <v-row v-for="(a, idx) in model" :key="idx" class="mb-2">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="a.street"
          :label="streetLabel"
          variant="outlined"
          hide-details
          :rules="[requiredRule]"
          required
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="a.district"
          :label="districtLabel"
          variant="outlined"
          hide-details
          :rules="[requiredRule]"
          required
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model="a.city"
          :label="cityLabel"
          variant="outlined"
          hide-details
          :rules="[requiredRule]"
          required
        />
      </v-col>

      <v-col cols="12" sm="2">
        <v-text-field
          v-model="a.state"
          :label="stateLabel"
          variant="outlined"
          hide-details
          :rules="[requiredRule]"
          required
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model="a.postalCode"
          :label="postalCodeLabel"
          variant="outlined"
          hide-details
          v-mask="'#####-###'"
        >
          <template #append-inner>
            <v-btn
              icon
              @click="onLookup(idx)"
              color="primary"
              :aria-label=postalCodeLabel
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { SupplierAddress } from '../../models/supplier/SupplierCreate'
import { useCep } from '../../composables/useCep'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const { mdAndDown } = useDisplay()

watch(locale, (newLocale) => {
  console.log('[SupplierAddressesForm] Idioma mudou para:', newLocale)
})

const props = defineProps<{
  modelValue: SupplierAddress[]
}>()
const emits = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val: SupplierAddress[]) => emits('update:modelValue', val)
})

const linkTypes = ['customer', 'supplier', 'person']
const { lookup } = useCep()

const streetLabel = computed(() => `* ${t('supplier.street')}`)
const districtLabel = computed(() => `* ${t('supplier.district')}`)
const cityLabel = computed(() => `* ${t('supplier.city')}`)
const stateLabel = computed(() => `* ${t('supplier.state')}`)
const postalCodeLabel = computed(() => `* ${t('supplier.postal_code')}`)

const requiredRule = (v: unknown) => !!v || t('validation.required')

function add() {
  model.value = [...model.value, {
    street: '',
    district: '',
    city: '',
    state: '',
    postalCode: '',
    linkType: 'supplier'
  } as SupplierAddress]
}

function remove(idx: number) {
  const copy = [...model.value]
  copy.splice(idx, 1)
  model.value = copy
}

async function onLookup(idx: number) {
  const addr = model.value[idx]
  const data = await lookup(addr.postalCode || '')
  if (data) {
    addr.street = data.logradouro || addr.street
    addr.district = data.bairro || addr.district
    addr.city = data.localidade || addr.city
    addr.state = data.uf || addr.state
  }
}

onMounted(() => {
  if (!model.value || model.value.length === 0) {
    add()
  }
})
</script>

<style scoped>
</style>
