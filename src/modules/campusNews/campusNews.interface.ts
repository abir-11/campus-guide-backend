import { NewsCategory, NewsStatus } from "../../../prisma/generated/prisma/enums";

export interface INewsCreatePayload {
  title: unknown;
  content: unknown;
  category?: unknown;
  image?: unknown;
  status?: unknown;
  publishedAt?: unknown;
}

export interface INewsUpdatePayload {
  title?: unknown;
  content?: unknown;
  category?: unknown;
  image?: unknown;
  status?: unknown;
  publishedAt?: unknown;
}

export interface IValidatedNews {
  title: string;
  content: string;
  category: NewsCategory;
  image: string | null;
  status: NewsStatus;
  publishedAt: Date | null;
}

export const validateCreateNews = (payload: INewsCreatePayload): IValidatedNews => {
  const { title, content, category, image, status, publishedAt } = payload;

  if (!title || typeof title !== "string") throw new Error("Title is required");
  if (!content || typeof content !== "string") throw new Error("Content is required");

  const validCategories = Object.values(NewsCategory);
  const validStatuses = Object.values(NewsStatus);

  const resolvedStatus =
    typeof status === "string" && validStatuses.includes(status as NewsStatus)
      ? (status as NewsStatus)
      : NewsStatus.DRAFT;

  return {
    title: title.trim(),
    content: content.trim(),
    category:
      typeof category === "string" && validCategories.includes(category as NewsCategory)
        ? (category as NewsCategory)
        : NewsCategory.GENERAL,
    image: typeof image === "string" && image.trim() ? image.trim() : null,
    status: resolvedStatus,
    publishedAt:
      resolvedStatus === NewsStatus.PUBLISHED
        ? publishedAt && !isNaN(new Date(publishedAt as string).getTime())
          ? new Date(publishedAt as string)
          : new Date()
        : null,
  };
};

export const validateUpdateNews = (payload: INewsUpdatePayload): Partial<IValidatedNews> => {
  const data: Partial<IValidatedNews> = {};
  const validCategories = Object.values(NewsCategory);
  const validStatuses = Object.values(NewsStatus);

  if (payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== "string") throw new Error("Valid title is required");
    data.title = payload.title.trim();
  }
  if (payload.content !== undefined) {
    if (!payload.content || typeof payload.content !== "string") throw new Error("Valid content is required");
    data.content = payload.content.trim();
  }
  if (payload.category !== undefined && typeof payload.category === "string" && validCategories.includes(payload.category as NewsCategory)) {
    data.category = payload.category as NewsCategory;
  }
  if (payload.image !== undefined) {
    data.image = typeof payload.image === "string" && payload.image.trim() ? payload.image.trim() : null;
  }
  if (payload.status !== undefined && typeof payload.status === "string" && validStatuses.includes(payload.status as NewsStatus)) {
    data.status = payload.status as NewsStatus;
    // Auto-set publishedAt when publishing
    if (data.status === NewsStatus.PUBLISHED && payload.publishedAt === undefined) {
      data.publishedAt = new Date();
    }
  }
  if (payload.publishedAt !== undefined) {
    if (payload.publishedAt && !isNaN(new Date(payload.publishedAt as string).getTime())) {
      data.publishedAt = new Date(payload.publishedAt as string);
    } else {
      data.publishedAt = null;
    }
  }

  return data;
};
