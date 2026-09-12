export interface IMentorStatusPayload {
    status: unknown;
}

export const validateMentorStatus = (
    payload: IMentorStatusPayload
): { status: string } => {
    const { status } = payload;

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

    if (!status || typeof status !== "string" || !allowedStatuses.includes(status)) {
        throw new Error("Status must be PENDING, APPROVED or REJECTED");
    }

    return {
        status,
    };
};