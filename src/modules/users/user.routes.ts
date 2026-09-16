import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorization.middleware";

import { Permission } from "../auth/auth.types";

import { createOrganizationAdminController } from "./user.controller";

const router = Router();

router.post(
  "/organization-admin",
  authenticate,
  authorize(Permission.USER_CREATE),
  createOrganizationAdminController,
);

export default router;
