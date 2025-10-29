import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.services";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.createPatient(req.body)

    sendResponse(res,{
        statusCode: 201,
        message: "User Created Successfully",
        success: true,
        data: result
    })
})

export const UserController = {
    createPatient
}