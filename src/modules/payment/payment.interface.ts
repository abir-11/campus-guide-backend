export interface IPaymentConfirmPayload {
    transactionId: unknown;
    provider?:     unknown;
}

export interface IValidatedPaymentConfirm {
    transactionId: string;
    provider:      string;
}

export const validatePaymentConfirm = (
    payload: IPaymentConfirmPayload
): IValidatedPaymentConfirm => {
    const { transactionId, provider } = payload;
    if (!transactionId || typeof transactionId !== "string")
        throw new Error("Transaction ID is required");
    return {
        transactionId: transactionId.trim(),
        provider:      typeof provider === "string" ? provider.trim() : "manual",
    };
};
