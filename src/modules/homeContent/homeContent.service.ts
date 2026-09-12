import { prisma } from "../../lib/prisma";
import {
    IHomeContentPayload,
    validateHomeContent,
} from "./homeContent.interface";

const HOME_CONTENT_ID = "home-content";

const getHomeContentDB = async () => {
    let content = await prisma.homeContent.findUnique({
        where: {
            id: HOME_CONTENT_ID,
        },
    });

    if (!content) {
        content = await prisma.homeContent.create({
            data: {
                id: HOME_CONTENT_ID,
                heroImage: null,
                heroEyebrow: null,
                heroTitle: "",
                heroSub: null,
                stats: [],
                serviceCards: [],
            },
        });
    }

    return content;
};

const updateHomeContentDB = async (payload: IHomeContentPayload) => {
    const data = validateHomeContent(payload);

    return prisma.homeContent.upsert({
        where: {
            id: HOME_CONTENT_ID,
        },
        update: {
            ...data,
            heroTitle: data.heroTitle ?? undefined,
        },
        create: {
            id: HOME_CONTENT_ID,
            heroImage: data.heroImage ?? null,
            heroEyebrow: data.heroEyebrow ?? null,
            heroTitle: data.heroTitle ?? "",
            heroSub: data.heroSub ?? null,
            stats: data.stats ?? [],
            serviceCards: data.serviceCards ?? [],
        },
    });
};

export const homeContentService = {
    getHomeContentDB,
    updateHomeContentDB,
};