import { prisma } from "../../shared/prisma";
import { ICreatePatientInput } from "./user.type";
import bcrypt from "bcryptjs";

const createPatient = async (payload: ICreatePatientInput) => {
  const { name, email, password } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        name,
        email
      },
    });
  });

  return result
};

export const UserService = {
  createPatient,
};
