import { prisma }   from "../../lib/prisma";
import { IBookingCreatePayload,
    IBookingActionPayload,
    validateCreateBooking,
    validateBookingAction,
} from "./booking.interface";

// ── Platform fee (configurable via env) ──────────────────────────────────────
const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 10);

function calcFees(fee: { toNumber?: () => number } | number | string) {
    const total       = typeof fee === "object" && fee?.toNumber ? fee.toNumber() : Number(fee);
    const platformFee = parseFloat(((total * PLATFORM_FEE_PERCENT) / 100).toFixed(2));
    const mentorAmt   = parseFloat((total - platformFee).toFixed(2));
    return { total, platformFee, mentorAmt };
}

const bookingIncludes = {
    service: {
        select: { id: true, name: true, category: true, description: true, fee: true, image: true },
    },
    mentor: { select: { id: true, name: true, email: true } },
    student: { select: { id: true, name: true, email: true } },
    payment: true,
    payouts: true,
} as const;

// ── 1. Create Booking + Payment record ─────────────────────────────────────────
const createBookingDB = async (studentId: string, payload: IBookingCreatePayload) => {
    const data = validateCreateBooking(payload);

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student)               throw new Error("Student not found");
    if (student.role !== "STUDENT") throw new Error("Only students can create bookings");

    const service = await prisma.service.findUnique({
        where: { id: data.serviceId },
        include: { mentor: { include: { mentorProfile: true } } },
    });

    if (!service)                   throw new Error("Service not found");
    if (service.status !== "APPROVED")  throw new Error("This service is not available for booking");
    if (service.mentorId === studentId) throw new Error("You cannot book your own service");
    if (!service.mentor.mentorProfile || service.mentor.mentorProfile.status !== "APPROVED")
        throw new Error("Mentor is not currently approved");

    const fees = calcFees(service.fee);

    // Create Booking + Payment atomically
    return prisma.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                serviceId:     service.id,
                mentorId:      service.mentorId,
                studentId,
                date:          data.date,
                time:          data.time,
                notes:         data.notes,
                status:        "PENDING",
                amount:        fees.total,
                paymentStatus: "PENDING",
            },
        });

        await tx.payment.create({
            data: {
                bookingId:    booking.id,
                studentId,
                mentorId:     service.mentorId,
                amount:       fees.total,
                platformFee:  fees.platformFee,
                mentorAmount: fees.mentorAmt,
                status:       "PENDING",
            },
        });

        return tx.booking.findUnique({
            where: { id: booking.id },
            include: bookingIncludes,
        });
    });
};

// ── 2. Get My Bookings ─────────────────────────────────────────────────────────
const getMyBookingsDB = async (userId: string) => {
    return prisma.booking.findMany({
        where: { OR: [{ studentId: userId }, { mentorId: userId }] },
        include: bookingIncludes,
        orderBy: { createdAt: "desc" },
    });
};

// ── 3. Get Single Booking ──────────────────────────────────────────────────────
const getSingleBookingDB = async (bookingId: string, userId: string, userRole: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: bookingIncludes,
    });

    if (!booking) throw new Error("Booking not found");

    const isMentor  = booking.mentorId  === userId;
    const isStudent = booking.studentId === userId;
    const isAdmin   = userRole === "ADMIN";

    if (!isMentor && !isStudent && !isAdmin)
        throw new Error("You are not authorized to view this booking");

    return booking;
};

