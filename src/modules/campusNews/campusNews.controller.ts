import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { campusNewsService } from "./campusNews.service";

const createNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.createNewsDB(req.body, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Campus news created successfully",
    data: result,
  });
});

const getAllNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.getAllNewsDB(req.query as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "News retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPublishedNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.getPublishedNewsDB(req.query as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Published news retrieved successfully",
    data: result,
  });
});

const getSingleNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.getSingleNewsDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "News retrieved successfully",
    data: result,
  });
});

const updateNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.updateNewsDB(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "News updated successfully",
    data: result,
  });
});

const deleteNews = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusNewsService.deleteNewsDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const campusNewsController = {
  createNews,
  getAllNews,
  getPublishedNews,
  getSingleNews,
  updateNews,
  deleteNews,
};
