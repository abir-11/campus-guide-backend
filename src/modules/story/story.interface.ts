export interface IStoryCreatePayload {
    title: unknown;
    excerpt?: unknown;
    body: unknown;
    image?: unknown;
    published?: unknown;
    date?: unknown;
}

export interface IStoryUpdatePayload {
    title?: unknown;
    excerpt?: unknown;
    body?: unknown;
    image?: unknown;
    published?: unknown;
    date?: unknown;
}

export interface IValidatedStoryData {
    title: string;
    excerpt: string | null;
    body: string;
    image: string | null;
    published: boolean;
    date: Date;
}

export const validateCreateStory = (
    payload: IStoryCreatePayload
): IValidatedStoryData => {
    const { title, excerpt, body, image, published, date } = payload;

    if (!title || typeof title !== "string") {
        throw new Error("Title is required");
    }

    if (!body || typeof body !== "string") {
        throw new Error("Body is required");
    }

    if (published !== undefined && typeof published !== "boolean") {
        throw new Error("Published must be a boolean");
    }

    if (date && isNaN(new Date(date as string).getTime())) {
        throw new Error("Invalid date");
    }

    return {
        title: title.trim(),
        excerpt: typeof excerpt === "string" ? excerpt.trim() : null,
        body: body.trim(),
        image: typeof image === "string" ? image.trim() : null,
        published: published !== undefined ? (published as boolean) : false,
        date: date ? new Date(date as string) : new Date(),
    };
};

export const validateUpdateStory = (
    payload: IStoryUpdatePayload
): Partial<IValidatedStoryData> => {
    const data: Partial<IValidatedStoryData> = {};

    if (payload.title !== undefined) {
        if (!payload.title || typeof payload.title !== "string") {
            throw new Error("Valid title is required");
        }
        data.title = payload.title.trim();
    }

    if (payload.excerpt !== undefined) {
        data.excerpt = typeof payload.excerpt === "string" ? payload.excerpt.trim() : null;
    }

    if (payload.body !== undefined) {
        if (!payload.body || typeof payload.body !== "string") {
            throw new Error("Valid body is required");
        }
        data.body = payload.body.trim();
    }

    if (payload.image !== undefined) {
        data.image = typeof payload.image === "string" ? payload.image.trim() : null;
    }

    if (payload.published !== undefined) {
        if (typeof payload.published !== "boolean") {
            throw new Error("Published must be a boolean");
        }
        data.published = payload.published;
    }

    if (payload.date !== undefined) {
        if (payload.date && isNaN(new Date(payload.date as string).getTime())) {
            throw new Error("Invalid date");
        }
        data.date = payload.date ? new Date(payload.date as string) : undefined;
    }

    return data;
};