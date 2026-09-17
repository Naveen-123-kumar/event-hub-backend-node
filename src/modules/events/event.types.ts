export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface CreateEventInput {
  title: string;
  description?: string;
  venue: string;
  city: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  venue?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  capacity?: number;
}
