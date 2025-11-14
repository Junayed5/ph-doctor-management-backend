import express from 'express';
import { userRouter } from '../modules/user/user.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { scheduleRouter } from '../modules/schedule/schedule.routes';
import { DoctorScheduleRouter } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { DoctorRouter } from '../modules/doctor/doctor.route';
import { AppointmentRouter } from '../modules/appointment/appointment.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/schedule',
        route: scheduleRouter
    },
    {
        path: '/doctor-schedule',
        route: DoctorScheduleRouter
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRouter
    },
    {
        path: '/appointment',
        route: AppointmentRouter
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;