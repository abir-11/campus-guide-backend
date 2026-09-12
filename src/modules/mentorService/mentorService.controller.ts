import {
    Request,
    Response,
    NextFunction,
} from "express";

import httpStatus from "http-status";

import { mentorServiceServices } from "./mentorService.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createMentorService = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await mentorServiceServices.createMentorServiceDB(
                req.user?.id as string,
                req.body
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Mentor service created successfully",
            data: {
                result,
            },
        });
    }
);

const getAllMentorServices = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await mentorServiceServices.getAllMentorServicesDB(
                req.query
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor services retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getMentorServiceById = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await mentorServiceServices.getMentorServiceByIdDB(
                req.params.id as string
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor service retrieved successfully",
            data: {
                result,
            },
        });
    }
);

const updateMentorService = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await mentorServiceServices.updateMentorServiceDB(
                req.params.id as string,
                req.user?.id as string,
                req.user?.role as string,
                req.body
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor service updated successfully",
            data: {
                result,
            },
        });
    }
);

const deleteMentorService = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        await mentorServiceServices.deleteMentorServiceDB(
            req.params.id as string,
            req.user?.id as string,
            req.user?.role as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor service deleted successfully",
            data: null,
        });
    }
);

export const mentorServiceController = {
    createMentorService,
    getAllMentorServices,
    getMentorServiceById,
    updateMentorService,
    deleteMentorService,
};