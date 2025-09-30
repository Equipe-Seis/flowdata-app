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
          <v-btn color="primary" @click="createChecking" :disabled="loading">
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
        <v-data-table :items="checkings ?? []" :items-per-page="5" class="elevation-1" :headers="headers">
          <template #item.actions="{ item }">
            <v-btn color="primary" icon="mdi-pencil-outline" variant="text" elevation="0" @click="edit(item.id)"
              :disabled="item.checkingStatus != 'draft'" />
            <v-btn color="error" icon="mdi-trash-can-outline" variant="text" elevation="0"
              @click="openDeleteDialog(item.id)" :disabled="item.checkingStatus != 'draft'" />
          </template>
          <template #no-data>
            Nenhum recebimento encontrado.
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    < !--DELETE DIALOG-->
      <v-dialog v-model="deleteDialog" max-width="400" persistent>
        <v-card text="Tem certeza que deseja excluir este recebimento?" rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-close-circle-outline" color="error"></v-icon>
          </template>
          <template v-slot:title>
            <span class="text-error">Excluir</span>
          </template>
          <template v-slot:actions>
            <v-btn @click="deleteDialog = false">
              Cancelar
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn @click="removeChecking" color="error">
              Excluir
            </v-btn>
          </template>
        </v-card>
      </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useChecking } from "~/composables/checking/useChecking";
import { useCheckingCreate } from "~/composables/checking/useCheckingCreate";
import { useCheckingEdit } from "~/composables/checking/useCheckingEdit";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const headers = [
  { title: '#', key: 'id' },
  { title: 'Status', key: 'statusDescription' },
  { title: 'Data Recebimento', key: 'formattedReceiptDate' },
  { title: 'Qtd. Linhas', key: 'lineCount' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const router = useRouter();
const route = useRoute();

const { load, checkings } = useChecking();
const { create, loading, created } = useCheckingCreate()
const { remove } = useCheckingEdit();

const numeroRecebimento = ref("");
const dataRecebimento = ref(new Date());
const fornecedor = ref<string[]>([]);
const estoque = ref<string[]>([]);
const statusPedido = ref<string[]>([]);
const deleteDialog = ref(false);
const toDeleteChecking = ref<number | null>();

function edit(id: number) {
  router.push(`/stock/checking/${id}`);
}

function applyFilters() {
  router.push({
    query: {
      numeroRecebimento: numeroRecebimento.value || undefined,
      dataRecebimento: dataRecebimento.value.toString() || undefined,
      fornecedor: fornecedor.value.length ? fornecedor.value : undefined,
      estoque: estoque.value.length ? estoque.value : undefined,
      statusPedido: statusPedido.value.length ? statusPedido.value : undefined,
    },
  });
}

function clearFilters() {
  numeroRecebimento.value = "";
  dataRecebimento.value = new Date();
  fornecedor.value = [];
  estoque.value = [];
  statusPedido.value = [];

  router.push({ query: {} });
}

async function openDeleteDialog(id: number) {
  deleteDialog.value = true;
  toDeleteChecking.value = id;
}

async function removeChecking() {
  if (toDeleteChecking.value) {
    await remove(toDeleteChecking.value);
    await build();
  }
  deleteDialog.value = false;
}

async function createChecking() {
  await create();

  if (created) {
    router.push(`/stock/checking/${created.value?.id}`);
  }
}

async function build() {
  numeroRecebimento.value = route.query.numeroRecebimento as string || "";
  dataRecebimento.value = route.query.dataRecebimento
    ? new Date(route.query.dataRecebimento as string)
    : new Date();
  fornecedor.value = route.query.fornecedor
    ? Array.isArray(route.query.fornecedor)
      ? route.query.fornecedor as string[]
      : [route.query.fornecedor]
    : [];
  estoque.value = route.query.estoque
    ? Array.isArray(route.query.estoque)
      ? route.query.estoque as string[]
      : [route.query.estoque]
    : [];
  statusPedido.value = route.query.statusPedido
    ? Array.isArray(route.query.statusPedido)
      ? route.query.statusPedido as string[]
      : [route.query.statusPedido]
    : [];

  await load();
}

build()

</script>

<style></style>
