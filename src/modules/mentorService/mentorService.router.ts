import express from "express";

import { mentorServiceController } from "./mentorService.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post(
    "/",
    auth("MENTOR"),
    mentorServiceController.createMentorService
);

router.get(
    "/",
    mentorServiceController.getAllMentorServices
);

router.get(
    "/:id",
    mentorServiceController.getMentorServiceById
);

router.patch(
    "/:id",
    auth("MENTOR", "ADMIN"),
    mentorServiceController.updateMentorService
);

router.delete(
    "/:id",
    auth("MENTOR", "ADMIN"),
    mentorServiceController.deleteMentorService
);

export const mentorServiceRoutes = router;