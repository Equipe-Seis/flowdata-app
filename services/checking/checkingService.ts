import type { Checking, CheckingQuery } from "~/models/checking/Checking";

export const fetchCheckings = async (
  params: CheckingQuery = {}
): Promise<Checking[] | null> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = query ? `/checkings?${query}` : "/checkings";
  return await apiFetch<Checking[] | null>(path);
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

export const addCheckingLine = async (data: any[]) => {
  return await apiFetch<Checking>("/checkings/lines", {
    method: "POST",
    body: data,
  });
};

export const deleteCheckingLine = async (
  checkingId: number,
  checkingLineId: number
) => {
  return await apiFetch<Checking>(
    `/checkings/${checkingId}/lines/${checkingLineId}`,
    {
      method: "DELETE",
    }
  );
};

export const createChecking = async () => {
  return await apiFetch<Checking>(`/checkings`, {
    method: "POST",
    body: {
      receiptDate: new Date(),
    },
  });
};

export const deteleteChecking = async (id: number | string) => {
  return await apiFetch<number>(`/checkings/${id}`, {
    method: "DELETE",
  });
};
