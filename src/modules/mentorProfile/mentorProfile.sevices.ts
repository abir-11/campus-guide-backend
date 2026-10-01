import { Prisma, Role } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Interfaces for the payloads

export interface IMentorProfileCreatePayload {
    department: string;
    mobile: string;
    bio: string;

    cgpa: number;

    goodSubjects: string[];

    experience?: string;
    portfolio?: string;
}

export interface IMentorProfileStatusUpdate {
    status: "APPROVED" | "REJECTED";
}

const applyForMentorDB = async (
    userId: string,
    payload: IMentorProfileCreatePayload
) => {
    // 1. Check if the user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { mentorProfile: true },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.mentorProfile) {
        throw new Error(
            `You have already applied. Current status: ${user.mentorProfile.status}`
        );
    }

    // 3. Create the mentor profile with PENDING status
    const newProfile = await prisma.mentorProfile.create({
        data: {
            userId: user.id,
            ...payload,
            status: "PENDING", // Wait for Admin approval
            rating: 0,
            sessions: 0,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return newProfile;
};

const getPendingMentorApplicationsDB = async (params: {
  page?: number | string;
  limit?: number | string;
}) => {
  const page = Math.max(Number(params?.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(params?.limit) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const where: Prisma.MentorProfileWhereInput = {
    status: "PENDING",
  };

  const [applications, total] = await Promise.all([
    prisma.mentorProfile.findMany({
      where,
      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),

    prisma.mentorProfile.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },

    data: applications,
  };
};


const updateMentorApplicationStatusDB = async (
    profileId: string,
    adminRole: string,
    payload: IMentorProfileStatusUpdate
) => {
    if (adminRole !== Role.ADMIN) {
        throw new Error("Only admins can approve or reject mentor applications");
    }

    const { status } = payload;

    // 2. Find the pending profile
    const existingProfile = await prisma.mentorProfile.findUnique({
        where: { id: profileId },
    });

    if (!existingProfile) {
        throw new Error("Mentor profile application not found");
    }


    const result = await prisma.$transaction(async (tx) => {
        // Update the profile status
        const updatedProfile = await tx.mentorProfile.update({
            where: { id: profileId },
            data: { status },
        });

        if (status === "APPROVED") {
            await tx.user.update({
                where: { id: existingProfile.userId },
                data: { role: Role.MENTOR },
            });
        }

        return updatedProfile;
    });

    return result;
};

export const mentorProfileServices = {
    applyForMentorDB,
    getPendingMentorApplicationsDB,
    updateMentorApplicationStatusDB,
};