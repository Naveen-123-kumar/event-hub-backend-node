export enum TicketStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateTicketInput {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  saleStartDate: Date;
  saleEndDate: Date;
}

export interface UpdateTicketInput {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
}
