import { addCheckingLine, deleteCheckingLine } from "~/services/checking/checkingService";

export const useUseCheckingLine = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (data: any[], onSuccess?: () => void) => {
    loading.value = true;
    error.value = null;

    try {
      await addCheckingLine(data)
      onSuccess && onSuccess();
    } catch (e: any) {
      error.value = e?.message || "Falha ao criar a linha de recebimento";
    } finally {
      loading.value = false;
    }
  };

  const remove = async (checkingId: number, id: number, onSuccess?: () => void) => {
    loading.value = true;
    error.value = null;

    try {
      await deleteCheckingLine(checkingId, id)
      onSuccess && onSuccess();
    } catch (e: any) {
      error.value = e?.message || "Falha ao deletar a linha de recebimento";
    } finally {
      loading.value = false;
    }
  };
  return { loading, error, create, remove };
};
