import { v4 as uuidv4 } from "uuid"
import { IJWTPayload } from "../../../types/commonTypes"
import { prisma } from "../../shared/prisma"

const createAppointment = async (user: IJWTPayload, payload: { doctorId: string, scheduleId: string }) => {
    // console.log({ user, payload })
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    })

    // const isBookedOrNot = await prisma.doctorSchedule.findFirstOrThrow({
    //     where: {
    //         doctorId: payload.doctorId,
    //         scheduleId: payload.scheduleId
    //     }
    // })

    const videoCallingId = uuidv4()

    console.log({
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId
    })

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        })

        await tnx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        const transactionId = uuidv4();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })


        return appointmentData
    })



    return result
}

export const AppointmentService = {
    createAppointment
}