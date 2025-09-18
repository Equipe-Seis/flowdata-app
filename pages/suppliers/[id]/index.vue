<template>
  <v-container>
    <h1 class="text-h4 mb-2">Supplier Detail</h1>
    <div class="d-flex justify-end ga-2 mb-4">
      <v-btn variant="text" @click="goBack">Back</v-btn>
      <v-btn color="primary" @click="goToCreate">New Supplier</v-btn>
      <v-btn color="secondary" @click="goToEdit">Edit</v-btn>
      <v-btn color="error" @click="confirmDelete">Delete</v-btn>
    </div>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-skeleton-loader v-if="loading" type="article"></v-skeleton-loader>

    <div v-else-if="supplier">
      <v-card class="mb-4">
        <v-card-title>Person</v-card-title>
        <v-card-text>
          <div><strong>Name:</strong> {{ supplier.person.name }}</div>
          <div><strong>Type:</strong> {{ supplier.person.personType }}</div>
          <div><strong>Document:</strong> {{ supplier.person.documentNumber }}</div>
          <div v-if="supplier.person.birthDate"><strong>Birth Date:</strong> {{ formatDate(supplier.person.birthDate) }}</div>
          <div><strong>Email:</strong> {{ supplier.person.email }}</div>
          <div><strong>Status:</strong> {{ supplier.person.status }}</div>
        </v-card-text>
      </v-card>

      <v-card v-if="supplier.tradeName || supplier.openingDate || supplier.type || supplier.size || supplier.legalNature" class="mb-4">
        <v-card-title>Company</v-card-title>
        <v-card-text>
          <div v-if="supplier.tradeName"><strong>Trade Name:</strong> {{ supplier.tradeName }}</div>
          <div v-if="supplier.openingDate"><strong>Opening Date:</strong> {{ formatDate(supplier.openingDate) }}</div>
          <div v-if="supplier.type"><strong>Type:</strong> {{ supplier.type }}</div>
          <div v-if="supplier.size"><strong>Size:</strong> {{ supplier.size }}</div>
          <div v-if="supplier.legalNature"><strong>Legal Nature:</strong> {{ supplier.legalNature }}</div>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>Contacts</v-card-title>
        <v-card-text>
          <div v-if="!(supplier.contacts && supplier.contacts.length)">No contacts</div>
          <v-list v-else density="compact">
            <v-list-item v-for="c in supplier.contacts" :key="c.id">
              <v-list-item-title>{{ c.type }} - {{ c.value }}</v-list-item-title>
              <v-list-item-subtitle>{{ c.note }} <span v-if="c.primary">• primary</span> • {{ c.linkType }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>Addresses</v-card-title>
        <v-card-text>
          <div v-if="!(supplier.addresses && supplier.addresses.length)">No addresses</div>
          <v-list v-else density="compact">
            <v-list-item v-for="a in supplier.addresses" :key="a.id">
              <v-list-item-title>{{ a.street }}, {{ a.district }} - {{ a.city }}/{{ a.state }}</v-list-item-title>
              <v-list-item-subtitle>{{ a.postalCode }} • {{ a.linkType }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupplier } from '~/composables/useSupplier'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { supplier, loading, error, load } = useSupplier()

onMounted(() => {
  if (route.params.id) load(String(route.params.id))
})

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toISOString().slice(0, 10)
  } catch {
    return iso
  }
}

function goBack() {
  router.back()
}

function goToCreate() {
  router.push('/suppliers/create')
}

function goToEdit() {
  router.push({ name: 'suppliers-id-edit', params: { id: String(route.params.id) } })
}

async function confirmDelete() {
  if (!confirm('Excluir este supplier?')) return
  const { remove } = useSupplier()
  const ok = await remove(String(route.params.id))
  if (ok) router.push('/suppliers/suppliers')
}
</script>

<style scoped>
</style>


