import { Gender } from "@prisma/client";

export type IDoctorUpdateInput = {
  email: string;
  gender: Gender;
  appointmentFee: number;
  contactNumber: string;
  name: string;
  profilePhoto: string | null;
  address: string;
  registrationNumber: string;
  experience: number;
  qualification: string;
  currentWorkplace: string;
  designation: string;
  isDeleted: boolean;

  specialties: {
    specialtyId: string;
    isDeleted?: boolean;
  }[];
};
