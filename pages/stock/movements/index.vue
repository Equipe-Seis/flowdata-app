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
                v-model="itemCode"
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
          :items="inventSum"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #no-data>
            {{$t('stock.empty')}}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useInventory } from "~/composables/inventory/useInventory";

const headers = [
  { title: "#", key: "id" },
  { title: "Id Item", key: "supplyItem.id" },
  { title: "Item", key: "supplyItem.name" },
  { title: "Quantidade", key: "quantity" },
  { title: "Medida", key: "unitOfMeasure" },
  { title: "Última Atualização", key: "formattedUpdatedAt" },
];

const router = useRouter();
const route = useRoute();
const { inventSum, load } =  useInventory();

const itemCode = ref("");

definePageMeta({
  layout: "default",
  middleware: "auth",
});

function applyFilters() {
  router.push({
    query: {
      codigoItem: itemCode.value || undefined,
    },
  });
}

function clearFilters() {
  itemCode.value = "";

  router.push({ query: {} });
}

async function build() {
  itemCode.value = route.query.codigoItem || "";
  load();
}

build()

</script>

<style></style>
