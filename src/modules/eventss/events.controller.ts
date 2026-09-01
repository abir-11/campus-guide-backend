import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { EventService } from "./events.service";
import { sendResponse } from "../../utils/sendResponse";

const createEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const result = await EventService.createEventDB(
            req.body,
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Event created successfully",
            data: {
                result,
            },
        });
    }
);

// GET ALL
const getAllEvents = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = await EventService.getAllEventsDB(
            req.query
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Events retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }
);


// GET SINGLE
const getSingleEvent = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = await EventService.getSingleEventDB(
            req.params?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Event retrieved successfully",
            data: {
                result,
            },
        });
    }
);


// UPDATE
const updateEvent = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = await EventService.updateEventDB(
            req.params?.id as string,
            req.body,
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Event updated successfully",
            data: {
                result,
            },
        });
    }
);


// DELETE
const deleteEvent = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        await EventService.deleteEventDB(
            req.params?.id as string,
            req.user?.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Event deleted successfully",
            data: null,
        });
    }
);


export const EventController = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
};

