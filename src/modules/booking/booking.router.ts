import express from "express";
import { bookingController } from "./booking.controller";
import { auth }              from "../../middleware/auth";

const router = express.Router();

router.post(   "/create",  auth("STUDENT"),           bookingController.createBooking);
router.get(    "/",        auth(),                     bookingController.getMyBookings);
router.get(    "/:id",     auth(),                     bookingController.getSingleBooking);
router.patch(  "/:id",     auth("MENTOR", "STUDENT"),  bookingController.updateBooking);
router.delete( "/:id",     auth("STUDENT"),            bookingController.deleteBooking);

export const bookingRoutes = router;
