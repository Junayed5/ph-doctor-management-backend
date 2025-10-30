import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { ICreatePatientInput } from "./user.type";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../../config";

const createPatient = async (req: Request) => {

  if (req.file) {
    const uploadFile = await fileUploader.uploadToCloudinary(req.file)
    req.body.patient.profilePhoto = uploadFile?.secure_url
  }

  const { password } = req.body;

  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result
};

export const UserService = {
  createPatient,
};
