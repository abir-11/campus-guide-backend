import express from "express";
import { auth } from "../../middleware/auth";
import { resourceController } from "./resource.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Public
router.get("/public", resourceController.getPublicResources);
router.get("/:id", resourceController.getSingleResource);
router.get("/", auth(), resourceController.getAllResources);

// Admin only
router.post("/", auth(Role.ADMIN), resourceController.createResource);
router.patch("/:id", auth(Role.ADMIN), resourceController.updateResource);
router.delete("/:id", auth(Role.ADMIN), resourceController.deleteResource);

export const resourceRoutes = router;
