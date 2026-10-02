import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { resourceService } from "./resource.service";

const createResource = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.createResourceDB(req.body, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Resource created successfully",
    data: result,
  });
});

const getAllResources = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.getAllResourcesDB(req.query as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Resources retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPublicResources = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.getPublicResourcesDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Resources retrieved successfully",
    data: result,
  });
});

const getSingleResource = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.getSingleResourceDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Resource retrieved successfully",
    data: result,
  });
});

const updateResource = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.updateResourceDB(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Resource updated successfully",
    data: result,
  });
});

const deleteResource = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await resourceService.deleteResourceDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const resourceController = {
  createResource,
  getAllResources,
  getPublicResources,
  getSingleResource,
  updateResource,
  deleteResource,
};
