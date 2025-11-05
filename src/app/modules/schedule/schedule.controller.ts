import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";

const insertSchedule = async (req: Request, res: Response) => {
    const result = await ScheduleService.insertSchedule(req.body);

    sendResponse(res,{
        statusCode: 201,
        message: "Schedule Created Successfully",
        success: true,
        data: result
    })
}

export const ScheduleController = {
    insertSchedule
}