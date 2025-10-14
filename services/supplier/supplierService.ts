import { apiFetch } from "~/composables/useApi";
import type {
  SupplierListResponse,
  SupplierQuery,
} from "~/models/supplier/Supplier";
import type { SupplierDetail } from "~/models/supplier/SupplierDetail";
import type { SupplierCreatePayload } from "~/models/supplier/SupplierCreate";

export async function fetchSuppliers(
  params: SupplierQuery = {}
): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const path = query ? `/suppliers?${query}` : "/suppliers";
  return await apiFetch<SupplierListResponse>(path);
}

export async function fetchSuppliersSummary(): Promise<{ total: number }> {
  const res = await apiFetch<{ total: number; data: any[] }>("/suppliers");
  return { total: res.total };
}

export async function createSupplier(payload: SupplierCreatePayload) {
  try {
    return await apiFetch("/suppliers", {
      method: "POST",
      body: payload,
    });
  } catch (error: any) {
    const rawMessage =
      error?.response?.data?.message ||
      error?.response?._data?.message ||
      error?.response?.message ||
      error?.data?.message ||
      error?.message;

    const messagesArray = Array.isArray(rawMessage) ? rawMessage : undefined;
    const normalizedMessage = messagesArray
      ? messagesArray.join(", ")
      : rawMessage;
    const err = new Error(
      normalizedMessage || "Falha ao criar supplier"
    ) as any;
    if (messagesArray) err.messages = messagesArray;
    throw err;
  }
}

export async function fetchSupplierById(
  id: number | string
): Promise<SupplierDetail> {
  return await apiFetch<SupplierDetail>(`/suppliers/${id}`);
}

export async function updateSupplier(
  id: number | string,
  payload: SupplierCreatePayload
) {
  try {
    return await apiFetch(`/suppliers/${id}`, {
      method: "PUT",
      body: payload,
    });
  } catch (error: any) {
    const rawMessage =
      error?.response?.data?.message ||
      error?.response?._data?.message ||
      error?.response?.message ||
      error?.data?.message ||
      error?.message;

    const messagesArray = Array.isArray(rawMessage) ? rawMessage : undefined;
    const normalizedMessage = messagesArray
      ? messagesArray.join(", ")
      : rawMessage;
    const err = new Error(
      normalizedMessage || "Falha ao criar supplier"
    ) as any;
    if (messagesArray) err.messages = messagesArray;
    throw err;
  }
}

export async function deleteSupplier(id: number | string) {
  return await apiFetch(`/suppliers/${id}`, {
    method: "DELETE",
  });
}
