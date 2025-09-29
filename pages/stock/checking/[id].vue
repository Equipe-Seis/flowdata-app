<template>
  <v-progress-linear
    v-if="loading"
    indeterminate
    color="accent"
  ></v-progress-linear>
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
            <v-text-field
              hide-details
              label="Digite o código do produto..."
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn color="primary" size="x-large" @click="dialog = true">
              Confirmar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>Recebido</v-card-title>
      <v-card-text>
        <v-data-table
          :items="checking.lines ?? []"
          :headers="headers"
          :items-per-page="25"
          class="elevation-1"
        >
          <template #item.receivedQty="{ item }">
            {{ item.receivedQty }} {{ item.unitOfMeasure }}
          </template>
          <template #no-data> Nenhum item cadastrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Nada por aqui 😥 </v-container>

  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Laranja Umbigo - Item 266363</v-card-title
      ><!--TODO: recuperar item pelo GET-->
      <v-card-text>
        <v-row>
          <v-col>
            <h4>Fornecedor:</h4>
            <p>Fulano de tal da Silva</p>
            <!--TODO: recuperar item pelo GET-->
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Unidade de Medida:</h4>
            <p>KG</p>
            <!--TODO: recuperar item pelo GET-->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <h4>Quantidade Recebida:</h4>
            <v-text-field
              hide-details
              variant="outlined"
              density="compact"
              suffix="Kg"
            ></v-text-field>
            <!--TODO: trocar suffix de acordo com o tipo de medida-->
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"> Registrar </v-btn>
        <v-btn text="Fechar" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useCheckingEdit } from "~/composables/checking/useCheckingEdit";

const dialog = ref(false);


const router = useRouter();
const route = useRoute();

const headers = [
  { title: "#", key: "id", align: "start" },
  { title: "Item", key: "item.name", align: "start" },
  { title: "Código", key: "item.code", align: "start" },
  { title: "Recebido", key: "receivedQty", align: "start" },
];

function goBack() {
  router.push("/stock/checking/");
}

const id = route.params.id;

const { load, loading, checking } = useCheckingEdit();

const build = async () => {
  await load(id);
};

build();
</script>
