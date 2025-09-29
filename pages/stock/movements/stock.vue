<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">{{$t('menu.estoque')}}</h1>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>{{$t('common.filters')}}</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                v-model="codigoItem"
                hide-details
                label="Código do Item"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex justify-start ga-4 mt-4">
            <v-btn color="primary" @click.prevent="applyFilters">
              {{$t('common.search')}}
            </v-btn>
            <v-btn class="me-2" @click.prevent="clearFilters"> {{$t('common.clear')}} </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="mt-4">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item="">
            <tr class="d-none d-md-table-row">
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>

          <template #no-data>
            {{$t('stock.empty')}}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const headers = [
  { title: "Código Item", key: "id" },
  { title: "Nome Item", key: "nomeItem" },
  { title: "Última Atualização", key: "dataAtualizacao" },
];

const codigoItem = ref("");

onMounted(() => {
  codigoItem.value = route.query.codigoItem || "";
});

function applyFilters() {
  router.push({
    query: {
      codigoItem: codigoItem.value || undefined,
    },
  });
}

function clearFilters() {
  codigoItem.value = "";

  router.push({ query: {} });
}
</script>

<style></style>
