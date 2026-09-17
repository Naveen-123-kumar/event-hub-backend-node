import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorization.middleware";

import { Permission } from "../auth/auth.types";

import {
  createOrganizationAdminController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
  updateUserRoleController,
  updateUserStatusController,
} from "./user.controller";

const router = Router();

router.post(
  "/organization-admin",
  authenticate,
  authorize(Permission.USER_CREATE),
  createOrganizationAdminController,
);

router.get(
  "/",
  authenticate,
  authorize(Permission.USER_VIEW),
  getUsersController,
);

router.get(
  "/:userId",
  authenticate,
  authorize(Permission.USER_VIEW),
  getUserController,
);

router.patch(
  "/:userId",
  authenticate,
  authorize(Permission.USER_UPDATE),
  updateUserController,
);

router.patch(
  "/:userId/role",
  authenticate,
  authorize(Permission.USER_ASSIGN_ROLE),
  updateUserRoleController,
);

router.patch(
  "/:userId/status",
  authenticate,
  authorize(Permission.USER_UPDATE),
  updateUserStatusController,
);

router.delete(
  "/:userId",
  authenticate,
  authorize(Permission.USER_DELETE),
  deleteUserController,
);

export default router;
