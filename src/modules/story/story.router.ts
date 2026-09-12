import express from "express";
import { storyController } from "./story.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post(
    "/create",
    auth("ADMIN"),
    storyController.createStory
);

router.get(
    "/",
    storyController.getPublishedStories
);

router.patch(
    "/:id",
    auth("ADMIN"),
    storyController.updateStory
);

router.delete(
    "/:id",
    auth("ADMIN"),
    storyController.deleteStory
);

export const storyRoutes = router;