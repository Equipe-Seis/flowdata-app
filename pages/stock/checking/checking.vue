<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Recebimento de Insumos</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToRegistration" :disabled="loading">
            Novo Registro
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>Filtros</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field v-model="numeroRecebimento" hide-details label="Número do Recebimento"
                variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field v-model="dataRecebimento" hide-details clearable type="date" label="Data do Recebimento"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-select v-model="fornecedor" hide-details clearable label="Fornecedor" :items="['', '', '', '']"
                multiple variant="outlined"></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select v-model="estoque" clearable label="Estoque" :items="['', '', '']" multiple
                variant="outlined"></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select v-model="statusPedido" clearable label="Status"
                :items="['Aguardando', 'Conferindo', 'Finalizado']" multiple variant="outlined"></v-select>
            </v-col>
          </v-row>

          <div class="d-flex justify-start ga-4">
            <v-btn color="primary"> Pesquisar </v-btn>
            <v-btn class="me-2"> Limpar </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <v-data-table :items="checkings" :items-per-page="5" class="elevation-1">
          <template #recebimento="">
            <tr class="d-none d-md-table-row">
              <td></td>
              <td>
                <v-btn size="small" color="primary" icon="mdi-trash-can-outline" title="Remover Item">
                </v-btn>
              </td>
            </tr>
          </template>

          <template #no-data>
            Nenhum recebimento encontrado.
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useChecking } from "~/composables/checking/useChecking";
import { useCheckingCreate } from "~/composables/checking/useCheckingCreate";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const router = useRouter();
const route = useRoute();

const { load, checkings } = useChecking();
const { create, loading } = useCheckingCreate()

const numeroRecebimento = ref("");
const dataRecebimento = ref(new Date());
const fornecedor = ref([]);
const estoque = ref([]);
const statusPedido = ref([]);

function editDelivery(id) {
  router.push(`stock/checking/${id}`);
}

async function goToRegistration() {
  await create();
  router.push("/stock/checking/create");
}

function applyFilters() {
  router.push({
    query: {
      numeroRecebimento: numeroRecebimento.value || undefined,
      dataRecebimento: dataRecebimento.value || undefined,
      fornecedor: fornecedor.value.length ? fornecedor.value : undefined,
      estoque: estoque.value.length ? estoque.value : undefined,
      statusPedido: statusPedido.value.length ? statusPedido.value : undefined,
    },
  });
}

function clearFilters() {
  numeroPedido.value = "";
  dataRecebimento.value = "";
  fornecedor.value = [];
  estoque.value = [];
  statusPedido.value = [];

  router.push({ query: {} });
}

async function build() {
  numeroRecebimento.value = route.query.numeroRecebimento || "";
  //  dataRecebimento.value = new Date(route.query.dataRecebimento || "");
  fornecedor.value = route.query.fornecedor
    ? Array.isArray(route.query.fornecedor)
      ? route.query.fornecedor
      : [route.query.fornecedor]
    : [];
  estoque.value = route.query.estoque
    ? Array.isArray(route.query.estoque)
      ? route.query.estoque
      : [route.query.estoque]
    : [];
  statusPedido.value = route.query.statusPedido
    ? Array.isArray(route.query.statusPedido)
      ? route.query.statusPedido
      : [route.query.statusPedido]
    : [];

  await load();
}

build()

</script>

<style></style>
