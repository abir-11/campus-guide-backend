export interface IBookingCreatePayload {
    serviceId: unknown;
    date:      unknown;
    time:      unknown;
    notes?:    unknown;
}

export interface IBookingActionPayload {
    action: unknown;
}

export interface IValidatedBookingData {
    serviceId: string;
    date:      Date;
    time:      string;
    notes:     string | null;
}

export interface IValidatedBookingAction {
    action: "accept" | "reject" | "confirm" | "start" | "complete" | "student_complete" | "cancel";
}

export const validateCreateBooking = (
    payload: IBookingCreatePayload
): IValidatedBookingData => {
    const { serviceId, date, time, notes } = payload;

    if (!serviceId || typeof serviceId !== "string")
        throw new Error("Valid Service ID is required");

    if (!date)
        throw new Error("Date is required");

    if (isNaN(new Date(date as string).getTime()))
        throw new Error("Invalid date");

    if (!time || typeof time !== "string")
        throw new Error("Valid Time is required");

    return {
        serviceId: serviceId.trim(),
        date:      new Date(date as string),
        time:      time.trim(),
        notes:     typeof notes === "string" ? notes.trim() : null,
    };
};

export const validateBookingAction = (
    payload: IBookingActionPayload
): IValidatedBookingAction => {
    const { action } = payload;

    const allowed = ["accept", "reject", "confirm", "start", "complete", "student_complete", "cancel"];

    if (!action || typeof action !== "string" || !allowed.includes(action.toLowerCase()))
        throw new Error(`Action must be one of: ${allowed.join(", ")}`);

    return { action: action.toLowerCase() as IValidatedBookingAction["action"] };
};
