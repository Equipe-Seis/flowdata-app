<template>
  <v-container v-if="created">
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Recebimento {{ created.id }}</h1>
        </div>
      </v-col>
    </v-row>

    <v-card class="mt-10">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="10">
            <v-text-field hide-details label="Digite o código do produto..." variant="outlined" id="stock-cod-input"/>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn color="primary" size="x-large" @click="dialog = true" id="stock-confirm-button">
              Confirmar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>Recebido</v-card-title>
      <v-card-text>
        <v-data-table :items="items" :items-per-page="25" class="elevation-1">
          <template>
            <tr class="d-none d-md-table-row">
              <td></td>
              <td>
                <v-btn size="small" color="primary" icon="mdi-trash-can-outline" title="Remover Item" id="stock-remove-button">
                </v-btn>
              </td>
            </tr>
          </template>

          <template #no-data> Nenhum item cadastrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container v-else>
    Nada por aqui 😥
  </v-container>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>Laranja Umbigo - Item 266363</v-card-title><!--TODO: recuperar item pelo GET-->
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
            <v-text-field hide-details variant="outlined" density="compact" suffix="Kg"></v-text-field>
            <!--TODO: trocar suffix de acordo com o tipo de medida-->
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" id="stock-register-button"> Registrar </v-btn>
        <v-btn text="Fechar" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useCheckingCreate } from "~/composables/checking/useCheckingCreate";

const dialog = ref(false);

const { created } = useCheckingCreate();
</script>
