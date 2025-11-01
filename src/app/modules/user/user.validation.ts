import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.string({
      error: "Email is required",
    }),
    address: z.string().optional(),
  }),
});
const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.string({
      error: "Email is required",
    }),
    contactNumber: z.string({
      error: "Contact Number is required"
    })
  }),
});
const createDoctorValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.string({
      error: "Email is required",
    }),
    contactNumber: z.string({
      error: "Contact Number is required"
    })
  }),
});

export const UserValidation = {
    createPatientValidationSchema,
    createAdminValidationSchema,
    createDoctorValidationSchema
}
