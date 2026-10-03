import { Request, Response } from "express";
import { mentorProfileServices } from "./mentorProfile.sevices";

const applyForMentor = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; 
        const payload = req.body;

        const result = await mentorProfileServices.applyForMentorDB(userId, payload);
        
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Mentor application submitted successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to submit application",
        });
    }
};


const getPendingApplications = async (req: Request, res: Response) => {
    try {
        const result = await mentorProfileServices.getPendingMentorApplicationsDB(req.query);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Pending mentor applications retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to retrieve applications",
        });
    }
};


const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // profile ID
        const adminRole = (req as any).user.role;
        const payload = req.body; 

        const result = await mentorProfileServices.updateMentorApplicationStatusDB(
            id as string,
            adminRole,
            payload
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: `Mentor application ${payload.status.toLowerCase()} successfully`,
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update application status",
        });
    }
};
const getApprovedMentors = async (req: Request, res: Response) => {
  try {
    const result = await mentorProfileServices.getApprovedMentorsDB(req.query);

    res.status(200).json({
      success: true,
      message: "Approved mentors retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch approved mentors",
    });
  }
};
export const mentorProfileController = {
    applyForMentor,
    getPendingApplications,
    updateApplicationStatus,
    getApprovedMentors,
};