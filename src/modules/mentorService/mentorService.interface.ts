// ======================================================
// INTERFACES
// ======================================================

export interface IMentorServiceCreatePayload {
    category: string;
    name: string;
    description: string;
    fee: number | string;
    mobile?: string | null;
    date?: string | Date | null;
    time?: string | null;
}

export interface IMentorServiceUpdatePayload {
    category?: string;
    name?: string;
    description?: string;
    fee?: number | string;
    mobile?: string | null;
    date?: string | Date | null;
    time?: string | null;
    image?: string | null;
    status?: string;
}

// Return type interface for validated data
export interface IValidatedServiceData {
    category?: string;
    name?: string;
    description?: string;
    fee?: number;
    mobile?: string | null;
    date?: Date | null;
    time?: string | null;
    image?: string | null;
    status?: string;
}


// ======================================================
// VALIDATE CREATE SERVICE PAYLOAD
// ======================================================

export const validateCreateMentorService = (
    payload: IMentorServiceCreatePayload
): Required<Omit<IValidatedServiceData, "status">> => {

    const {
        category,
        name,
        description,
        fee,
        mobile,
        date,
        time,
    } = payload;


    if (!category || typeof category !== "string") {
        throw new Error("Category is required");
    }

    if (!name || typeof name !== "string") {
        throw new Error("Service name is required");
    }

    if (!description || typeof description !== "string") {
        throw new Error("Description is required");
    }

    if (fee === undefined || fee === null || isNaN(Number(fee))) {
        throw new Error("Valid fee is required");
    }

    if (Number(fee) < 0) {
        throw new Error("Fee cannot be negative");
    }

    if (date && isNaN(new Date(date as string).getTime())) {
        throw new Error("Invalid date");
    }


    return {
        category: category.trim(),
        name: name.trim(),
        description: description.trim(),
        fee: Number(fee),
        mobile: mobile?.trim() || null,
        date: date ? new Date(date as string) : null,
        time: time?.trim() || null,
        image: null,
    };
};


// ======================================================
// VALIDATE UPDATE SERVICE PAYLOAD
// ======================================================

export const validateUpdateMentorService = (
    payload: IMentorServiceUpdatePayload
): IValidatedServiceData => {

    const data: IValidatedServiceData = {};

    // Category Validation
    if (payload.category !== undefined) {
        if (!payload.category || typeof payload.category !== "string") {
            throw new Error("Valid category is required");
        }
        data.category = payload.category.trim();
    }

    // Name Validation
    if (payload.name !== undefined) {
        if (!payload.name || typeof payload.name !== "string") {
            throw new Error("Valid service name is required");
        }
        data.name = payload.name.trim();
    }

    // Description Validation
    if (payload.description !== undefined) {
        if (!payload.description || typeof payload.description !== "string") {
            throw new Error("Valid description is required");
        }
        data.description = payload.description.trim();
    }

    // Fee Validation
    if (payload.fee !== undefined) {
        if (isNaN(Number(payload.fee))) {
            throw new Error("Valid fee is required");
        }
        if (Number(payload.fee) < 0) {
            throw new Error("Fee cannot be negative");
        }
        data.fee = Number(payload.fee);
    }

    // Mobile Validation
    if (payload.mobile !== undefined) {
        data.mobile = payload.mobile?.trim() || null;
    }

    // Date Validation
    if (payload.date !== undefined) {
        if (payload.date && isNaN(new Date(payload.date as string).getTime())) {
            throw new Error("Invalid date");
        }
        data.date = payload.date ? new Date(payload.date as string) : null;
    }

    // Time Validation
    if (payload.time !== undefined) {
        data.time = payload.time?.trim() || null;
    }

    // Image Validation
    if (payload.image !== undefined) {
        data.image = payload.image?.trim() || null;
    }

    // Status Validation
    if (payload.status !== undefined) {
        const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

        if (!allowedStatuses.includes(payload.status)) {
            throw new Error("Invalid service status");
        }
        data.status = payload.status;
    }

    return data;
};