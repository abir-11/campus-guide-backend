import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { mentorService } from "./mentor.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllMentors = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await mentorService.getAllMentorsDB(
            req.user?.role as string,
            req.query.status as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentors retrieved successfully",
            data: result,
        });
    }
);

const getMentorById = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await mentorService.getMentorByIdDB(
            req.params.id as string,
            req.user?.role as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor retrieved successfully",
            data: result,
        });
    }
);

const updateMentor = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = await mentorService.updateMentorDB(
            req.params.id as string,
            req.body
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Mentor status updated successfully",
            data: result,
        });
    }
);

export const mentorController = {
    getAllMentors,
    getMentorById,
    updateMentor,
};