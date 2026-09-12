import { prisma } from "../../lib/prisma";
import { IMentorStatusPayload, validateMentorStatus } from "./mentor.interface";

const getAllMentorsDB = async (userRole?: string, status?: string) => {
    const where: any = {};

    if (status) {
        if (userRole !== "ADMIN") {
            throw new Error("Only admin can filter mentor status");
        }

        const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

        if (!allowedStatuses.includes(status)) {
            throw new Error("Invalid mentor status");
        }

        where.status = status;
    } else {
        where.status = "APPROVED";
    }

    return prisma.mentor.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getMentorByIdDB = async (mentorId: string, userRole?: string) => {
    const mentor = await prisma.mentor.findUnique({
        where: {
            id: mentorId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
        },
    });

    if (!mentor) {
        throw new Error("Mentor not found");
    }

    if (mentor.status !== "APPROVED" && userRole !== "ADMIN") {
        throw new Error("Mentor not found");
    }

    return mentor;
};

const updateMentorDB = async (mentorId: string, payload: IMentorStatusPayload) => {
    const data = validateMentorStatus(payload);

    const mentor = await prisma.mentor.findUnique({
        where: {
            id: mentorId,
        },
    });

    if (!mentor) {
        throw new Error("Mentor not found");
    }

    return prisma.mentor.update({
        where: {
            id: mentorId,
        },
        data: {
            status: data.status as "PENDING" | "APPROVED" | "REJECTED",
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
};

export const mentorService = {
    getAllMentorsDB,
    getMentorByIdDB,
    updateMentorDB,
};