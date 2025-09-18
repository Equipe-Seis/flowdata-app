<template>
  <div>
    <v-row v-for="(a, idx) in model" :key="idx" class="mb-2">
      <v-col cols="12" sm="6">
        <v-text-field v-model="a.street" label="* Street" variant="outlined" hide-details  :rules="[v => !!v || 'Street is required']" require></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="a.district" label="*  District" variant="outlined" hide-details 
        :rules="[v => !!v || 'District is required']"
            required></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field v-model="a.city" label="* City" variant="outlined" hide-details  :rules="[v => !!v || 'City is required']"></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field v-model="a.state" label="*  State" variant="outlined" hide-details :rules="[v => !!v || 'State is required']"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="a.postalCode"
          label="* Postal Code"
          variant="outlined"
          hide-details
          append-inner-icon="mdi-magnify"
          @click:append-inner="onLookup(idx)"
        ></v-text-field>
      </v-col>
      <!--<v-col cols="12" sm="2">
        <v-select :items="linkTypes" v-model="a.linkType" label="Link Type" variant="outlined" hide-details></v-select>
      </v-col>
      <v-col cols="12">
        <v-btn color="error" variant="text" @click="remove(idx)">Remove</v-btn>
      </v-col>-->
    </v-row>
    <!--<v-btn color="primary" variant="text" @click="add">Add address</v-btn>-->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { SupplierAddress } from '~/models/supplier/SupplierCreate'
import { useCep } from '~/composables/useCep'

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

function add() {
  model.value = [...model.value, { street: '', district: '', city: '', state: '', postalCode: '', linkType: 'supplier' } as any]
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


