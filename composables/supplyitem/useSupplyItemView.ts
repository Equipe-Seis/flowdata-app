import { ref } from 'vue'
import { fetchSupplyItemById } from "~/services/supplyitem/supplyitemService";
import type { SupplyItem } from "~/models/supplyitem/SupplyItem";

export const useSupplyItemView = () => {
  const item = ref<SupplyItem | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async (id: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      item.value = await fetchSupplyItemById(id);
    } catch (e: any) {
      error.value = e.message || "Erro ao carregar o item";
    } finally {
      loading.value = false;
    }
  };

  return { item, loading, error, load };
};
