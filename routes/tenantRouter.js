import express from 'express';
import { registerTenant, upgradeTenant } from '../controllers/tenantController.js';
import { adminOnly, authUser } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/register", registerTenant);

router.post("/:slug/upgrade", authUser, adminOnly , upgradeTenant);

export default router;