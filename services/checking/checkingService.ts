import type {
  Checking,
  CheckingListResponse,
  CheckingQuery,
} from "~/models/checking/Checking";

//TODO: verificar se está correto

export const fetchCheckings = async (
  params: CheckingQuery = {}
): Promise<CheckingListResponse[]> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = query ? `/checkings?${query}` : "/checkings";
  return await apiFetch<CheckingListResponse[]>(path);
};

export const fetchCheckingsSummary = async (): Promise<{ total: number }> => {
  const res = await apiFetch<{ total: number; data: any[] }>("/checkings");
  return { total: res.total };
};

export const fetchCheckingById = async (
  id: number | string
): Promise<Checking> => {
  return await apiFetch<Checking>(`/checkings/${id}`);
};

export const createChecking = async () => {
  return await apiFetch<Checking>(`/checkings`, {
    method: "POST",
    body: {
      receiptDate: new Date(),
    },
  });
};
