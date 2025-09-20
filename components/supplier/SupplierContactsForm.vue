<template>
  <div>
    <v-row v-for="(c, idx) in model" :key="idx" class="mb-2">
      <v-col cols="12" sm="3">
        <v-select 
        :items="contactTypes" 
        item-title="text"
        item-value="value"
        v-model="c.type" 
        :label="` ${t('supplier.type')}`" 
        variant="outlined" 
        hide-details >
      </v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="c.value"
          :label="`* ${t('supplier.value')}`"
          variant="outlined"
          hide-details
          v-mask="'(##) #####-####'"
          :rules="[requiredRule]"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="c.note" :label="`* ${t('supplier.note')}`" variant="outlined" hide-details></v-text-field>
      </v-col>
      <!--<v-col cols="12">
        <v-btn color="error" variant="text" @click="remove(idx)">Remove</v-btn>
      </v-col>-->
    </v-row>
     <!--<v-btn color="primary" variant="text" @click="add">Add contact</v-btn>-->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, markRaw } from 'vue'
import type { SupplierContact } from '../../models/supplier/SupplierCreate'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const { mdAndDown } = useDisplay()
const props = defineProps<{
  modelValue: SupplierContact[]
}>()
const emits = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val: SupplierContact[]) => emits('update:modelValue', val)
})

const linkTypes = ref<{ text: string; value: string }[]>([])
watch(locale, () => {
  linkTypes.value = markRaw([
    { text: t('supplier.customer'), value: 'customer' },
    { text: t('supplier.supplier'), value: 'supplier' },
    { text: t('supplier.person'), value: 'person' },
  ])
}, { immediate: true })
const contactTypes = ref<{ text: string; value: string }[]>([])
watch(locale, () => {
  contactTypes.value = markRaw([
    { text: t('supplier.phone'), value: 'phone' },
    { text: t('supplier.mobile'), value: 'mobile' },
    { text: t('supplier.whatsapp'), value: 'whatsapp' },
  ])
}, { immediate: true })

const requiredRule = (v: unknown) => !!v || t('validation.required')

function add() {
  model.value = [...model.value, { type: 'phone', value: '', linkType: 'supplier', primary: true } as any]
}
function remove(idx: number) {
  const copy = [...model.value]
  copy.splice(idx, 1)
  model.value = copy
}

onMounted(() => {
  if (!model.value || model.value.length === 0) {
    add()
  }
})
</script>

<style scoped>
</style>


