import type { SupplyItem } from "../supplyitem/SupplyItem";

type CheckingStatus = "draft" | "received" | "cancelled";

export interface CheckingLine {
  id: number;
  supplyItemId: SupplyItem;
  receivedQty: number;
  unitOfMeasure: string;
}

export interface Checking {
  id: number;
  receiptDate: Date;
  status: string;
  createdAt: Date;
  lines: CheckingLine[];
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