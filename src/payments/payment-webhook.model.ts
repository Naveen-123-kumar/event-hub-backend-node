import { Table, Column, Model, DataType, Index } from "sequelize-typescript";

export enum WebhookStatus {
  PROCESSING = "processing",
  PROCESSED = "processed",
  FAILED = "failed",
}

@Table({
  tableName: "payment_webhook_events",
  timestamps: true,
})
export class PaymentWebhookEvent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  /**
   * Razorpay webhook event ID.
   *
   * This must be unique for idempotency.
   */
  @Index({
    unique: true,
  })
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare eventId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare eventType: string;

  @Column({
    type: DataType.ENUM(...Object.values(WebhookStatus)),
    allowNull: false,
    defaultValue: WebhookStatus.PROCESSING,
  })
  declare status: WebhookStatus;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare payload: Record<string, unknown> | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare errorMessage: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare attempts: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare processedAt: Date | null;
}
