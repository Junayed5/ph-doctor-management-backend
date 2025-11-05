import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { ICreatePatientInput } from "./user.type";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../../config";
import { IOptions, paginationHelpers } from "../../helper/paginationHelpers";
import { Prisma, UserRole } from "@prisma/client";
import { userSearchableFields } from "./user.constance";

const getAllFromDB = async (params: any, options: IOptions) => {
  // Get pagination params
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // Separate search term and filter data
  const { searchTerm, ...filterData } = params;

  // Remove pagination related fields from filter data
  const sanitizedFilterData = { ...filterData };
  delete sanitizedFilterData.page;
  delete sanitizedFilterData.limit;
  delete sanitizedFilterData.sortBy;
  delete sanitizedFilterData.sortOrder;

  const andConditions: Prisma.UserWhereInput[] = [];

  // Handle search term
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle other filters
  if (Object.keys(sanitizedFilterData).length > 0) {
    andConditions.push({
      AND: Object.keys(sanitizedFilterData).map((key) => ({
        [key]: {
          equals: sanitizedFilterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadFile = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadFile?.secure_url;
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

  return result;
};
const createDoctor = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};
const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadFile = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadFile?.secure_url;
  }

  const { password } = req.body;

  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));

  const userData = {
    email: req.body.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    return await tnx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};

export const UserService = {
  getAllFromDB,
  createPatient,
  createAdmin,
  createDoctor,
};
