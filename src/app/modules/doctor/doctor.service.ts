import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelpers } from "../../helper/paginationHelpers";
import { doctorSearchableField } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { openai } from "../../helper/askOpenAi";

const getAllFromDB = async (filter: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filter;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterCondition);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIDs = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const specialty of deleteSpecialtyIDs) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }

      const createSpecialtyIDs = specialties.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialtyIDs) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });

    return updatedData;
  });
};

const findOneDoctorFromDB = async (id: string) => {
  const uniqueDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
    include:{
      doctorSchedules: {
        include: {
          schedule: true
        }
      }
    }
  });

  return uniqueDoctor;
};
const deleteFromDB = async (id: string) => {
  const deletedData = await prisma.doctor.delete({
    where: {
      id,
    },
  });

  return deletedData;
};

const getAISuggestion = async (payload: { symptoms: string }) => {
  if (!(payload && payload.symptoms)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Symptoms not found");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  console.log("analyzing.....");

  const prompt = `
You are a medical assistant AI trained to suggest the most suitable doctor specialty for a patient based on their symptoms.

Instructions:
- Carefully read the user's symptoms.
- Match them with the most relevant medical specialty.
- Only choose from the list of available specialties.
- If symptoms are general or unclear, suggest “General Physician”.
- Respond with only the name of the most relevant specialty (no explanation).

User Symptoms: "${payload.symptoms}"

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Now, Return your response in JSON format with full individual doctor data
`;

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  

  let aiRaw = completion.choices[0].message.content || "";

  try {
    // Remove code block markers if present
    aiRaw = aiRaw.replace(/```json|```/g, "").trim();

    const parsedData = JSON.parse(aiRaw);

    if (!Array.isArray(parsedData)) {
      throw new Error("Expected an array of doctors");
    }

    console.log("Parsed doctors:", parsedData.length);
    return parsedData;
  } catch (error) {
    console.error("AI returned invalid JSON:", error, "\nRaw data:", aiRaw);
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid AI response format");
  }
};

export const DoctorService = {
  getAllFromDB,
  getAISuggestion,
  updateIntoDB,
  findOneDoctorFromDB,
  deleteFromDB,
};
