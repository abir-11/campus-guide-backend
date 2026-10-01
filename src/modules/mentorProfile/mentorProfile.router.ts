import express from "express";
import { mentorProfileController } from "./mentorProfile.controller";
import { Role } from "../../../prisma/generated/prisma/client"; // তোমার প্রিজমা রোলের পাথ
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post(
    "/apply",
     auth(Role.STUDENT), 
    mentorProfileController.applyForMentor
);

router.get(
    "/pending-applications",
    auth(Role.ADMIN,Role.STUDENT), 
    mentorProfileController.getPendingApplications
);

router.patch(
    "/:id/status",
     auth(Role.ADMIN), 
    mentorProfileController.updateApplicationStatus
);

export const mentorProfileRoutes = router;