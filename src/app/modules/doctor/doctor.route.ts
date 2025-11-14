import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
  "/",
  DoctorController.getAllFromDB
);
router.get(
  "/:id",
  DoctorController.findOneDoctorFromDB
);
router.post(
  "/suggestion",
  DoctorController.getAISuggestion
)
router.put(
  "/:id",
  DoctorController.updateIntoDB
);
router.delete(
  "/:id",
  DoctorController.deleteFromDB
);

export const DoctorRouter = router;