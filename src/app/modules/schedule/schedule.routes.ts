import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const routes = Router();

routes.get("/", ScheduleController.scheduleForDoctor)
routes.post("/", ScheduleController.insertSchedule)


export const scheduleRouter = routes;