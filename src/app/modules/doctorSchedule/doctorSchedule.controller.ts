import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../../types/commonTypes";
import catchAsync from "../../shared/catchAsync";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(
      user as IJWTPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Doctor Schedule Created Successfully",
      success: true,
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
};
