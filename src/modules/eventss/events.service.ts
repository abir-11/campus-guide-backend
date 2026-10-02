import { EventStatus, Role } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IEvent } from "./events.interface";

const createEventDB = async (
    payload: IEvent,
    userId: string
) => {

    // Check logged-in user
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isAutoApproved =
        user.role === Role.ADMIN;

    const event = await prisma.events.create({
        data: {
            title: payload.title,
            description: payload.description,
            location: payload.location,

            // Admin & Faculty → UPCOMING
            // Student → PENDING
            status: isAutoApproved
                ? EventStatus.UPCOMING
                : EventStatus.PENDING,

            // Admin & Faculty → own ID
            // Student → null
            approvedBy: isAutoApproved
                ? user.id
                : null,

            // Event creator
            createdBy: user.id,
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

    return event;
};

const getAllEventsDB = async (params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: EventStatus;
}) => {

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const { searchTerm, status } = params;

    const andConditions: any[] = [];

    // Search
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    location: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // Status filter
    if (status) {
        andConditions.push({
            status,
        });
    }

    const where = {
        AND: andConditions,
    };

    const [events, total] = await Promise.all([
        prisma.events.findMany({
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

        prisma.events.count({
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

        data: events,
    };
};

const getSingleEventDB = async (eventId: string) => {

    const event = await prisma.events.findUnique({
        where: {
            id: eventId,
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

    if (!event) {
        throw new Error("Event not found");
    }

    return event;
};

const updateEventDB = async (
    eventId: string,
    payload: IEvent,
    userId: string
) => {

    const event = await prisma.events.findUnique({
        where: {
            id: eventId,
        },
    });

    if (!event) {
        throw new Error("Event not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Only creator, ADMIN or FACULTY can update
    const isOwner = event.createdBy === user.id;
    const isAdminOrFaculty =
        user.role === "ADMIN";

    if (!isOwner && !isAdminOrFaculty) {
        throw new Error(
            "You are not authorized to update this event"
        );
    }

    const updatedEvent = await prisma.events.update({
        where: {
            id: eventId,
        },

        data: {
            title: payload.title,
            description: payload.description,
            location: payload.location,
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

    return updatedEvent;
};
const deleteEventDB = async (
    eventId: string,
    userId: string
) => {

    const event = await prisma.events.findUnique({
        where: {
            id: eventId,
        },
    });

    if (!event) {
        throw new Error("Event not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isOwner = event.createdBy === user.id;

    const isAdminOrFaculty =
        user.role === "ADMIN";

    if (!isOwner && !isAdminOrFaculty) {
        throw new Error(
            "You are not authorized to delete this event"
        );
    }

    await prisma.events.delete({
        where: {
            id: eventId,
        },
    });

    return null;
};

export const EventService = {
    createEventDB,
    getAllEventsDB,
    getSingleEventDB,
    updateEventDB,
    deleteEventDB,
};