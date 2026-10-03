import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync }    from "../../utils/catchAsync";
import { sendResponse }  from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await bookingService.createBookingDB(req.user!.id, req.body);
    sendResponse(res, {
        success:    true,
        statusCode: httpStatus.CREATED,
        message:    "Booking created successfully",
        data:       result,
    });
});

const getMyBookings = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await bookingService.getMyBookingsDB(req.user!.id);
    sendResponse(res, {
        success:    true,
        statusCode: httpStatus.OK,
        message:    "Bookings retrieved successfully",
        data:       result,
    });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await bookingService.getSingleBookingDB(
        req.params.id as string,
        req.user!.id,
        req.user!.role as string
    );
    sendResponse(res, {
        success:    true,
        statusCode: httpStatus.OK,
        message:    "Booking retrieved successfully",
        data:       result,
    });
});

const updateBooking = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await bookingService.updateBookingDB(
        req.params.id as string,
        req.user!.id,
        req.user!.role as string,
        req.body
    );
    sendResponse(res, {
        success:    true,
        statusCode: httpStatus.OK,
        message:    "Booking updated successfully",
        data:       result,
    });
});

const deleteBooking = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await bookingService.deleteBookingDB(
        req.params.id as string,
        req.user!.id
    );
    sendResponse(res, {
        success:    true,
        statusCode: httpStatus.OK,
        message:    result.message,
        data:       null,
    });
});

export const bookingController = {
    createBooking,
    getMyBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
