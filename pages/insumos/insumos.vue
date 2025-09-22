<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Insumos</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToCadastro"> Novo Insumo </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title class="font-weight-bold">Filtros</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="applyFilters">
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="search"
                hide-details
                label="Buscar por Nome ou Código"
                variant="outlined"
                autofocus
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="statusInsumo"
                hide-details
                clearable
                label="Status"
                :items="['active', 'inactive']"
                multiple
                variant="outlined"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-end ga-4 mt-4">
            <v-btn type="submit" color="primary">Pesquisar</v-btn>
            <v-btn variant="outlined" @click.prevent="clearFilters">Limpar</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="insumos || []"
          :loading="pending"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr class="d-none d-md-table-row">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.description }}</td>
              <td>
                <div class="d-flex justify-center gap-2">
                  <v-btn size="small" icon="mdi-eye" color="primary" @click="viewInsumo(item.id)" />
                  <v-btn size="small" icon="mdi-file-document-edit-outline" color="secondary" @click="editarInsumos(item.id)" />
                  <v-btn size="small" icon="mdi-delete" color="error" @click="deleteInsumo(item.id)" />
                </div>
              </td>
            </tr>
           
          </template>
          <template #no-data> Nenhum insumo encontrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, watch } from "vue";

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const config = useRuntimeConfig();

const search = ref('');
const statusInsumo = ref([]);

const { data: insumos, pending } = await useAsyncData(
  'fetch-insumos',
  () => $fetch(`${config.public.apiBase}/supply`, { params: route.query }),
  { watch: [() => route.query], default: () => [] }
);

const headers = [
  { title: "ID", key: "id" },
  { title: "Nome", key: "name" },
  { title: "Código", key: "code" },
  { title: "Preço", key: "price" },
  { title: "Descrição", key: "description" },
  { title: "Ações", key: "actions", sortable: false, align: 'center' },
];

function updateLocalFiltersFromRoute(query) {
  search.value = query.search || "";
  const getQueryArray = (key) => query[key] ? (Array.isArray(query[key]) ? query[key] : [query[key]]) : [];
  statusInsumo.value = getQueryArray('statusInsumo');
}

watch(() => route.query, (newQuery) => {
  updateLocalFiltersFromRoute(newQuery);
}, { immediate: true });

function applyFilters() {
  const query = {
    search: search.value || undefined,
    statusInsumo: statusInsumo.value.length ? statusInsumo.value : undefined,
  };
  router.push({ query });
}

function clearFilters() {
  search.value = "";
  statusInsumo.value = [];
  router.push({ query: {} });
}

function goToCadastro() { router.push("/insumos/cadastro"); }
function editarInsumos(id) { router.push(`/insumos/${id}`); }
function viewInsumo(id) { router.push(`/insumos/view/${id}`); }
function deleteInsumo(id) { console.log("Excluir insumo", id); }
</script>

<style scoped>
.gap-2 { gap: 0.5rem; }
</style>
