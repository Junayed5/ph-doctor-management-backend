import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const routes = Router();

routes.post("/", ScheduleController.insertSchedule)

export const scheduleRouter = routes;