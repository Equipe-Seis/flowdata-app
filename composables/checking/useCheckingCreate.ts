import type { Checking } from "~/models/checking/Checking";
import { createChecking } from "~/services/checking/checkingService";

export const useCheckingCreate = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const created = useState<Checking | null>("created_checking", () => null);

  const create = async () => {
    loading.value = true;
    error.value = null;

    try {
      created.value = await createChecking();
    } catch (e: any) {
      error.value = e?.message || "Falha ao buscar os recebimentos";
    } finally {
      loading.value = false;
    }
  };

  return { loading, create, created };
};
