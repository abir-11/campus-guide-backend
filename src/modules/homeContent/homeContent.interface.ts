export interface IHomeContentPayload {
    heroImage?: string | null;
    heroEyebrow?: string | null;
    heroTitle?: string | null;
    heroSub?: string | null;
    stats?: any[];
    serviceCards?: any[];
}

export interface IValidatedHomeContentData {
    heroImage?: string | null;
    heroEyebrow?: string | null;
    heroTitle?: string | null;
    heroSub?: string | null;
    stats?: any[];
    serviceCards?: any[];
}

export const validateHomeContent = (
    payload: IHomeContentPayload
): IValidatedHomeContentData => {
    const data: IValidatedHomeContentData = {};

    if (payload.heroImage !== undefined) {
        data.heroImage = typeof payload.heroImage === "string" ? payload.heroImage.trim() : null;
    }

    if (payload.heroEyebrow !== undefined) {
        data.heroEyebrow = typeof payload.heroEyebrow === "string" ? payload.heroEyebrow.trim() : null;
    }

    if (payload.heroTitle !== undefined) {
        data.heroTitle = typeof payload.heroTitle === "string" ? payload.heroTitle.trim() : null;
    }

    if (payload.heroSub !== undefined) {
        data.heroSub = typeof payload.heroSub === "string" ? payload.heroSub.trim() : null;
    }

    if (payload.stats !== undefined) {
        if (!Array.isArray(payload.stats)) {
            throw new Error("Stats must be an array");
        }
        data.stats = payload.stats;
    }

    if (payload.serviceCards !== undefined) {
        if (!Array.isArray(payload.serviceCards)) {
            throw new Error("Service cards must be an array");
        }
        data.serviceCards = payload.serviceCards;
    }

    return data;
};