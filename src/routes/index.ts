import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organizations/organization.routes";
import userRoutes from "../modules/users/user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});
//Auth
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
export default router;
