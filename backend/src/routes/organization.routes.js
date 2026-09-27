import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { getOrganizationDetails } from "../controllers/OrganizationControllers/getOrganizationDetails.controller.js";
import { updateOrganizationController } from "../controllers/OrganizationControllers/updateOrganization.controller.js";
import { validateObjectIdParams } from "../middleware/security.middleware.js";

const router = express.Router();

/* PATCH /api/organization/update-organization/:orgId */
router.patch("/update-organization/:orgId", validateObjectIdParams("orgId"), authMiddleware, requireAdmin, requirePermission(PERMISSIONS.UPDATE_ORGANIZATION), updateOrganizationController);

/* GET /api/organization/get-organization-details */
router.get("/get-organization-details", authMiddleware, requirePermission(PERMISSIONS.VIEW_ORGANIZATION), getOrganizationDetails);

export default router;
