import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const routes = Router();

routes.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.scheduleForDoctor
);
routes.post("/", auth(UserRole.ADMIN), ScheduleController.insertSchedule);
routes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ScheduleController.deleteScheduleFromDB
);

export const scheduleRouter = routes;
