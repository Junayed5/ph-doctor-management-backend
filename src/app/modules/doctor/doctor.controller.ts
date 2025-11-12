import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../../types/commonTypes";
import catchAsync from "../../shared/catchAsync";
import { pick } from "../../helper/pick";
import { DoctorService } from "./doctor.service";
import { doctorFilterableField } from "./doctor.constant";

const getAllFromDB = catchAsync(
  async (req: Request , res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filter = pick(req.query, doctorFilterableField);

    const result = await DoctorService.getAllFromDB(filter, options);

    sendResponse(res, {
      statusCode: 200,
      message: "Doctor Retrieved Successfully",
      success: true,
      data: result.data,
      meta: result.meta
    });
  }
);
const updateIntoDB = catchAsync(
  async (req: Request , res: Response) => {
    const {id} = req.params
    const result = await DoctorService.updateIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      message: "Doctor Updated Successfully",
      success: true,
      data: result
    });
  }
);

export const DoctorController = {
  getAllFromDB,
  updateIntoDB
};
