import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorization.middleware";
import { Permission } from "../auth/auth.types";
import { requireOrganizationAccess } from "../../middleware/tenant.middleware";

import {
  createOrganizationController,
  deleteOrganizationController,
  getOrganizationController,
  getOrganizationsController,
  updateOrganizationController,
} from "./organization.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(Permission.ORGANIZATION_CREATE),
  createOrganizationController,
);

router.get(
  "/",
  authenticate,
  authorize(Permission.ORGANIZATION_VIEW),
  getOrganizationsController,
);

router.get(
  "/:organizationId",
  authenticate,
  authorize(Permission.ORGANIZATION_VIEW),
  requireOrganizationAccess,
  getOrganizationController,
);

router.patch(
  "/:organizationId",
  authenticate,
  authorize(Permission.ORGANIZATION_UPDATE),
  requireOrganizationAccess,
  updateOrganizationController,
);

router.delete(
  "/:organizationId",
  authenticate,
  authorize(Permission.ORGANIZATION_DELETE),
  requireOrganizationAccess,
  deleteOrganizationController,
);

export default router;
