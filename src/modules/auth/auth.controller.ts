import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.userLogin(req.body);
    const { accessToken, refreshToken ,JwtPayload } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User login successfull",
        data: {
            accessToken,
            refreshToken,
            JwtPayload
        }
    })
})

export const authController={
    userLogin
}