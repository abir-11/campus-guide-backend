import { prisma } from "../../lib/prisma";
import { 
    IBookingCreatePayload, 
    IBookingActionPayload,
    validateCreateBooking,
    validateBookingAction 
} from "./booking.interface";


const createBookingDB = async (
    studentId: string, 
    payload: IBookingCreatePayload
) => {

    const data = validateCreateBooking(payload);

    const student = await prisma.user.findUnique({
        where: {
            id: studentId,
        },
    });

    if (!student) {
        throw new Error("Student not found");
    }

    if (student.role !== "STUDENT") {
        throw new Error("Only students can create bookings");
    }

    const service = await prisma.service.findUnique({
        where: {
            id: data.serviceId,
        },
        include: {
            mentor: {
                include: {
                    mentorProfile: true,
                },
            },
        },
    });

    if (!service) {
        throw new Error("Service not found");
    }

    if (service.status !== "APPROVED") {
        throw new Error("This service is not available for booking");
    }

    if (service.mentorId === studentId) {
        throw new Error("You cannot book your own service");
    }

    if (!service.mentor.mentorProfile || service.mentor.mentorProfile.status !== "APPROVED") {
        throw new Error("Mentor is not currently approved");
    }

    return prisma.booking.create({
        data: {
            serviceId: service.id,
            mentorId: service.mentorId,
            studentId,
            date: data.date,
            time: data.time,
            notes: data.notes,
            status: "PENDING",
        },
        include: {
            service: true,
            mentor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
};



const getMyBookingsDB = async (userId: string) => {
    
    return prisma.booking.findMany({
        where: {
            OR: [
                { studentId: userId },
                { mentorId: userId },
            ],
        },
        include: {
            service: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                    description: true,
                    fee: true,
                    image: true,
                },
            },
            mentor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};



const updateBookingDB = async (
    bookingId: string,
    userId: string,
    userRole: string,
    payload: IBookingActionPayload
) => {

    const { action } = validateBookingAction(payload);

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (userRole === "MENTOR") {
        if (booking.mentorId !== userId) {
            throw new Error("You can only manage your own bookings");
        }

        if (booking.status !== "PENDING") {
            throw new Error("This booking can no longer be processed");
        }

        if (action === "accept") {
            return prisma.booking.update({
                where: { id: bookingId },
                data: { status: "ACCEPTED" },
            });
        }

        if (action === "reject") {
            return prisma.booking.update({
                where: { id: bookingId },
                data: { status: "REJECTED" },
            });
        }

        throw new Error("Mentor can only accept or reject booking");
    }

    if (userRole === "STUDENT") {
        if (booking.studentId !== userId) {
            throw new Error("You can only manage your own bookings");
        }

        if (action !== "confirm") {
            throw new Error("Student can only confirm booking");
        }

        if (booking.status !== "ACCEPTED") {
            throw new Error("Only accepted bookings can be confirmed");
        }

        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });
    }

    throw new Error("You are not authorized");
};


const deleteBookingDB = async (
    bookingId: string,
    studentId: string
) => {

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.studentId !== studentId) {
        throw new Error("You can only cancel your own booking");
    }

    if (booking.status !== "PENDING") {
        throw new Error("Only pending bookings can be cancelled");
    }

    await prisma.booking.delete({
        where: {
            id: bookingId,
        },
    });

    return {
        message: "Booking cancelled successfully",
    };
};



export const bookingService = {
    createBookingDB,
    getMyBookingsDB,
    updateBookingDB,
    deleteBookingDB,
};