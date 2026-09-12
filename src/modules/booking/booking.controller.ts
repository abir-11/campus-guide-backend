import {
    Request,
    Response,
    NextFunction,
} from "express";

import httpStatus from "http-status";

import { bookingService } from "./booking.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createBooking = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await bookingService.createBookingDB(
            req.user?.id as string,
            req.body
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Booking created successfully",
            data: result,
        });
    }
);

const getMyBookings = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await bookingService.getMyBookingsDB(
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Bookings retrieved successfully",
            data: result,
        });
    }
);

const updateBooking = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await bookingService.updateBookingDB(
            req.params.id as string,
            req.user?.id as string,
            req.user?.role as string,
            req.body
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Booking updated successfully",
            data: result,
        });
    }
);

const deleteBooking = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await bookingService.deleteBookingDB(
            req.params.id as string,
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: result.message,
            data: null,
        });
    }
);

export const bookingController = {
    createBooking,
    getMyBookings,
    updateBooking,
    deleteBooking,
};