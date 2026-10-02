import express from "express";
import { auth } from "../../middleware/auth";
import { campusNewsController } from "./campusNews.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Public — published news only
router.get("/published", campusNewsController.getPublishedNews);
router.get("/:id", campusNewsController.getSingleNews);

// Admin — all news with filters
router.get("/", auth(Role.ADMIN), campusNewsController.getAllNews);

// Admin only — create / update / delete
router.post("/", auth(Role.ADMIN), campusNewsController.createNews);
router.patch("/:id", auth(Role.ADMIN), campusNewsController.updateNews);
router.delete("/:id", auth(Role.ADMIN), campusNewsController.deleteNews);

export const campusNewsRoutes = router;
