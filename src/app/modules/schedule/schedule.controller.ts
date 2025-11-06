import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";

const insertSchedule = async (req: Request, res: Response) => {
  const result = await ScheduleService.insertSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Schedule Created Successfully",
    success: true,
    data: result,
  });
};
const scheduleForDoctor = async (req: Request, res: Response) => {
  const options = pick(req.query, ["skip","page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDate", "endDate"]);

  const result = await ScheduleService.scheduleForDoctor(options,filters);

  sendResponse(res, {
    statusCode: 201,
    message: "Schedule Created Successfully",
    success: true,
    data: result,
  });
};

export const ScheduleController = {
  insertSchedule,
  scheduleForDoctor,
};
