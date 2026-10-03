import { prisma } from "../../lib/prisma";
import { validatePaymentConfirm, IPaymentConfirmPayload } from "./payment.interface";

const paymentIncludes = {
    booking: {
        select: {
            id:     true,
            status: true,
            date:   true,
            time:   true,
            service: { select: { id: true, name: true, category: true, fee: true } },
        },
    },
    student: { select: { id: true, name: true, email: true } },
    mentor:  { select: { id: true, name: true, email: true } },
    payouts: true,
} as const;

// ── Admin: Get all payments ───────────────────────────────────────────────────
const getAllPaymentsDB = async (params: {
    page?:   number;
    limit?:  number;
    status?: string;
}) => {
    const page  = Math.max(Number(params.page)  || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
    const skip  = (page - 1) * limit;

    const where: any = params.status ? { status: params.status } : {};

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take:    limit,
            orderBy: { createdAt: "desc" },
            include: paymentIncludes,
        }),
        prisma.payment.count({ where }),
    ]);

    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: payments,
    };
};

// ── Get My Payments (student or mentor) ───────────────────────────────────────
const getMyPaymentsDB = async (userId: string) => {
    return prisma.payment.findMany({
        where: { OR: [{ studentId: userId }, { mentorId: userId }] },
        include: paymentIncludes,
        orderBy: { createdAt: "desc" },
    });
};

// ── Get single payment ────────────────────────────────────────────────────────
const getSinglePaymentDB = async (paymentId: string, userId: string, userRole: string) => {
    const payment = await prisma.payment.findUnique({
        where:   { id: paymentId },
        include: paymentIncludes,
    });

    if (!payment) throw new Error("Payment not found");

    const isAdmin   = userRole === "ADMIN";
    const isStudent = payment.studentId === userId;
    const isMentor  = payment.mentorId  === userId;

    if (!isAdmin && !isStudent && !isMentor)
        throw new Error("You are not authorized to view this payment");

    return payment;
};

// ── Confirm payment (simulate gateway success / real gateway webhook) ─────────
// In production: verify webhook signature from Stripe/SSLCommerz before calling this.
const confirmPaymentDB = async (
    paymentId: string,
    userId:    string,
    userRole:  string,
    payload:   IPaymentConfirmPayload
) => {
    const { transactionId, provider } = validatePaymentConfirm(payload);

    const payment = await prisma.payment.findUnique({
        where:   { id: paymentId },
        include: { booking: true },
    });

    if (!payment) throw new Error("Payment not found");

    // Only the student or admin can confirm a payment
    if (userRole !== "ADMIN" && payment.studentId !== userId)
        throw new Error("You are not authorized to confirm this payment");

    if (payment.status !== "PENDING")
        throw new Error("Payment is already processed");

    return prisma.$transaction(async (tx) => {
        const updated = await tx.payment.update({
            where: { id: paymentId },
            data:  {
                status:        "HELD",
                transactionId,
                provider,
                paidAt:        new Date(),
                heldAt:        new Date(),
            },
        });

        // Move booking to ACCEPTED (mentor must then confirm → IN_PROGRESS)
        await tx.booking.update({
            where: { id: payment.bookingId },
            data:  { paymentStatus: "HELD", status: "ACCEPTED" },
        });

        return updated;
    });
};

// ── Admin: Release payment manually ──────────────────────────────────────────
const releasePaymentDB = async (paymentId: string, adminId: string, adminRole: string) => {
    if (adminRole !== "ADMIN") throw new Error("Only admin can release payments");

    const payment = await prisma.payment.findUnique({
        where:   { id: paymentId },
        include: { booking: true },
    });

    if (!payment) throw new Error("Payment not found");

    if (payment.status !== "HELD")
        throw new Error("Only HELD payments can be released");

    return prisma.$transaction(async (tx) => {
        const now = new Date();

        const updated = await tx.payment.update({
            where: { id: paymentId },
            data:  { status: "RELEASED", releasedAt: now, paidAt: now },
        });

        await tx.booking.update({
            where: { id: payment.bookingId },
            data:  { status: "COMPLETED", paymentStatus: "RELEASED" },
        });

        // Upsert payout — idempotent: don't create duplicate
        const existing = await tx.payout.findFirst({ where: { paymentId } });
        if (!existing) {
            await tx.payout.create({
                data: {
                    paymentId,
                    bookingId: payment.bookingId,
                    mentorId:  payment.mentorId,
                    amount:    payment.mentorAmount,
                    status:    "PENDING",
                },
            });
        }

        return updated;
    });
};

// ── Admin: Refund payment ─────────────────────────────────────────────────────
const refundPaymentDB = async (paymentId: string, adminRole: string) => {
    if (adminRole !== "ADMIN") throw new Error("Only admin can issue refunds");

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new Error("Payment not found");

    if (!["HELD", "PAID"].includes(payment.status))
        throw new Error("Only HELD or PAID payments can be refunded");

    return prisma.$transaction(async (tx) => {
        const updated = await tx.payment.update({
            where: { id: paymentId },
            data:  { status: "REFUNDED", refundedAt: new Date() },
        });
        await tx.booking.update({
            where: { id: payment.bookingId },
            data:  { status: "CANCELLED", paymentStatus: "REFUNDED" },
        });
        return updated;
    });
};

// ── Stats summary (admin dashboard) ──────────────────────────────────────────
const getPaymentStatsDB = async () => {
    const [total, held, released, pending, refunded, failed] = await Promise.all([
        prisma.payment.count(),
        prisma.payment.count({ where: { status: "HELD"     } }),
        prisma.payment.count({ where: { status: "RELEASED" } }),
        prisma.payment.count({ where: { status: "PENDING"  } }),
        prisma.payment.count({ where: { status: "REFUNDED" } }),
        prisma.payment.count({ where: { status: "FAILED"   } }),
    ]);

    const aggHeld     = await prisma.payment.aggregate({ where: { status: "HELD"     }, _sum: { amount: true } });
    const aggReleased = await prisma.payment.aggregate({ where: { status: "RELEASED" }, _sum: { amount: true } });
    const aggTotal    = await prisma.payment.aggregate({ _sum: { amount: true } });

    return {
        totalPayments:    total,
        heldPayments:     held,
        releasedPayments: released,
        pendingPayments:  pending,
        refundedPayments: refunded,
        failedPayments:   failed,
        heldAmount:       Number(aggHeld._sum.amount     ?? 0),
        releasedAmount:   Number(aggReleased._sum.amount ?? 0),
        totalAmount:      Number(aggTotal._sum.amount    ?? 0),
    };
};

export const paymentService = {
    getAllPaymentsDB,
    getMyPaymentsDB,
    getSinglePaymentDB,
    confirmPaymentDB,
    releasePaymentDB,
    refundPaymentDB,
    getPaymentStatsDB,
};
