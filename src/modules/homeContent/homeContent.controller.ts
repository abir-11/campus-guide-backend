import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { homeContentService } from "./homeContent.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getHomeContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await homeContentService.getHomeContentDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Home content retrieved successfully",
            data: result,
        });
    }
);

const updateHomeContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await homeContentService.updateHomeContentDB(req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Home content updated successfully",
            data: result,
        });
    }
);

export const homeContentController = {
    getHomeContent,
    updateHomeContent,
};