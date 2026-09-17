import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Payment } from "../payments/payment.model";
import { PaymentWebhookEvent } from "../payments/payment-webhook.model";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",

  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

  models: [Payment, PaymentWebhookEvent],

  logging: process.env.NODE_ENV === "development" ? console.log : false,

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectMySQL = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected");
  } catch (error) {
    console.error("MySQL connection failed:", error);
    throw error;
  }
};

export default sequelize;
