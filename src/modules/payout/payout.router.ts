import express from "express";
import { auth }              from "../../middleware/auth";
import { payoutController }  from "./payout.controller";
import { Role }              from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.get(  "/",               auth(Role.ADMIN),  payoutController.getAllPayouts);
router.get(  "/my",             auth(Role.MENTOR), payoutController.getMyPayouts);
router.post( "/:id/process",    auth(Role.ADMIN),  payoutController.processPayout);
router.post( "/:id/mark-paid",  auth(Role.ADMIN),  payoutController.markPayoutPaid);

export const payoutRoutes = router;
