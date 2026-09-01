import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DepartmentService } from "./departments.service";


// ==========================================
// CREATE
// ==========================================

const createDepartment = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await DepartmentService.createDepartmentDB(
                req.body
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Department created successfully",
            data: {
                result,
            },
        });
    }
);


// ==========================================
// GET ALL
// ==========================================

const getAllDepartments = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await DepartmentService.getAllDepartmentsDB(
                req.query
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Departments retrieved successfully",

            meta: result.meta,

            data: result.data,
        });
    }
);


// ==========================================
// GET SINGLE
// ==========================================

const getSingleDepartment = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await DepartmentService.getSingleDepartmentDB(
                req.params.id as string
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Department retrieved successfully",

            data: {
                result,
            },
        });
    }
);


// ==========================================
// UPDATE
// ==========================================

const updateDepartment = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await DepartmentService.updateDepartmentDB(
                req.params.id as string,
                req.body
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Department updated successfully",

            data: {
                result,
            },
        });
    }
);


// ==========================================
// DELETE
// ==========================================

const deleteDepartment = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        await DepartmentService.deleteDepartmentDB(
            req.params.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Department deleted successfully",

            data: null,
        });
    }
);


export const DepartmentController = {
    createDepartment,
    getAllDepartments,
    getSingleDepartment,
    updateDepartment,
    deleteDepartment,
};