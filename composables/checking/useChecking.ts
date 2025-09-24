import type { CheckingListResponse } from "~/models/checking/Checking";
import { fetchCheckings } from "~/services/checking/checkingService";

export const useChecking = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const checkings = ref<CheckingListResponse[]>();

  const load = async (id: number | string) => {
    loading.value = true;
    error.value = null;

    try {
      checkings.value = await fetchCheckings();
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  return { load, checkings };
};
