import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import { authorize } from "../../middleware/authorization.middleware";

import { Permission } from "../auth/auth.types";

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
  getOrganizationController,
);

router.patch(
  "/:organizationId",
  authenticate,
  authorize(Permission.ORGANIZATION_UPDATE),
  updateOrganizationController,
);

router.delete(
  "/:organizationId",
  authenticate,
  authorize(Permission.ORGANIZATION_DELETE),
  deleteOrganizationController,
);

export default router;
