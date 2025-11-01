import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";

const getAllFromDB = catchAsync(async(req: Request, res: Response) => {

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filter = pick(req.query, ["searchTerm", "role", "status"])

    const {page, limit, searchTerm, sortBy, sortOrder, role, status} = req.query;

    const result = await UserService.getAllFromDB({page: Number(page), limit: Number(limit), searchTerm, sortBy, sortOrder, role, status});

    sendResponse(res,{
        statusCode: 200,
        message: "User Retrieve Successfully",
        success: true,
        data: result
    })
})
const createPatient = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.createPatient(req);

    sendResponse(res,{
        statusCode: 201,
        message: "User Created Successfully",
        success: true,
        data: result
    })
})
const createAdmin = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res,{
        statusCode: 201,
        message: "Admin Created Successfully",
        success: true,
        data: result
    })
})

export const UserController = {
    getAllFromDB,
    createPatient,
    createAdmin
}