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
        <div class="d-flex justify-end ga-4">
          <v-btn @click="goBack" id="stock-back-button">Voltar</v-btn>
          <v-btn color="primary" :disabled="checking.lines.length == 0" @click="concludeDialog = true" v-if="!isReadOnly" id="stock-end-button">Finalizar
            Recebimento</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card class="mt-10" v-if="!isReadOnly">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="10">
            <v-text-field hide-details label="Digite o código do produto..." variant="outlined" v-model="itemCode"
              :loading="itemLoading" :disabled="isReadOnly"  id="stock-codpro-input"/>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn color="primary" size="x-large" @click="getItem" :disabled="(itemCode.length < 3 || itemLoading) || isReadOnly" id="stock-prod-confirm-button">
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
            <v-btn color="error" icon="mdi-trash-can-outline" variant="text" elevation="0" @click="deleteLine(item.id)" :disabled="isReadOnly" id="stock-del-button">
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
              v-model="receivedQty" type="number" id="stock-received-qty-input"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cancelar" @click="itemDialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="receivedQty <= 0 || loadingLine" @click="createLine" id="stock-crete-line-button"> Registrar </v-btn>
      </v-card-actions>
    </v-card>

    <v-card title="Item não encontrado." v-else>
    </v-card>
  </v-dialog>

  <!-- CONCLUDE DIALOG -->
  <v-dialog v-model="concludeDialog" max-width="400" :persistent="loading">
    <v-card rounded="xl">
      <template v-slot:prepend>
        <v-icon icon="mdi-check-circle-outline" color="primary"></v-icon>
      </template>
      <template v-slot:text>
        <div class="text-center d-flex flex-column ga-2">
          <div>Tem certeza que deseja concluir este recebimento?</div>
          <div>Ao clicar em <span class="text-primary">Confirmar</span> este recebimento não podera mais ser
            editado ou removido.
          </div>
        </div>
      </template>
      <template v-slot:title>
        <span class="text-primary">Finalizar Recebimento?</span>
      </template>
      <template v-slot:actions>
        <v-btn @click="concludeDialog = false" :disabled="loading" id="stock-cancel-receive-button">
          Cancelar
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="primary" :loading="loading" @click="concludeChecking" id="stock-conclude-checking-button">
          Confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="successDialog" max-width="400" persistent>
    <v-card rounded="xl">
      <template v-slot:text>
        <div class="text-center d-flex flex-column ga-2 align-center">
          <v-icon icon="mdi-check-circle-outline" color="primary" size="100"></v-icon>
          <div>Recebimento concluido com sucesso!</div>
          <div>Você será redirecionado para a tela de listagem.</div>
        </div>
      </template>
      <template v-slot:title>
        <div class="text-center d-flex flex-column ga-2 align-center">
          <span class="text-primary">Recebimento concluído</span>
        </div>
      </template>
      <template v-slot:actions>
        <v-btn color="primary" block variant="flat" rounded="xl" @click="goBack" id="stock-ok-button">
          OK
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useCheckingEdit } from "~/composables/checking/useCheckingEdit";
import { useUseCheckingLine } from "~/composables/checking/useCheckingLine";

const headers = [
  { title: "#", key: "id" },
  { title: "Item", key: "item.name" },
  { title: "Código", key: "item.code" },
  { title: "Recebido", key: "receivedQty" },
  { title: "Ações", key: "actions", sortable: false },
];

const itemDialog = ref(false);
const concludeDialog = ref(false);
const successDialog = ref(false);
const itemCode = ref('');
const receivedQty = ref(0);

const router = useRouter();
const route = useRoute();

const id = Number(route.params.id as string);

const { load, loading, checking, item, itemLoading, loadItem, conclude } = useCheckingEdit();
const { create, loading: loadingLine, remove } = useUseCheckingLine();

const isReadOnly = ref(true);

const goBack = () => {
  router.push("/stock/checking/");
}

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

const concludeChecking = async () => {
  await conclude(() => {
    concludeDialog.value = false;
    successDialog.value = true;
  });
}

const build = async () => {
  await load(id);

  isReadOnly.value = checking.value?.status != 'draft';
};

build();
</script>
