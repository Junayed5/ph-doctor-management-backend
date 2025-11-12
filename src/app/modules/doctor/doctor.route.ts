import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
  "/",
//   auth(UserRole.DOCTOR),
//   validateRequest(
//     doctorScheduleValidation.createDoctorScheduleValidationSchema
//   ),
  DoctorController.getAllFromDB
);
router.put(
  "/:id",
  DoctorController.updateIntoDB
);

export const DoctorRouter = router;