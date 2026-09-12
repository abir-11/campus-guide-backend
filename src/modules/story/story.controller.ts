import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { storyService } from "./story.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createStory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await storyService.createStoryDB(req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Story created successfully",
            data: result,
        });
    }
);

const getPublishedStories = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await storyService.getPublishedStoriesDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Stories retrieved successfully",
            data: result,
        });
    }
);

const updateStory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await storyService.updateStoryDB(
            req.params.id as string,
            req.body
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Story updated successfully",
            data: result,
        });
    }
);

const deleteStory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await storyService.deleteStoryDB(req.params.id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: result.message,
            data: null,
        });
    }
);

export const storyController = {
    createStory,
    getPublishedStories,
    updateStory,
    deleteStory,
};