// ── 4. Update Booking Status ───────────────────────────────────────────────────
const updateBookingDB = async (
    bookingId: string,
    userId:    string,
    userRole:  string,
    payload:   IBookingActionPayload
) => {
    const { action } = validateBookingAction(payload);

    const booking = await prisma.booking.findUnique({
        where:   { id: bookingId },
        include: { payment: true },
    });

    if (!booking) throw new Error("Booking not found");

    // ── MENTOR actions ────────────────────────────────────────────────────────
    if (userRole === "MENTOR") {
        if (booking.mentorId !== userId)
            throw new Error("You can only manage your own bookings");

        if (action === "accept") {
            if (booking.status !== "PENDING")
                throw new Error("Only PENDING bookings can be accepted");

            // Accept → mark payment as HELD (simulated hold; real gateway integration here)
            return prisma.$transaction(async (tx) => {
                const updated = await tx.booking.update({
                    where: { id: bookingId },
                    data:  { status: "ACCEPTED", paymentStatus: "HELD" },
                });
                if (booking.payment) {
                    await tx.payment.update({
                        where: { id: booking.payment.id },
                        data:  { status: "HELD", heldAt: new Date() },
                    });
                }
                return updated;
            });
        }

        if (action === "reject") {
            if (booking.status !== "PENDING")
                throw new Error("Only PENDING bookings can be rejected");

            return prisma.$transaction(async (tx) => {
                const updated = await tx.booking.update({
                    where: { id: bookingId },
                    data:  { status: "REJECTED", paymentStatus: "FAILED" },
                });
                if (booking.payment) {
                    await tx.payment.update({
                        where: { id: booking.payment.id },
                        data:  { status: "FAILED" },
                    });
                }
                return updated;
            });
        }

        if (action === "start") {
            if (booking.status !== "CONFIRMED")
                throw new Error("Only CONFIRMED bookings can be started");

            return prisma.booking.update({
                where: { id: bookingId },
                data:  { status: "IN_PROGRESS" },
            });
        }

        if (action === "complete") {
            if (booking.status !== "IN_PROGRESS")
                throw new Error("Only IN_PROGRESS bookings can be marked complete by mentor");

            // Mentor signals completion — student must confirm to release payment
            return prisma.booking.update({
                where: { id: bookingId },
                data:  { status: "CONFIRMED" },   // re-use CONFIRMED as "awaiting student confirm"
            });
        }

        throw new Error("Invalid action for mentor");
    }

    // ── STUDENT actions ───────────────────────────────────────────────────────
    if (userRole === "STUDENT") {
        if (booking.studentId !== userId)
            throw new Error("You can only manage your own bookings");

        if (action === "confirm") {
            if (booking.status !== "ACCEPTED")
                throw new Error("Only ACCEPTED bookings can be confirmed by student");

            return prisma.booking.update({
                where: { id: bookingId },
                data:  { status: "CONFIRMED" },
            });
        }

        if (action === "student_complete") {
            // Student confirms completion → release payment
            if (booking.status !== "CONFIRMED")
                throw new Error("Booking must be CONFIRMED to mark as completed");

            return prisma.$transaction(async (tx) => {
                const updated = await tx.booking.update({
                    where: { id: bookingId },
                    data:  { status: "COMPLETED", paymentStatus: "RELEASED" },
                });

                if (booking.payment) {
                    const now = new Date();
                    await tx.payment.update({
                        where: { id: booking.payment.id },
                        data:  { status: "RELEASED", releasedAt: now, paidAt: now },
                    });
                    // Create payout record for mentor
                    await tx.payout.create({
                        data: {
                            paymentId:  booking.payment.id,
                            bookingId,
                            mentorId:   booking.mentorId,
                            amount:     booking.payment.mentorAmount,
                            status:     "PENDING",
                        },
                    });
                }

                return updated;
            });
        }

        if (action === "cancel") {
            if (!["PENDING", "ACCEPTED"].includes(booking.status))
                throw new Error("Only PENDING or ACCEPTED bookings can be cancelled");

            return prisma.$transaction(async (tx) => {
                const updated = await tx.booking.update({
                    where: { id: bookingId },
                    data:  { status: "CANCELLED", paymentStatus: "REFUNDED" },
                });
                if (booking.payment) {
                    await tx.payment.update({
                        where: { id: booking.payment.id },
                        data:  { status: "REFUNDED", refundedAt: new Date() },
                    });
                }
                return updated;
            });
        }

        throw new Error("Invalid action for student");
    }

    throw new Error("You are not authorized");
};

// ── 5. Delete (cancel PENDING) ────────────────────────────────────────────────
const deleteBookingDB = async (bookingId: string, studentId: string) => {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking)                    throw new Error("Booking not found");
    if (booking.studentId !== studentId) throw new Error("You can only cancel your own booking");
    if (booking.status !== "PENDING")    throw new Error("Only PENDING bookings can be cancelled");

    await prisma.$transaction(async (tx) => {
        await tx.payment.deleteMany({ where: { bookingId } });
        await tx.booking.delete({ where: { id: bookingId } });
    });

    return { message: "Booking cancelled successfully" };
};

export const bookingService = {
    createBookingDB,
    getMyBookingsDB,
    getSingleBookingDB,
    updateBookingDB,
    deleteBookingDB,
};
