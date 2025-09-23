import type {
  Checking,
  CheckingListResponse,
  CheckingQuery,
} from "~/models/checking/Checking";

//TODO: verificar se está correto

export async function fetchCheckings(
  params: CheckingQuery = {}
): Promise<CheckingListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = query ? `/checkings?${query}` : "/checkings";
  return await apiFetch<CheckingListResponse>(path);
}

export async function fetchCheckingsSummary(): Promise<{ total: number }> {
  const res = await apiFetch<{ total: number; data: any[] }>("/checkings");
  return { total: res.total };
}

export async function fetchCheckingById(
  id: number | string
): Promise<Checking> {
  return await apiFetch<Checking>(`/checkings/${id}`);
}
