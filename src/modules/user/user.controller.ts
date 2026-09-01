import {
    Request,
    Response,
    NextFunction,
} from "express";

import httpStatus from "http-status";


import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const createUser = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await userService.createUserDB(
                req.body
            );


        sendResponse(res, {

            success: true,

            statusCode: httpStatus.CREATED,

            message: "User created successfully",

            data: {
                result,
            },
        });
    }
);


// ======================================================
// GET ALL USERS
// ======================================================

const getAllUsers = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await userService.getAllUsersDB(
                req.query
            );

        sendResponse(res, {

            success: true,

            statusCode: httpStatus.OK,

            message: "Users retrieved successfully",

            meta: result.meta,

            data: result.data,
        });
    }
);


// ======================================================
// GET SINGLE USER
// ======================================================

const getSingleUser = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await userService.getSingleUserDB(
                req.params.id as string
            );

        sendResponse(res, {

            success: true,

            statusCode: httpStatus.OK,

            message: "User retrieved successfully",

            data: {
                result,
            },
        });
    }
);


// ======================================================
// GET ME
// ======================================================

const getMe = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await userService.getMe(
                req.user?.id as string
            );

        sendResponse(res, {

            success: true,

            statusCode: httpStatus.OK,

            message: "User profile retrieved successfully",

            data: {
                result,
            },
        });
    }
);


// ======================================================
// UPDATE USER
// ======================================================

const updateUser = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result =
            await userService.updateUserDB(
                req.params.id as string,
                req.body
            );

        sendResponse(res, {

            success: true,

            statusCode: httpStatus.OK,

            message: "User updated successfully",

            data: {
                result,
            },
        });
    }
);


// ======================================================
// DELETE USER
// ======================================================

const deleteUser = catchAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        await userService.deleteUserDB(
            req.params.id as string
        );

        sendResponse(res, {

            success: true,

            statusCode: httpStatus.OK,

            message: "User deleted successfully",

            data: null,
        });
    }
);


export const userController = {

    getAllUsers,

    getSingleUser,
    createUser,

    getMe,

    updateUser,

    deleteUser,
};