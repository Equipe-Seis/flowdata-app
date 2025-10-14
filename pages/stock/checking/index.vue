<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">{{ t('stock.checking_supply_title') }}</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="createChecking" :disabled="loading" id="stock-create-button">
            {{ t('stock.checking_supply_new') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>{{ t('stock.checking_supply_filters') }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field v-model="numeroRecebimento" hide-details :label="` ${t('stock.checking_supply_receipt_number')}`"
                variant="outlined"></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field v-model="dataRecebimento" hide-details clearable type="date" :label="` ${t('stock.checking_supply_receipt_date')}`"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-select v-model="fornecedor" hide-details clearable :label="` ${t('stock.checking_supply_fornecedor')}`" :items="['', '', '', '']"
                multiple variant="outlined"></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select v-model="estoque" clearable :label="` ${t('stock.checking_supply_estoque')}`" :items="['', '', '']" multiple
                variant="outlined"></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select v-model="statusPedido" clearable :label="` ${t('stock.checking_supply_status')}`"
                :items="['Aguardando', 'Conferindo', 'Finalizado']" multiple variant="outlined"></v-select>
            </v-col>
          </v-row>

          <div class="d-flex justify-start ga-4">
            <v-btn color="primary"> {{ t('common.search') }} </v-btn>
            <v-btn class="me-2"> {{ t('common.clear') }} </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <v-data-table :items="checkings ?? []" :items-per-page="5" class="elevation-1" :headers="headers">
          <template #item.actions="{ item }">
            <v-btn color="blue" icon="mdi-eye-outline" variant="text" elevation="0" @click="visualize(item.id)"
              :disabled="item.status == 'draft'" />
            <v-btn color="primary" icon="mdi-pencil-outline" variant="text" elevation="0" @click="edit(item.id)"
              :disabled="item.status != 'draft'" />
            <v-btn color="orange" icon="mdi-arrow-u-left-bottom" variant="text" elevation="0" @click="openRevertDialog(item.id)"
              :disabled="item.status != 'received'" />
            <v-btn color="error" icon="mdi-trash-can-outline" variant="text" elevation="0"
              @click="openDeleteDialog(item.id)" :disabled="item.status != 'draft'" />
          </template>
          <template #no-data>
            {{ t('stock.checking_supply_empty') }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!--DELETE DIALOG-->
      <v-dialog v-model="deleteDialog" max-width="400" persistent>
        <v-card :text="`${t('stock.checking_supply_delete_confirmation')}`" rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-close-circle-outline" color="error"></v-icon>
          </template>
          <template v-slot:title>
            <span class="text-error">{{ t('stock.checking_supply_delete_title') }}</span>
          </template>
          <template v-slot:actions>
            <v-btn @click="deleteDialog = false">
              {{ t('common.cancel') }}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn @click="removeChecking" color="error">
              {{ t('common.delete') }}
            </v-btn>
          </template>
        </v-card>
      </v-dialog>

      <!--REVERT DIALOG-->
      <v-dialog v-model="revertDialog" max-width="400" persistent>
        <v-card :text="`${t('stock.checking_supply_revert_confirmation')}`" rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-arrow-u-left-bottom" color="orange"></v-icon>
          </template>
          <template v-slot:title>
            <span class="text-orange">{{ t('stock.checking_supply_revert_title') }}</span>
          </template>
          <template v-slot:actions>
            <v-btn @click="revertDialog = false">
              {{ t('common.cancel') }}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn @click="revertChecking" color="orange">
              {{ t('common.confirm') }}
            </v-btn>
          </template>
        </v-card>
      </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted, watch, markRaw } from "vue";
import { useChecking } from "~/composables/checking/useChecking";
import { useCheckingCreate } from "~/composables/checking/useCheckingCreate";
import { useCheckingEdit } from "~/composables/checking/useCheckingEdit";
//import { useI18n } from "vue-i18n";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { t, locale } = useI18n();

const headers = ref<any[]>([]);
watch(
  locale,
  () => {
    headers.value = markRaw([
      { title: t("supplier.id"), key: "id" },
      { title: t("stock.checking_supply_status"), key: "statusDescription" },
      { title: t("stock.checking_supply_receipt_date"), key: "formattedReceiptDate" },
      { title: t("stock.checking_supply_line_count"), key: "lineCount" },
      { title: t("stock.checking_supply_actions"), key: "actions", sortable: false },
    ]);
  },
  { immediate: true }
);

const router = useRouter();
const route = useRoute();

const { load, checkings } = useChecking();
const { create, loading, created } = useCheckingCreate()
const { remove, revert } = useCheckingEdit();

const numeroRecebimento = ref("");
const dataRecebimento = ref(new Date());
const fornecedor = ref<string[]>([]);
const estoque = ref<string[]>([]);
const statusPedido = ref<string[]>([]);
const deleteDialog = ref(false);
const toDeleteChecking = ref<number | null>();
const revertDialog = ref(false);
const toRevertChecking = ref<number | null>();

function edit(id: number) {
  router.push(`/stock/checking/${id}`);
}

function visualize(id: number) {
  router.push(`/stock/checking/${id}`);
}

async function openRevertDialog(id: number) {
  revertDialog.value = true;
  toRevertChecking.value = id;
}

async function revertChecking() {
  if (toRevertChecking.value) {
    await revert(toRevertChecking.value);
    await build();
  }
  revertDialog.value = false;
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
