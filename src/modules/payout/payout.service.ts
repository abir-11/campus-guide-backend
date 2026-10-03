import { prisma } from "../../lib/prisma";

const payoutIncludes = {
    payment: { select: { id: true, amount: true, mentorAmount: true, platformFee: true, status: true } },
    booking: {
        select: {
            id:     true,
            status: true,
            service: { select: { id: true, name: true, category: true } },
            student: { select: { id: true, name: true, email: true } },
        },
    },
    mentor: { select: { id: true, name: true, email: true } },
} as const;

// ── Admin: all payouts ────────────────────────────────────────────────────────
const getAllPayoutsDB = async (params: { page?: number; limit?: number; status?: string }) => {
    const page  = Math.max(Number(params.page)  || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
    const skip  = (page - 1) * limit;
    const where: any = params.status ? { status: params.status } : {};

    const [payouts, total] = await Promise.all([
        prisma.payout.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: payoutIncludes }),
        prisma.payout.count({ where }),
    ]);

    return { meta: { page, limit, total, totalPage: Math.ceil(total / limit) }, data: payouts };
};

// ── Mentor: own payouts ───────────────────────────────────────────────────────
const getMyPayoutsDB = async (mentorId: string) => {
    return prisma.payout.findMany({
        where:   { mentorId },
        orderBy: { createdAt: "desc" },
        include: payoutIncludes,
    });
};

// ── Admin: process payout ─────────────────────────────────────────────────────
const processPayoutDB = async (payoutId: string, adminRole: string) => {
    if (adminRole !== "ADMIN") throw new Error("Only admin can process payouts");

    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new Error("Payout not found");

    if (payout.status !== "PENDING")
        throw new Error("Only PENDING payouts can be processed");

    return prisma.payout.update({
        where: { id: payoutId },
        data:  { status: "PROCESSING" },
        include: payoutIncludes,
    });
};

// ── Admin: mark payout as PAID ────────────────────────────────────────────────
const markPayoutPaidDB = async (payoutId: string, adminRole: string) => {
    if (adminRole !== "ADMIN") throw new Error("Only admin can mark payouts as paid");

    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new Error("Payout not found");

    if (payout.status !== "PROCESSING")
        throw new Error("Only PROCESSING payouts can be marked as paid");

    return prisma.payout.update({
        where: { id: payoutId },
        data:  { status: "PAID", releasedAt: new Date() },
        include: payoutIncludes,
    });
};

export const payoutService = { getAllPayoutsDB, getMyPayoutsDB, processPayoutDB, markPayoutPaidDB };
