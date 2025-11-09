import { IJWTPayload } from "../../../types/commonTypes";
import { prisma } from "../../shared/prisma";

const insertIntoDB = async(user: IJWTPayload, payload: {
    scheduleIds : string[]
}) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email: user.email
        }
    })

    const doctorScheduleData = await payload.scheduleIds.map(scheduleId => ({
        doctorId : doctorData.id,
        scheduleId
    }));

    return await prisma.doctorSchedule.createMany({
        data: doctorScheduleData
    })

}

export const DoctorScheduleService = {
    insertIntoDB
}