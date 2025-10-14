<template>
  <v-container>
    <h1 class="text-h4 mb-2">{{ $t('supply.supply_item_detail') }}</h1>

    <div class="d-flex justify-end ga-2 mb-4">
      <v-btn variant="text" @click="goBack">{{ $t('common.back') }}</v-btn>
      <v-btn color="primary" @click="goToCreate">{{ $t('supply.new_supply') }}</v-btn>
      <!--<v-btn color="secondary" @click="goToEdit">{{ $t('common.edit') }}</v-btn>-->
      <!--<v-btn color="error" @click="confirmDelete">{{ $t('common.delete') }}</v-btn>-->
    </div>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>

    <div v-else-if="item">
      <v-card>
        <v-card-title>{{ $t('supply.supply_details') }}</v-card-title>
        <v-card-text>
          <div><strong>{{ $t('supply.id') }}:</strong> {{ item.id }}</div>
          <div><strong>{{ $t('supply.name') }}:</strong> {{ item.name }}</div>
          <div><strong>{{ $t('supply.code') }}:</strong> {{ item.code }}</div>
          <div><strong>{{ $t('supply.price') }}:</strong> {{ item.price }}</div>
          <div><strong>{{ $t('supply.description') }}:</strong> {{ item.description }}</div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupplyItemView } from '~/composables/supplyitem/useSupplyItemView'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()

const { item, loading, error, load, remove } = useSupplyItemView()

onMounted(() => {
  if (route.params.id) load(String(route.params.id))
})

function goBack() {
  router.back()
}

function goToCreate() {
  router.push('/supplyitem/create')
}

function goToEdit() {
  router.push(`/supplyitem/${route.params.id}/edit`)
}

async function confirmDelete() {
  //if (!confirm($t('common.delete_confirmation'))) return
  //const ok = await remove(String(route.params.id))
  //if (ok) router.push('/supplyitem/supplyItem')
}
</script>

<style scoped>
</style>
