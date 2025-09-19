<template>
  <div>
    <v-row v-for="(c, idx) in model" :key="idx" class="mb-2">
      <v-col cols="12" sm="3">
        <v-select :items="contactTypes" v-model="c.type" label="Type" variant="outlined" hide-details ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field v-model="c.value" label="* Value" variant="outlined" hide-details v-mask="'(##) #####-####'" :rules="[v => !!v || 'required']" required></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="c.note" label="Note" variant="outlined" hide-details></v-text-field>
      </v-col>
      <!--<v-col cols="12">
        <v-btn color="error" variant="text" @click="remove(idx)">Remove</v-btn>
      </v-col>-->
    </v-row>
     <!--<v-btn color="primary" variant="text" @click="add">Add contact</v-btn>-->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { SupplierContact } from '~/models/supplier/SupplierCreate'

const props = defineProps<{
  modelValue: SupplierContact[]
}>()
const emits = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val: SupplierContact[]) => emits('update:modelValue', val)
})

const contactTypes = ['phone', 'mobile', 'email', 'whatsapp']
const linkTypes = ['customer', 'supplier', 'person']

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


