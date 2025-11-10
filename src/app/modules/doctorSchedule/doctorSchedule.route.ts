import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validationRequest";
import { doctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(
    doctorScheduleValidation.createDoctorScheduleValidationSchema
  ),
  DoctorScheduleController.insertIntoDB
);

export const DoctorScheduleRouter = router;
