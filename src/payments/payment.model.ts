import { Table, Column, Model, DataType, Index } from "sequelize-typescript";

export enum PaymentStatus {
  CREATED = "created",
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  OTHER = "other",
}

@Table({
  tableName: "payments",
  timestamps: true,
})
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  /**
   * Reference to the booking in MongoDB.
   * We don't create a MySQL foreign key because
   * the booking is stored in MongoDB.
   */
  @Index
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare bookingId: string;

  /**
   * Razorpay Order ID
   * Example: order_ABC123
   */
  @Index({
    unique: true,
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare razorpayOrderId: string;

  /**
   * Razorpay Payment ID
   * Example: pay_ABC123
   */
  @Index({
    unique: true,
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare razorpayPaymentId: string | null;

  /**
   * Amount stored in smallest currency unit.
   *
   * Example:
   * ₹500 = 50000 paise
   */
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: "INR",
  })
  declare currency: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
    defaultValue: PaymentStatus.CREATED,
  })
  declare status: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: true,
  })
  declare paymentMethod: PaymentMethod | null;

  /**
   * Reason returned by payment gateway
   * when payment fails.
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare failureReason: string | null;

  /**
   * Store gateway response/reference if required
   * for auditing/debugging.
   */
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare gatewayResponse: Record<string, unknown> | null;

  /**
   * Timestamp when payment was successfully captured.
   */
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare paidAt: Date | null;

  /**
   * Timestamp when payment was refunded.
   */
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare refundedAt: Date | null;
}
