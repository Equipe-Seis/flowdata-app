import { fetchInventory, type InventSum } from "~/services/inventory/inventoryService"

export const useInventory = () => {
  const inventSum = ref<InventSum[]>()
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchInventory();
      inventSum.value = response || [];
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar o estoque";
    } finally {
      loading.value = false;
    }
  };

  return { load, inventSum, loading, error };
}
