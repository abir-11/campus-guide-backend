import express from "express";
import { mentorController } from "./mentor.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get(
    "/",
    mentorController.getAllMentors
);

router.get(
    "/:id",
    mentorController.getMentorById
);

router.patch(
    "/:id",
    auth("ADMIN"),
    mentorController.updateMentor
);

export const mentorRoutes = router;