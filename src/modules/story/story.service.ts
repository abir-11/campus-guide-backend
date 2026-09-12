import { prisma } from "../../lib/prisma";
import {
    IStoryCreatePayload,
    IStoryUpdatePayload,
    validateCreateStory,
    validateUpdateStory,
} from "./story.interface";

const createStoryDB = async (payload: IStoryCreatePayload) => {
    const data = validateCreateStory(payload);

    return prisma.story.create({
        data: {
            ...data,
            excerpt: data.excerpt ?? "",
        },
    });
};

const getPublishedStoriesDB = async () => {
    return prisma.story.findMany({
        where: {
            published: true,
        },
        orderBy: {
            date: "desc",
        },
    });
};

const updateStoryDB = async (storyId: string, payload: IStoryUpdatePayload) => {
    const data = validateUpdateStory(payload);

    const story = await prisma.story.findUnique({
        where: {
            id: storyId,
        },
    });

    if (!story) {
        throw new Error("Story not found");
    }

    return prisma.story.update({
        where: {
            id: storyId,
        },
        data: {
            ...data,
            excerpt: data.excerpt ?? undefined,
        },
    });
};

const deleteStoryDB = async (storyId: string) => {
    const story = await prisma.story.findUnique({
        where: {
            id: storyId,
        },
    });

    if (!story) {
        throw new Error("Story not found");
    }

    await prisma.story.delete({
        where: {
            id: storyId,
        },
    });

    return {
        message: "Story deleted successfully",
    };
};

export const storyService = {
    createStoryDB,
    getPublishedStoriesDB,
    updateStoryDB,
    deleteStoryDB,
};