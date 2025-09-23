import type { SupplyItem } from "../supplyitem/SupplyItem";

type CheckingStatus = "draft" | "received" | "cancelled";

export interface CheckingItem {
  id: number;
  supplyItemId: SupplyItem;
  receivedQty: number;
  unitOfMeasure: string;
}

export interface Checking {
  id: number;
  receiptDate: Date; //TODO: conferir se é este mesmo o tipo
  status: string;
  createdAt: Date;
  items: CheckingItem[];
  checkingStatus: CheckingStatus;
}

export interface CheckingListResponse {
  data: Checking[];
  total: number;
}

export interface CheckingQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
}