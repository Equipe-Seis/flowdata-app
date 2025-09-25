import type { Checking } from "~/models/checking/Checking";
import { fetchCheckingById } from "~/services/checking/checkingService";

export const useCheckingEdit = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const checking = useState<Checking | null>("selected_checking", () => null);

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

  return { loading, load, checking };
};
