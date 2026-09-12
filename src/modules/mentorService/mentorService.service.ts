import { Prisma, Role } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IMentorServiceCreatePayload, IMentorServiceUpdatePayload } from "./mentorService.interface";





const createMentorServiceDB = async (
    userId: string,
    payload: IMentorServiceCreatePayload
) => {

    const { ...serviceData } = payload;




    const mentor = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            mentorProfile: true,
        },
    });


    if (!mentor) {
        throw new Error("Mentor not found");
    }


    if (mentor.role !== Role.MENTOR) {
        throw new Error("Only mentors can create services");
    }


    if (!mentor.mentorProfile) {
        throw new Error("Mentor profile not found");
    }


    if (mentor.mentorProfile.status !== "APPROVED") {
        throw new Error("Your mentor profile is not approved yet");
    }



    const newService = await prisma.service.create({
        data: {
            mentorId: mentor.id,
            mentorName: mentor.name,
            ...serviceData,
            status: "PENDING",
        },

        include: {
            mentor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });


    return newService;
};




const getAllMentorServicesDB = async (params: {
    page?: number | string;
    limit?: number | string;
    searchTerm?: string;
}) => {



    const page = Math.max(Number(params?.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params?.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;





    const andConditions: Prisma.ServiceWhereInput[] = [];

    // Only fetch APPROVED services
    andConditions.push({
        status: "APPROVED",
    });

    // Optional: Add searchTerm logic if needed
    if (params?.searchTerm) {
        const searchTerm = params.searchTerm.trim();
        andConditions.push({
            OR: [
                { mentorName: { contains: searchTerm, mode: "insensitive" } },
                // Add other searchable fields here like title, etc.
            ],
        });
    }

    const where: Prisma.ServiceWhereInput = {
        AND: andConditions,
    };




    const [services, total] = await Promise.all([
        prisma.service.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        mentorProfile: {
                            select: {
                                department: true,
                                rating: true,
                                sessions: true,
                                mobile: true,
                                bio: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.service.count({
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
        data: services,
    };
};



const getMentorServiceByIdDB = async (
    serviceId: string
) => {

    const service = await prisma.service.findFirst({
        where: {
            id: serviceId,
            status: "APPROVED",
        },
        include: {
            mentor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    mentorProfile: {
                        select: {
                            department: true,
                            rating: true,
                            sessions: true,
                            mobile: true,
                            bio: true,
                        },
                    },
                },
            },
        },
    });


    if (!service) {
        throw new Error("Service not found or not approved");
    }


    return service;
};



const updateMentorServiceDB = async (
    serviceId: string,
    userId: string,
    userRole: string,
    payload: IMentorServiceUpdatePayload
) => {


    const existingService = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
    });


    if (!existingService) {
        throw new Error("Service not found");
    }


    if (userRole !== "MENTOR" && userRole !== "ADMIN") {
        throw new Error("You are not authorized");
    }



    const { status, ...serviceData } = payload;
    const updateData: Prisma.ServiceUpdateInput = {
        ...serviceData,
        ...(status !== undefined
            ? { status: status as typeof existingService.status }
            : {}),
    };


    if (userRole === "MENTOR") {

        if (existingService.mentorId !== userId) {
            throw new Error("You can only update your own service");
        }

        // Mentors cannot directly approve their service updates
        delete updateData.status;
        updateData.status = "PENDING";
    }




    const updatedService = await prisma.service.update({
        where: {
            id: serviceId,
        },
        data: updateData,
        include: {
            mentor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });


    return updatedService;
};




const deleteMentorServiceDB = async (
    serviceId: string,
    userId: string,
    userRole: string
) => {



    const existingService = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
    });


    if (!existingService) {
        throw new Error("Service not found");
    }


    if (userRole !== "MENTOR" && userRole !== "ADMIN") {
        throw new Error("You are not authorized");
    }


    if (userRole === "MENTOR" && existingService.mentorId !== userId) {
        throw new Error("You can only delete your own service");
    }



    await prisma.service.delete({
        where: {
            id: serviceId,
        },
    });


    return {
        message: "Service deleted successfully",
    };
};


export const mentorServiceServices = {
    createMentorServiceDB,
    getAllMentorServicesDB,
    getMentorServiceByIdDB,
    updateMentorServiceDB,
    deleteMentorServiceDB,
};