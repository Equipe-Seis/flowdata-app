import type { Checking } from "~/models/checking/Checking";
import type {
  SupplyItem,
  SupplyItemWithSupplier,
} from "~/models/supplyitem/SupplyItem";
import {
  concludeChecking,
  deleteChecking,
  fetchCheckingById,
  revertChecking,
} from "~/services/checking/checkingService";
import { fetchSupplyItemByCode } from "~/services/supplyitem/supplyitemService";

export const useCheckingEdit = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const checking = useState<Checking | null>("selected_checking", () => null);

  const itemError = ref<string | null>(null);
  const itemLoading = ref(false);
  const item = ref<SupplyItemWithSupplier | null>(null);

  const load = async (id: number | string) => {
    loading.value = true;
    error.value = null;

    try {
      checking.value = await fetchCheckingById(id);
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: number | number) => {
    loading.value = true;
    error.value = null;

    try {
      await deleteChecking(id);
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  const revert = async (id: number | number) => {
    loading.value = true;
    error.value = null;

    try {
      await revertChecking(id);
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  const loadItem = async (code: string) => {
    itemLoading.value = true;
    itemError.value = null;

    try {
      item.value = await fetchSupplyItemByCode(code);
    } catch (e: any) {
      itemError.value = e.message || "Erro ao carregar o item";
    } finally {
      itemLoading.value = false;
    }
  };

  const conclude = async (onSuccess?: () => void) => {
    if (!checking.value) return;

    loading.value = true;
    error.value = null;

    try {
      await concludeChecking(checking.value?.id);
      onSuccess && onSuccess();
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    load,
    checking,
    remove,
    itemLoading,
    itemError,
    item,
    loadItem,
    conclude,
    revert,
  };
};
