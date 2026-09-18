import { Router } from "express";
import { createPayment, verifyPayment } from "./payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, createPayment);
router.post("/verify", authenticate, verifyPayment);

export default router;
