import { IJWTPayload } from "../../../types/commonTypes"

const createAppointment = async(user: IJWTPayload, payload: {doctorId: string, scheduleId: string}) => {
    console.log({user, payload})
}

export const AppointmentService = {
    createAppointment
}