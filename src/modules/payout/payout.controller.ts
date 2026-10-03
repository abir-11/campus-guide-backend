import { Request, Response, NextFunction } from "express";
import httpStatus         from "http-status";
import { catchAsync }     from "../../utils/catchAsync";
import { sendResponse }   from "../../utils/sendResponse";
import { payoutService }  from "./payout.service";

const getAllPayouts = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await payoutService.getAllPayoutsDB(req.query as any);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payouts retrieved", meta: result.meta, data: result.data });
});

const getMyPayouts = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await payoutService.getMyPayoutsDB(req.user!.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Your payouts", data: result });
});

const processPayout = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await payoutService.processPayoutDB(req.params.id as string, req.user!.role as string);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payout processing", data: result });
});

const markPayoutPaid = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await payoutService.markPayoutPaidDB(req.params.id as string, req.user!.role as string);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payout marked as paid", data: result });
});

export const payoutController = { getAllPayouts, getMyPayouts, processPayout, markPayoutPaid };
