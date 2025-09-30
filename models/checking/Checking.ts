import type { SupplyItem } from "../supplyitem/SupplyItem";

export type CheckingStatus = "draft" | "received" | "cancelled";

export interface CheckingLine {
  id: number;
  item: SupplyItem;
  receivedQty: number;
  unitOfMeasure: string;
  supplyItemId: number;
}

export interface Checking {
  id: number;
  receiptDate: Date;
  status: string;
  createdAt: Date;
  lines: CheckingLine[];
  checkingStatus: CheckingStatus;
  formattedReceiptDate: string;
  formattedCreatedAt: string;
  lineCount: number;
  statusDescription: string;
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