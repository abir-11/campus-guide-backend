import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { campusAlertService } from "./campusAlert.service";

const createAlert = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.createAlertDB(req.body, req.user!.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Campus alert created successfully",
    data: result,
  });
});

const getAllAlerts = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.getAllAlertsDB(req.query as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Alerts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getActiveAlerts = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.getActiveAlertsDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active alerts retrieved successfully",
    data: result,
  });
});

const getSingleAlert = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.getSingleAlertDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Alert retrieved successfully",
    data: result,
  });
});

const updateAlert = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.updateAlertDB(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Alert updated successfully",
    data: result,
  });
});

const deleteAlert = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await campusAlertService.deleteAlertDB(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

export const campusAlertController = {
  createAlert,
  getAllAlerts,
  getActiveAlerts,
  getSingleAlert,
  updateAlert,
  deleteAlert,
};
