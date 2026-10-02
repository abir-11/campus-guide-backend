import { ResourceCategory, ResourceStatus } from "../../../prisma/generated/prisma/enums";

export interface IResourceCreatePayload {
  title: unknown;
  description?: unknown;
  category?: unknown;
  link: unknown;
  image?: unknown;
  status?: unknown;
}

export interface IResourceUpdatePayload {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  link?: unknown;
  image?: unknown;
  status?: unknown;
}

export interface IValidatedResource {
  title: string;
  description: string | null;
  category: ResourceCategory;
  link: string;
  image: string | null;
  status: ResourceStatus;
}

export const validateCreateResource = (
  payload: IResourceCreatePayload
): IValidatedResource => {
  const { title, description, category, link, image, status } = payload;

  if (!title || typeof title !== "string") throw new Error("Title is required");
  if (!link || typeof link !== "string") throw new Error("Link/URL is required");

  const validCategories = Object.values(ResourceCategory);
  const validStatuses = Object.values(ResourceStatus);

  return {
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : null,
    category:
      typeof category === "string" && validCategories.includes(category as ResourceCategory)
        ? (category as ResourceCategory)
        : ResourceCategory.OTHER,
    link: link.trim(),
    image: typeof image === "string" && image.trim() ? image.trim() : null,
    status:
      typeof status === "string" && validStatuses.includes(status as ResourceStatus)
        ? (status as ResourceStatus)
        : ResourceStatus.PENDING,
  };
};

export const validateUpdateResource = (
  payload: IResourceUpdatePayload
): Partial<IValidatedResource> => {
  const data: Partial<IValidatedResource> = {};
  const validCategories = Object.values(ResourceCategory);
  const validStatuses = Object.values(ResourceStatus);

  if (payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== "string")
      throw new Error("Valid title is required");
    data.title = payload.title.trim();
  }
  if (payload.description !== undefined) {
    data.description = typeof payload.description === "string" ? payload.description.trim() : null;
  }
  if (payload.category !== undefined) {
    if (typeof payload.category === "string" && validCategories.includes(payload.category as ResourceCategory)) {
      data.category = payload.category as ResourceCategory;
    }
  }
  if (payload.link !== undefined) {
    if (!payload.link || typeof payload.link !== "string")
      throw new Error("Valid link is required");
    data.link = payload.link.trim();
  }
  if (payload.image !== undefined) {
    data.image = typeof payload.image === "string" && payload.image.trim() ? payload.image.trim() : null;
  }
  if (payload.status !== undefined) {
    if (typeof payload.status === "string" && validStatuses.includes(payload.status as ResourceStatus)) {
      data.status = payload.status as ResourceStatus;
    }
  }

  return data;
};
