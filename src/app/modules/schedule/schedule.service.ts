import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { IOptions, paginationHelpers } from "../../helper/paginationHelpers";

const insertSchedule = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 30;
  const schedule = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTimes = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTimes = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTimes < endDateTimes) {
      const slotStartDateTime = startDateTimes;
      const slotEndDateTime = addMinutes(startDateTimes, intervalTime);

      const scheduleData = {
        startDate: slotStartDateTime,
        endDate: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedule.push(result);
      }

      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
};

const scheduleForDoctor = async (options: any, filters: any) => {
  const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
  const { startDate: filterStartDateTime, endDate: filterEndDateTime } =
    filters;

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andConditions.push({
      AND: [
        {
          startDate: {
            gte: filterStartDateTime,
          },
        },
        {
          endDate: {
            lte: filterEndDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.schedule.findMany({
    skip,
    take: limit,
    where: whereConditions,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      total,
      limit,
    },
    data: result,
  };
};

export const ScheduleService = {
  insertSchedule,
  scheduleForDoctor,
};
