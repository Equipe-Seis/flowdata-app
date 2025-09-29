<template>
  <v-progress-linear v-if="loading" indeterminate color="accent"></v-progress-linear>
  <v-container v-if="checking">
    <v-row class="mt-10">
      <v-col>
        <div>
          <h1 class="text-h4 mb-4">Recebimento {{ checking.id }}</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4" @click="goBack">
          <v-btn>Voltar</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card class="mt-10">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="10">
            <v-text-field hide-details label="Digite o código do produto..." variant="outlined" v-model="itemCode"
              :loading="itemLoading" />
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn color="primary" size="x-large" @click="getItem" :disabled="itemCode.length < 3 || itemLoading">
              Confirmar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>Recebido</v-card-title>
      <v-card-text>
        <v-data-table :items="checking.lines ?? []" :headers="headers" :items-per-page="25" class="elevation-1"
          hide-default-footer>
          <template #item.receivedQty="{ item }">
            {{ item.receivedQty }} {{ item.unitOfMeasure }}
          </template>

          <template #item.actions="{ item }">
            <!-- <v-btn color="primary" icon="mdi-pencil-outline" variant="text" elevation="0">
            </v-btn> -->
            <v-btn color="error" icon="mdi-trash-can-outline" variant="text" elevation="0" @click="deleteLine(item.id)">
            </v-btn>
          </template>

          <template #no-data> Nenhum item cadastrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Nada por aqui 😥 </v-container>

  <v-dialog v-model="itemDialog" max-width="500">
    <v-card v-if="item">
      <v-card-title>{{ item.name }} - Item {{ item.code }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <h4>Fornecedor:</h4>
            <p>{{ item.supplier.tradeName }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Unidade de Medida:</h4>
            <p>{{ item.unitOfMeasure }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <h4>Quantidade Recebida:</h4>
            <v-text-field hide-details variant="outlined" density="compact" :suffix="item.unitOfMeasure"
              v-model="receivedQty" type="number"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cancelar" @click="itemDialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="receivedQty <= 0 || loadingLine" @click="createLine"> Registrar </v-btn>
      </v-card-actions>
    </v-card>

    <v-card title="Item não enctrado" v-else>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useCheckingEdit } from "~/composables/checking/useCheckingEdit";
import { useUseCheckingLine } from "~/composables/checking/useCheckingLine";

const itemDialog = ref(false);
const itemCode = ref('');
const receivedQty = ref(0);

const router = useRouter();
const route = useRoute();

const headers = [
  { title: "#", key: "id", align: "start" },
  { title: "Item", key: "item.name", align: "start" },
  { title: "Código", key: "item.code", align: "start" },
  { title: "Recebido", key: "receivedQty", align: "start" },
  { title: "Ações", key: "actions", align: 'center', sortable: false },
];

function goBack() {
  router.push("/stock/checking/");
}

const id = Number(route.params.id as string);

const { load, loading, checking, item, itemLoading, loadItem } = useCheckingEdit();
const { create, loading: loadingLine, remove } = useUseCheckingLine();

const getItem = async () => {
  if (!itemCode.value) {
    return;
  }

  await loadItem(itemCode.value);

  if (item.value) {
    itemDialog.value = true;
  }
}

const deleteLine = async (checkingLineId: number) => {
  await remove(id, checkingLineId, () => {
    build();
  })
}

const createLine = async () => {
  if (!item.value) {
    return;
  }

  const request = [
    {
      checkingId: Number(id),
      supplyItemId: item.value.id,
      receivedQty: receivedQty.value,
      unitOfMeasure: item.value.unitOfMeasure
    }
  ]

  await create(request, () => {
    build()
    itemDialog.value = false;
  })
}

const build = async () => {
  await load(id);
};

build();
</script>
