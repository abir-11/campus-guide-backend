import express from "express";
import { auth } from "../../middleware/auth";
import { campusAlertController } from "./campusAlert.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Public — active alerts only
router.get("/active", campusAlertController.getActiveAlerts);
router.get("/:id", campusAlertController.getSingleAlert);

// Admin — full list with filters
router.get("/", auth(Role.ADMIN), campusAlertController.getAllAlerts);

// Admin only — create / update / delete
router.post("/", auth(Role.ADMIN), campusAlertController.createAlert);
router.patch("/:id", auth(Role.ADMIN), campusAlertController.updateAlert);
router.delete("/:id", auth(Role.ADMIN), campusAlertController.deleteAlert);

export const campusAlertRoutes = router;
