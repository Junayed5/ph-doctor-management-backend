import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const routes = Router();

routes.get("/",auth(UserRole.ADMIN, UserRole.DOCTOR), ScheduleController.scheduleForDoctor)
routes.post("/", ScheduleController.insertSchedule)
routes.delete("/:id", ScheduleController.deleteScheduleFromDB)


export const scheduleRouter = routes;