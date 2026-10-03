import { Request, Response, NextFunction } from "express";
import httpStatus          from "http-status";
import { catchAsync }      from "../../utils/catchAsync";
import { sendResponse }    from "../../utils/sendResponse";
import { paymentService }  from "./payment.service";

const getAllPayments = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.getAllPaymentsDB(req.query as any);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payments retrieved", meta: result.meta, data: result.data });
});

const getPaymentStats = catchAsync(async (_req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.getPaymentStatsDB();
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment stats", data: result });
});

const getMyPayments = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.getMyPaymentsDB(req.user!.id);
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payments retrieved", data: result });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.getSinglePaymentDB(
        req.params.id as string, req.user!.id, req.user!.role as string
    );
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment retrieved", data: result });
});

const confirmPayment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.confirmPaymentDB(
        req.params.id as string, req.user!.id, req.user!.role as string, req.body
    );
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment confirmed and held", data: result });
});

const releasePayment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.releasePaymentDB(
        req.params.id as string, req.user!.id, req.user!.role as string
    );
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment released to mentor", data: result });
});

const refundPayment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
    const result = await paymentService.refundPaymentDB(
        req.params.id as string, req.user!.role as string
    );
    sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment refunded", data: result });
});

export const paymentController = {
    getAllPayments,
    getPaymentStats,
    getMyPayments,
    getSinglePayment,
    confirmPayment,
    releasePayment,
    refundPayment,
};
