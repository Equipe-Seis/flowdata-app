import type { Checking } from "~/models/checking/Checking";
import { fetchCheckings } from "~/services/checking/checkingService";

export const useChecking = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const checkings = ref<Checking[]>([]);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchCheckings();
      checkings.value = response || [];
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  return { load, checkings };
};
