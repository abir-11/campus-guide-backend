import express from "express";
import { homeContentController } from "./homeContent.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get(
    "/",
    homeContentController.getHomeContent
);

router.patch(
    "/",
    auth("ADMIN"),
    homeContentController.updateHomeContent
);

export const homeContentRoutes = router;