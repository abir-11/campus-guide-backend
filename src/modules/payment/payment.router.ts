import express from "express";
import { auth }               from "../../middleware/auth";
import { paymentController }  from "./payment.controller";
import { Role }               from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Admin only
router.get(  "/stats",       auth(Role.ADMIN), paymentController.getPaymentStats);
router.get(  "/",            auth(Role.ADMIN), paymentController.getAllPayments);
router.post( "/:id/release", auth(Role.ADMIN), paymentController.releasePayment);
router.post( "/:id/refund",  auth(Role.ADMIN), paymentController.refundPayment);

// Authenticated users
router.get(  "/my",    auth(),  paymentController.getMyPayments);
router.get(  "/:id",   auth(),  paymentController.getSinglePayment);
router.post( "/:id/confirm", auth(), paymentController.confirmPayment);

export const paymentRoutes = router;
