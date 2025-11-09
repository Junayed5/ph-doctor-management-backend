import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";
import { IJWTPayload } from "../../../types/commonTypes";

const insertSchedule = async (req: Request, res: Response) => {
  const result = await ScheduleService.insertSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Schedule Created Successfully",
    success: true,
    data: result,
  });
};

const scheduleForDoctor = async (req: Request & {user?: IJWTPayload}, res: Response) => {
  const options = pick(req.query, ["skip","page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDate", "endDate"]);

  const user = req.user;
  const result = await ScheduleService.scheduleForDoctor(user as IJWTPayload,options,filters);

  sendResponse(res, {
    statusCode: 201,
    message: "Doctor Schedule Retrieved Successfully",
    success: true,
    data: result,
  });
};

const deleteScheduleFromDB = async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    message: "Schedule deleted Successfully",
    success: true,
    data: result,
  });
};

export const ScheduleController = {
  insertSchedule,
  scheduleForDoctor,
  deleteScheduleFromDB
};
