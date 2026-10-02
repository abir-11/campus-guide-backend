import express from "express";
import { auth } from "../../middleware/auth";
import { EventController } from "./events.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
    "/create",
    auth(Role.ADMIN),
    EventController.createEvent
);
router.get(
    "/",auth(),
    EventController.getAllEvents
);


// Get Single Event
router.get(
    "/:id",auth(),
    EventController.getSingleEvent
);

router.patch(
    "/:id",
    auth( Role.ADMIN),
    EventController.updateEvent
);

// Delete Event
router.delete(
    "/:id",
    auth( Role.ADMIN),
    EventController.deleteEvent
);

export const EventRoutes = router;